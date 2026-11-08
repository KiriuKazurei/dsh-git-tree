/**
 * dsh-git-tree — Host half.
 *
 * One authenticated exact Fetch route, `POST /api/git-tree`, mounted on the
 * connection's shared `/api` handler (so browser auth and the Host/Origin
 * fence are the same as every other API call). It reads the repository of the
 * requesting Session's working directory with the system `git` binary and
 * returns machine-readable data for the floating graph and the right Sidebar
 * detail tab.
 *
 * Read-only by construction: every command below is a query (`rev-parse`,
 * `log`, `for-each-ref`, `status`, `rev-list`, `show` with `--format=`), all
 * run with `-C <cwd>`, `--no-pager`, `-c color.ui=false`, and a timeout. No
 * library and no cached repository state, so a commit made by the agent shows
 * up on the next request.
 */
import { spawn } from 'node:child_process'
import { basename } from 'node:path'

export const name = 'dsh-git-tree'

/** `connection` carries the authenticated `/api` route; `sessions` resolves the Session cwd. */
export const inject = ['connection', 'sessions']

const FIELD = '\x1f'
const RECORD = '\x1e'
const DEFAULT_MAX_COMMITS = 140
const MAX_COMMITS = 400
const MAX_STDOUT_BYTES = 16 * 1024 * 1024
const MAX_FILES = 500
const MAX_DIFF_BYTES = 512 * 1024
const COMMAND_TIMEOUT_MS = 20_000
const MAX_REQUEST_BYTES = 64 * 1024

/** A command/request failure the client can present as text. */
export class GitTreeError extends Error {
  /**
   * @param {string} message - human-readable message.
   * @param {string} code - stable machine code for the client.
   */
  constructor(message, code = 'git-error') {
    super(message)
    this.name = 'GitTreeError'
    this.code = code
  }
}

function clampInt(value, fallback, min, max) {
  const number = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(number)))
}

/**
 * Run one git command.
 * @param {string} cwd - directory the command starts in (`git -C`).
 * @param {string[]} args - git arguments.
 * @param {number} [timeoutMs] - kill budget.
 * @returns {Promise<string>} stdout.
 */
export function runGit(cwd, args, timeoutMs = COMMAND_TIMEOUT_MS) {
  const full = ['-C', cwd, '--no-pager', '-c', 'color.ui=false', ...args]
  return new Promise((resolvePromise, reject) => {
    const child = spawn('git', full, {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      env: {
        ...process.env,
        GIT_OPTIONAL_LOCKS: '0',
        GIT_TERMINAL_PROMPT: '0',
        GIT_PAGER: 'cat',
        LC_ALL: 'C',
      },
    })
    let stdout = ''
    let stderr = ''
    let bytes = 0
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try {
        child.kill()
      } catch {
        // Already gone.
      }
      reject(error)
    }
    const timer = setTimeout(() => {
      fail(new GitTreeError(`git ${args[0] ?? ''} timed out after ${timeoutMs}ms`, 'git-timeout'))
    }, timeoutMs)
    child.stdout.on('data', (chunk) => {
      bytes += chunk.length
      if (bytes > MAX_STDOUT_BYTES) {
        fail(new GitTreeError(`git ${args[0] ?? ''} produced too much output`, 'git-output-limit'))
        return
      }
      stdout += chunk.toString('utf8')
    })
    child.stderr.on('data', (chunk) => {
      // stderr is only diagnostic; keep the tail bounded.
      stderr = (stderr + chunk.toString('utf8')).slice(-8192)
    })
    child.on('error', (error) => {
      fail(new GitTreeError(`cannot run git: ${error.message}`, 'git-missing'))
    })
    child.on('close', (code) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (code === 0) {
        resolvePromise(stdout)
      } else {
        reject(new GitTreeError(stderr.trim() || `git exited with ${String(code)}`, 'git-error'))
      }
    })
  })
}

/** Snapshot of every branch type this build reports. */
export const BRANCH_KINDS = /** @type {const} */ (['local', 'remote'])

/**
 * Parse one `%D` decoration string (`HEAD -> main, origin/main, tag: v1`).
 * @param {string} text - decoration column.
 * @returns {{name: string, kind: 'head'|'tag'|'remote'|'branch'}[]} refs.
 */
export function parseDecorations(text) {
  if (typeof text !== 'string' || text.trim() === '') return []
  const refs = []
  for (const raw of text.split(',')) {
    let value = raw.trim()
    if (value === '') continue
    if (value.startsWith('HEAD -> ')) {
      refs.push({ name: value.slice('HEAD -> '.length), kind: 'head' })
    } else if (value === 'HEAD') {
      refs.push({ name: 'HEAD', kind: 'head' })
    } else if (value.startsWith('tag: ')) {
      refs.push({ name: value.slice('tag: '.length), kind: 'tag' })
    } else if (value.includes('/')) {
      // `origin/main`, `fork/feature/x`: decoration names never carry spaces.
      refs.push({ name: value, kind: 'remote' })
    } else {
      refs.push({ name: value, kind: 'branch' })
    }
  }
  return refs
}

/**
 * Parse `git log --pretty=format:%H%x1f%P%x1f%h%x1f%an%x1f%ae%x1f%ad%x1f%D%x1f%s%x1f%b%x1e`.
 * @param {string} output - raw git output.
 * @returns {object[]} commits newest first.
 */
export function parseLog(output) {
  const commits = []
  for (const record of output.split(RECORD)) {
    const line = record.replace(/^\n/, '')
    if (line === '') continue
    const fields = line.split(FIELD)
    const [hash, parents, short, author, email, date, decorations, subject] = fields
    if (!hash || hash.length < 4) continue
    const body = fields.slice(8).join(FIELD).trim()
    commits.push({
      hash,
      short: short ?? hash.slice(0, 7),
      parents: (parents ?? '').split(' ').filter((parent) => parent !== ''),
      author: author ?? '',
      email: email ?? '',
      date: date ?? '',
      subject: subject ?? '',
      body,
      refs: parseDecorations(decorations ?? ''),
    })
  }
  return commits
}

/**
 * Parse `git for-each-ref --format=%(refname)%00...(newline records)`.
 * @param {string} output - raw git output.
 * @returns {object[]} branches.
 */
export function parseBranches(output) {
  const branches = []
  for (const line of output.split('\n')) {
    if (line.trim() === '') continue
    const [refname, short, hash, head, upstream, track, date] = line.split('\0')
    if (!refname) continue
    if (refname.startsWith('refs/remotes/') && refname.endsWith('/HEAD')) continue
    const remote = refname.startsWith('refs/remotes/')
    const trackText = track ?? ''
    const ahead = /ahead (\d+)/.exec(trackText)
    const behind = /behind (\d+)/.exec(trackText)
    branches.push({
      name: short ?? refname.replace(/^refs\/(heads|remotes)\//, ''),
      ref: refname,
      hash: hash ?? '',
      current: head === '*',
      remote,
      kind: remote ? 'remote' : 'local',
      upstream: upstream || null,
      ahead: ahead ? Number.parseInt(ahead[1], 10) : 0,
      behind: behind ? Number.parseInt(behind[1], 10) : 0,
      gone: trackText.includes('gone'),
      date: date ?? '',
    })
  }
  return branches
}

/**
 * Count working-tree entries from `git status --porcelain=v1 -z`.
 * @param {string} output - NUL-framed porcelain output.
 * @returns {{changed: number, staged: number, unstaged: number, untracked: number, conflicted: number, clean: boolean}} summary.
 */
export function parseWorkingTree(output) {
  const tokens = output.split('\0')
  let staged = 0
  let unstaged = 0
  let untracked = 0
  let conflicted = 0
  let changed = 0
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token === undefined || token === '') continue
    const xy = token.slice(0, 2)
    changed += 1
    if (xy === '??') {
      untracked += 1
      continue
    }
    if (xy[0] === 'R' || xy[0] === 'C') {
      // The origin path is the next NUL field.
      if (tokens[index + 1] !== undefined && tokens[index + 1] !== '') index += 1
    }
    const x = xy[0]
    const y = xy[1]
    if (x === 'U' || y === 'U' || (x === 'A' && y === 'A') || (x === 'D' && y === 'D')) conflicted += 1
    if (x !== ' ' && x !== '?') staged += 1
    if (y !== ' ' && y !== '?') unstaged += 1
  }
  return { changed, staged, unstaged, untracked, conflicted, clean: changed === 0 }
}

/** Values that may be shown as one commit hash. */
const HASH_PATTERN = /^[0-9a-f]{4,64}$/i

function requireHash(value) {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new GitTreeError('invalid commit hash', 'bad-request')
  }
  return value
}

/**
 * Read one repository's overview, branches, working-tree summary, and graph data.
 * @param {string} cwd - Session working directory inside the repository.
 * @param {{max?: number}} [options] - commit budget.
 * @returns {Promise<object>} snapshot; `{isRepo:false}` outside a work tree.
 */
export async function repoSnapshot(cwd, options = {}) {
  if (typeof cwd !== 'string' || cwd === '') {
    throw new GitTreeError('the session has no working directory', 'no-directory')
  }
  const max = clampInt(options.max, DEFAULT_MAX_COMMITS, 10, MAX_COMMITS)
  let root
  try {
    root = (await runGit(cwd, ['rev-parse', '--show-toplevel'])).trim()
  } catch {
    return { isRepo: false, cwd, root: null, generatedAt: Date.now() }
  }
  const [branch, head, upstream, refsOut, logOut, statusOut, stashOut] = await Promise.all([
    runGit(root, ['rev-parse', '--abbrev-ref', 'HEAD']).then((value) => value.trim()).catch(() => 'HEAD'),
    runGit(root, ['rev-parse', '--short', 'HEAD']).then((value) => value.trim()).catch(() => ''),
    runGit(root, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'])
      .then((value) => value.trim())
      .catch(() => null),
    runGit(root, [
      'for-each-ref',
      '--format=%(refname)%00%(refname:short)%00%(objectname:short)%00%(HEAD)%00%(upstream:short)%00%(upstream:track)%00%(committerdate:iso-strict)',
      'refs/heads',
      'refs/remotes',
    ]),
    runGit(root, [
      'log',
      '--all',
      '--topo-order',
      '--decorate=short',
      '--date=iso-strict',
      `--max-count=${String(max)}`,
      `--pretty=format:%H${FIELD}%P${FIELD}%h${FIELD}%an${FIELD}%ae${FIELD}%ad${FIELD}%D${FIELD}%s${FIELD}%b${RECORD}`,
    ]),
    runGit(root, ['status', '--porcelain=v1', '-z', '--untracked-files=normal']),
    runGit(root, ['stash', 'list', '--format=%gd']).catch(() => ''),
  ])
  const branches = parseBranches(refsOut)
  const commits = parseLog(logOut)
  let ahead = 0
  let behind = 0
  if (upstream !== null) {
    try {
      const counts = (await runGit(root, ['rev-list', '--left-right', '--count', `HEAD...${upstream}`])).trim()
      const [aheadText, behindText] = counts.split(/\s+/)
      ahead = Number.parseInt(aheadText ?? '0', 10) || 0
      behind = Number.parseInt(behindText ?? '0', 10) || 0
    } catch {
      // Upstream can disappear between the two calls; a missing count is not an error.
    }
  }
  return {
    isRepo: true,
    cwd,
    root,
    name: basename(root) || root,
    branch,
    detached: branch === 'HEAD',
    head,
    upstream,
    ahead,
    behind,
    branches,
    commits,
    working: parseWorkingTree(statusOut),
    stash: stashOut.split('\n').filter((line) => line.trim() !== '').length,
    truncated: commits.length >= max,
    max,
    generatedAt: Date.now(),
  }
}

/**
 * One commit's metadata and changed-file statistics.
 * @param {string} cwd - any directory inside the repository.
 * @param {string} hash - commit hash.
 * @returns {Promise<object>} detail.
 */
export async function commitDetail(cwd, hash) {
  const valid = requireHash(hash)
  const root = await repoRootOf(cwd)
  const [metaOut, numstatOut] = await Promise.all([
    runGit(root, [
      'show',
      '-s',
      '--date=iso-strict',
      `--format=%H${FIELD}%P${FIELD}%h${FIELD}%an${FIELD}%ae${FIELD}%ad${FIELD}%cn${FIELD}%cd${FIELD}%s${FIELD}%b`,
      valid,
    ]),
    runGit(root, ['show', '--numstat', '--format=', '-m', '--first-parent', '--no-renames', valid]).catch(() => ''),
  ])
  const [full, parents, short, author, email, date, committer, commitDate, subject] = metaOut.split(FIELD)
  const files = []
  let insertions = 0
  let deletions = 0
  for (const line of numstatOut.split('\n')) {
    if (line.trim() === '') continue
    const [added, removed, ...pathParts] = line.split('\t')
    const path = pathParts.join('\t')
    if (!path) continue
    const addedNumber = /^\d+$/.test(added ?? '') ? Number.parseInt(added, 10) : 0
    const removedNumber = /^\d+$/.test(removed ?? '') ? Number.parseInt(removed, 10) : 0
    insertions += addedNumber
    deletions += removedNumber
    if (files.length < MAX_FILES) {
      files.push({
        path,
        added: addedNumber,
        deleted: removedNumber,
        binary: added === '-' || removed === '-',
      })
    }
  }
  return {
    hash: full ?? valid,
    short: short ?? valid.slice(0, 7),
    parents: (parents ?? '').split(' ').filter(Boolean),
    author: author ?? '',
    email: email ?? '',
    date: date ?? '',
    committer: committer ?? '',
    commitDate: commitDate ?? '',
    subject: subject ?? '',
    body: metaOut.split(FIELD).slice(9).join(FIELD).trim(),
    files,
    filesTruncated: files.length >= MAX_FILES,
    insertions,
    deletions,
  }
}

/**
 * Full patch text of one commit, diffed against its first parent.
 * @param {string} cwd - any directory inside the repository.
 * @param {string} hash - commit hash.
 * @returns {Promise<{patch: string, truncated: boolean, bytes: number}>} patch.
 */
export async function commitDiff(cwd, hash) {
  const valid = requireHash(hash)
  const root = await repoRootOf(cwd)
  const patch = await runGit(root, [
    'show',
    '--no-color',
    '--no-ext-diff',
    '--no-renames',
    '--format=',
    '-m',
    '--first-parent',
    valid,
  ])
  const truncated = patch.length > MAX_DIFF_BYTES
  return {
    patch: truncated ? patch.slice(0, MAX_DIFF_BYTES) : patch,
    truncated,
    bytes: Buffer.byteLength(patch, 'utf8'),
  }
}

/**
 * Repository top level for a directory (throws outside a work tree).
 * @param {string} cwd - directory.
 * @returns {Promise<string>} root.
 */
async function repoRootOf(cwd) {
  try {
    const root = (await runGit(cwd, ['rev-parse', '--show-toplevel'])).trim()
    if (root !== '') return root
  } catch {
    // Fall through to the shared error.
  }
  throw new GitTreeError('not inside a git work tree', 'not-repo')
}

/**
 * Resolve a Session's authoritative working directory.
 * @param {import('@deepseek-ai/cordis').Context} ctx - host context.
 * @param {string} sessionId - Session id from the client.
 * @returns {Promise<string>} absolute directory.
 */
async function sessionCwdOf(ctx, sessionId) {
  const session = ctx.sessions?.get?.(sessionId)
  const direct = session?.header?.cwd
  if (typeof direct === 'string' && direct !== '') return direct
  const persistence = ctx.get('sessionPersistence')
  if (persistence !== undefined && typeof persistence.inspect === 'function') {
    try {
      const inspected = await persistence.inspect(sessionId)
      const cwd = inspected?.meta?.cwd
      if (typeof cwd === 'string' && cwd !== '') return cwd
    } catch {
      // A cold/unpersisted session simply has no directory to offer.
    }
  }
  throw new GitTreeError('the session working directory is not known yet', 'no-directory')
}

function requireSessionId(params) {
  const value = params?.sessionId
  if (typeof value !== 'string' || value === '' || value.length > 200) {
    throw new GitTreeError('sessionId is required', 'bad-request')
  }
  return value
}

function jsonResponse(payload) {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

/**
 * Host plugin body: mount the authenticated git-tree API.
 * @param {import('@deepseek-ai/cordis').Context} ctx - host context.
 */
export function apply(ctx) {
  const handlers = {
    /**
     * @param {{sessionId?: unknown, max?: unknown}} params - request.
     * @returns {Promise<object>} snapshot.
     */
    snapshot: async (params) => {
      const cwd = await sessionCwdOf(ctx, requireSessionId(params))
      return repoSnapshot(cwd, { max: params?.max })
    },
    /**
     * @param {{sessionId?: unknown, hash?: unknown}} params - request.
     * @returns {Promise<object>} commit detail.
     */
    commit: async (params) => {
      const cwd = await sessionCwdOf(ctx, requireSessionId(params))
      return commitDetail(cwd, requireHash(params?.hash))
    },
    /**
     * @param {{sessionId?: unknown, hash?: unknown}} params - request.
     * @returns {Promise<object>} commit patch.
     */
    diff: async (params) => {
      const cwd = await sessionCwdOf(ctx, requireSessionId(params))
      return commitDiff(cwd, requireHash(params?.hash))
    },
  }

  ctx.effect(() => ctx.connection.fetch.register({
    path: '/api/git-tree',
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: async (request) => {
      try {
        const text = await request.text()
        if (text.length > MAX_REQUEST_BYTES) {
          throw new GitTreeError('request body is too large', 'bad-request')
        }
        const body = JSON.parse(text)
        const handler = handlers[body?.method]
        if (typeof handler !== 'function') {
          throw new GitTreeError(`unknown method: ${String(body?.method)}`, 'bad-request')
        }
        return jsonResponse({ ok: true, value: await handler(body.params ?? {}) })
      } catch (error) {
        const failure = error instanceof GitTreeError
          ? { code: error.code, message: error.message }
          : { code: 'git-error', message: error instanceof Error ? error.message : String(error) }
        return jsonResponse({ ok: false, error: failure })
      }
    },
  }), 'dsh-git-tree: /api/git-tree route')
}
