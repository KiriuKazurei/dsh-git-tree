import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { apply } from '../src/index.js'

function git(cwd, ...args) {
  return execFileSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test Author',
      GIT_AUTHOR_EMAIL: 'author@example.com',
      GIT_COMMITTER_NAME: 'Test Committer',
      GIT_COMMITTER_EMAIL: 'committer@example.com',
      GIT_CONFIG_NOSYSTEM: '1',
    },
  })
}

async function createRepository() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-git-tree-api-'))
  git(root, 'init', '-b', 'main')
  git(root, 'config', 'user.name', 'Test Author')
  git(root, 'config', 'user.email', 'author@example.com')
  await writeFile(join(root, 'readme.md'), 'hello\n')
  git(root, 'add', '.')
  git(root, 'commit', '-m', 'initial commit')
  await writeFile(join(root, 'readme.md'), 'hello world\n')
  git(root, 'commit', '-am', 'second commit')
  return root
}

/** Mount the plugin against a recording fake connection and return its route. */
function mount(cwdBySession) {
  const routes = []
  const ctx = {
    sessions: {
      get: (sessionId) => (cwdBySession[sessionId] === undefined ? undefined : { header: { cwd: cwdBySession[sessionId] } }),
    },
    connection: {
      fetch: {
        register: (route) => {
          routes.push(route)
          return () => {}
        },
      },
    },
    effect: (factory) => factory(),
    get: () => undefined,
  }
  apply(ctx)
  assert.equal(routes.length, 1)
  return routes[0]
}

async function invoke(route, payload) {
  const response = await route.fetch(new Request('http://dsh.local/api/git-tree', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }))
  assert.equal(response.status, 200)
  return response.json()
}

test('the plugin registers one authenticated POST route', () => {
  const route = mount({})
  assert.equal(route.path, '/api/git-tree')
  assert.deepEqual(route.methods, ['POST'])
  assert.equal(route.requestBody, 'buffered')
})

test('snapshot resolves the session cwd and returns graph data', async (t) => {
  const root = await createRepository()
  t.after(() => rm(root, { recursive: true, force: true }))
  const route = mount({ s1: root })
  const payload = await invoke(route, { method: 'snapshot', params: { sessionId: 's1', max: 20 } })
  assert.equal(payload.ok, true)
  assert.equal(payload.value.isRepo, true)
  assert.equal(payload.value.branch, 'main')
  assert.equal(payload.value.commits.length, 2)
  assert.equal(payload.value.commits[0].subject, 'second commit')

  const hash = payload.value.commits[0].hash
  const detail = await invoke(route, { method: 'commit', params: { sessionId: 's1', hash } })
  assert.equal(detail.ok, true)
  assert.equal(detail.value.subject, 'second commit')
  assert.deepEqual(detail.value.files.map((file) => file.path), ['readme.md'])

  const diff = await invoke(route, { method: 'diff', params: { sessionId: 's1', hash } })
  assert.equal(diff.ok, true)
  assert.ok(diff.value.patch.includes('+hello world'))
})

test('an unknown method and a bad hash are reported as errors, not crashes', async (t) => {
  const root = await createRepository()
  t.after(() => rm(root, { recursive: true, force: true }))
  const route = mount({ s1: root })
  const unknown = await invoke(route, { method: 'nope', params: {} })
  assert.equal(unknown.ok, false)
  assert.equal(unknown.error.code, 'bad-request')

  const badHash = await invoke(route, { method: 'commit', params: { sessionId: 's1', hash: '--upload-pack=evil' } })
  assert.equal(badHash.ok, false)
  assert.equal(badHash.error.code, 'bad-request')
})

test('a session without a known directory is a typed error', async () => {
  const route = mount({})
  const payload = await invoke(route, { method: 'snapshot', params: { sessionId: 'missing' } })
  assert.equal(payload.ok, false)
  assert.equal(payload.error.code, 'no-directory')
})
