/**
 * Pure diff parsing and lightweight syntax highlighting for the detail pane.
 *
 * `parseDiff` turns the Host's unified patch into file groups with typed rows
 * (file header, meta, hunk, add, del, context), old/new line numbers, and
 * per-line tokens. Keeping it free of React makes both the parser and the
 * tokenizer unit-testable; the view only maps tokens to spans.
 */

/** File extension to tokenizer language. */
const LANGUAGE_BY_EXTENSION = {
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'markdown',
  js: 'js',
  jsx: 'js',
  mjs: 'js',
  cjs: 'js',
  ts: 'js',
  tsx: 'js',
  json: 'json',
  jsonc: 'json',
  css: 'css',
  scss: 'css',
  less: 'css',
  html: 'html',
  htm: 'html',
  xml: 'html',
  svg: 'html',
  py: 'python',
  go: 'go',
  rs: 'rust',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  ps1: 'shell',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'toml',
  sql: 'sql',
}

/**
 * Pick a tokenizer for a repository path.
 * @param {string} path - file path from the diff header.
 * @returns {string} language id.
 */
export function detectLanguage(path) {
  const clean = String(path ?? '').split('#')[0].split('?')[0]
  const dot = clean.lastIndexOf('.')
  if (dot === -1) return 'text'
  const extension = clean.slice(dot + 1).toLowerCase()
  return LANGUAGE_BY_EXTENSION[extension] ?? 'text'
}

const JS_KEYWORDS = new Set((
  'const let var function return if else for while do switch case break continue new class extends super '
  + 'import export from default async await try catch finally throw typeof instanceof in of this null undefined '
  + 'true false interface type enum implements public private protected readonly static as satisfies delete void yield '
  + 'declare namespace abstract keyof infer is'
).split(' '))

const PYTHON_KEYWORDS = new Set((
  'def class import from return if elif else for while try except finally with as lambda pass break continue raise '
  + 'yield global nonlocal assert del in is not and or None True False async await match case'
).split(' '))

const GO_KEYWORDS = new Set((
  'package import func return if else for range switch case break continue var const type struct interface map chan '
  + 'go defer select nil true false fallthrough goto'
).split(' '))

const RUST_KEYWORDS = new Set((
  'fn let mut const static struct enum impl trait pub use mod crate super self Self return if else match for while '
  + 'loop break continue async await move ref dyn where unsafe true false Some None Ok Err as in'
).split(' '))

const SHELL_KEYWORDS = new Set((
  'if then else elif fi for in do done case esac while until function return local export exit set unset echo '
  + 'read shift source alias printf true false'
).split(' '))

const SQL_KEYWORDS = new Set((
  'select from where insert into values update set delete create table alter drop join left right inner outer on '
  + 'group by order having limit offset as and or not null is in like distinct union all exists between primary key '
  + 'foreign references index view begin commit rollback'
).split(' '))

/** Per-language scanner configuration. */
const CONFIGS = {
  js: { line: ['//'], block: [['/*', '*/']], strings: ['"', "'", '`'], keywords: JS_KEYWORDS },
  json: { strings: ['"'], keywords: new Set(['true', 'false', 'null']) },
  css: {
    block: [['/*', '*/']],
    strings: ['"', "'"],
    keywords: new Set(['important', 'media', 'supports', 'keyframes', 'import', 'from', 'to']),
  },
  python: { line: ['#'], strings: ['"', "'"], keywords: PYTHON_KEYWORDS },
  go: { line: ['//'], block: [['/*', '*/']], strings: ['"', "'", '`'], keywords: GO_KEYWORDS },
  rust: { line: ['//'], block: [['/*', '*/']], strings: ['"', "'"], keywords: RUST_KEYWORDS },
  shell: { line: ['#'], strings: ['"', "'"], keywords: SHELL_KEYWORDS },
  sql: { line: ['--'], block: [['/*', '*/']], strings: ["'", '"'], keywords: SQL_KEYWORDS, lower: true },
  yaml: { line: ['#'], strings: ['"', "'"], keywords: new Set(['true', 'false', 'null']) },
  toml: { line: ['#'], strings: ['"', "'"], keywords: new Set(['true', 'false']) },
  html: { block: [['<!--', '-->']], strings: ['"', "'"], keywords: new Set([]) },
  text: { keywords: new Set() },
}

function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character)
}

function isIdentifierPart(character) {
  return /[A-Za-z0-9_$]/.test(character)
}

/**
 * Tokenize one line of source text. The scanner is intentionally small and
 * language-agnostic: comments, strings, numbers and keywords, with Markdown
 * handled separately. It never throws on unbalanced quotes.
 * @param {string} text - source line.
 * @param {string} language - tokenizer id.
 * @returns {{text: string, kind: string}[]} tokens covering the line.
 */
export function tokenizeLine(text, language = 'text') {
  if (typeof text !== 'string' || text === '') return []
  if (language === 'markdown') return tokenizeMarkdown(text)
  const config = CONFIGS[language] ?? CONFIGS.text
  const tokens = []
  let plain = ''
  let index = 0
  const flush = () => {
    if (plain !== '') {
      tokens.push({ text: plain, kind: 'plain' })
      plain = ''
    }
  }
  while (index < text.length) {
    let handled = false
    for (const [open, close] of config.block ?? []) {
      if (text.startsWith(open, index)) {
        flush()
        const end = text.indexOf(close, index + open.length)
        const stop = end === -1 ? text.length : end + close.length
        tokens.push({ text: text.slice(index, stop), kind: 'comment' })
        index = stop
        handled = true
        break
      }
    }
    if (handled) continue
    for (const open of config.line ?? []) {
      if (text.startsWith(open, index)) {
        flush()
        tokens.push({ text: text.slice(index), kind: 'comment' })
        index = text.length
        handled = true
        break
      }
    }
    if (handled) continue

    const character = text[index]
    if ((config.strings ?? []).includes(character)) {
      flush()
      let cursor = index + 1
      while (cursor < text.length) {
        if (text[cursor] === '\\') {
          cursor += 2
          continue
        }
        if (text[cursor] === character) {
          cursor += 1
          break
        }
        cursor += 1
      }
      tokens.push({ text: text.slice(index, cursor), kind: 'string' })
      index = cursor
      continue
    }
    if (/[0-9]/.test(character) && !isIdentifierPart(text[index - 1] ?? '')) {
      flush()
      let cursor = index + 1
      while (cursor < text.length && /[0-9a-fA-FxX._]/.test(text[cursor])) cursor += 1
      tokens.push({ text: text.slice(index, cursor), kind: 'number' })
      index = cursor
      continue
    }
    if (isIdentifierStart(character)) {
      flush()
      let cursor = index + 1
      while (cursor < text.length && isIdentifierPart(text[cursor])) cursor += 1
      const word = text.slice(index, cursor)
      const candidate = config.lower ? word.toLowerCase() : word
      if (config.keywords?.has(candidate)) {
        tokens.push({ text: word, kind: 'keyword' })
      } else {
        plain += word
      }
      index = cursor
      continue
    }
    plain += character
    index += 1
  }
  flush()
  return tokens
}

/**
 * Markdown inline tokenizer for diff lines: headings, inline code, bold,
 * links, tags, list markers and blockquotes.
 * @param {string} text - one Markdown line.
 * @returns {{text: string, kind: string}[]} tokens.
 */
function tokenizeMarkdown(text) {
  if (/^\s{0,3}#{1,6}\s/.test(text)) return [{ text, kind: 'heading' }]
  const tokens = []
  const pattern = /(`[^`]*`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\[[^\]]+\]\([^)]*\))|(<[^>]+>)|(^>+)|(^\s*(?:[-*+]|\d+\.)\s)/g
  let last = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) tokens.push({ text: text.slice(last, match.index), kind: 'plain' })
    tokens.push({
      text: match[0],
      kind: match[1] ? 'code' : match[2] || match[3] ? 'strong' : match[4] ? 'link' : match[5] ? 'tag' : 'punct',
    })
    last = match.index + match[0].length
  }
  if (last < text.length) tokens.push({ text: text.slice(last), kind: 'plain' })
  return tokens.length > 0 ? tokens : [{ text, kind: 'plain' }]
}

/**
 * Extract the post-image path from a `diff --git a/x b/x` header.
 * @param {string} line - header line.
 * @returns {string} path, or '' when the header is unusual.
 */
function parseGitPath(line) {
  const match = /^diff --git a\/(.+?) b\/(.+)$/.exec(line)
  if (match) return match[2]
  return ''
}

/**
 * Merge the parsed patch groups with the Host's numstat list so every changed
 * file gets one accordion entry, in patch order, with stats-only files (binary
 * or cut off by the patch cap) appended.
 * @param {object[]} diffFiles - `parseDiff` file groups.
 * @param {{path: string, added?: number, deleted?: number, binary?: boolean}[]} statFiles - Host commit files.
 * @returns {{
 *   path: string,
 *   diff: object|null,
 *   additions: number,
 *   deletions: number,
 *   binary: boolean,
 *   inPatch: boolean,
 * }[]} accordion entries.
 */
export function mergeFileEntries(diffFiles, statFiles) {
  const entries = []
  const byPath = new Map()
  for (const file of diffFiles ?? []) {
    const path = file.path || ''
    if (byPath.has(path)) continue
    const entry = {
      path,
      diff: file,
      additions: file.additions,
      deletions: file.deletions,
      binary: false,
      inPatch: true,
    }
    byPath.set(path, entry)
    entries.push(entry)
  }
  for (const file of statFiles ?? []) {
    const path = file.path || ''
    const existing = byPath.get(path)
    if (existing) {
      // Host counts are authoritative for binary files and cover the whole
      // commit even when the patch text was cut off.
      if (Number.isFinite(file.added)) existing.additions = file.added
      if (Number.isFinite(file.deleted)) existing.deletions = file.deleted
      existing.binary = Boolean(file.binary)
      continue
    }
    const entry = {
      path,
      diff: null,
      additions: Number.isFinite(file.added) ? file.added : 0,
      deletions: Number.isFinite(file.deleted) ? file.deleted : 0,
      binary: Boolean(file.binary),
      inPatch: false,
    }
    byPath.set(path, entry)
    entries.push(entry)
  }
  return entries
}

/**
 * Parse a unified patch into file groups ready for rendering.
 * @param {string} patch - `git show` patch text.
 * @returns {{
 *   path: string,
 *   language: string,
 *   additions: number,
 *   deletions: number,
 *   lines: {
 *     type: 'meta'|'hunk'|'add'|'del'|'context',
 *     text: string,
 *     oldNo: number|null,
 *     newNo: number|null,
 *     tokens?: {text: string, kind: string}[],
 *   }[],
 * }[]} file groups.
 */
export function parseDiff(patch) {
  const files = []
  if (typeof patch !== 'string' || patch === '') return files
  let current = null
  let oldNo = 0
  let newNo = 0

  for (const raw of patch.split('\n')) {
    if (raw.startsWith('diff --git ')) {
      const path = parseGitPath(raw)
      current = {
        path,
        language: detectLanguage(path),
        additions: 0,
        deletions: 0,
        lines: [],
      }
      files.push(current)
      oldNo = 0
      newNo = 0
      continue
    }
    if (current === null) {
      // A patch without `diff --git` (e.g. a plain unified diff): still render it.
      current = { path: '', language: 'text', additions: 0, deletions: 0, lines: [] }
      files.push(current)
    }
    if (raw.startsWith('@@')) {
      const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(raw)
      if (match) {
        oldNo = Number(match[1])
        newNo = Number(match[3])
      }
      current.lines.push({ type: 'hunk', text: raw, oldNo: null, newNo: null })
      continue
    }
    if (raw.startsWith('+') && !raw.startsWith('+++')) {
      const text = raw.slice(1)
      current.additions += 1
      current.lines.push({
        type: 'add',
        text,
        oldNo: null,
        newNo: newNo++,
        tokens: tokenizeLine(text, current.language),
      })
      continue
    }
    if (raw.startsWith('-') && !raw.startsWith('---')) {
      const text = raw.slice(1)
      current.deletions += 1
      current.lines.push({
        type: 'del',
        text,
        oldNo: oldNo++,
        newNo: null,
        tokens: tokenizeLine(text, current.language),
      })
      continue
    }
    if (raw.startsWith(' ')) {
      const text = raw.slice(1)
      current.lines.push({
        type: 'context',
        text,
        oldNo: oldNo++,
        newNo: newNo++,
        tokens: tokenizeLine(text, current.language),
      })
      continue
    }
    if (raw === '') continue
    current.lines.push({ type: 'meta', text: raw, oldNo: null, newNo: null })
  }
  return files
}
