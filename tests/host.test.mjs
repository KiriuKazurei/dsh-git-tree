import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  commitDetail,
  commitDiff,
  parseDecorations,
  parseLog,
  parseWorkingTree,
  repoSnapshot,
} from '../src/index.js'

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
  const root = await mkdtemp(join(tmpdir(), 'dsh-git-tree-'))
  git(root, 'init', '-b', 'main')
  git(root, 'config', 'user.name', 'Test Author')
  git(root, 'config', 'user.email', 'author@example.com')
  await writeFile(join(root, 'base.txt'), 'base\n')
  git(root, 'add', '.')
  git(root, 'commit', '-m', 'base commit')
  git(root, 'checkout', '-b', 'feature')
  await writeFile(join(root, 'feature.txt'), 'feature\n')
  git(root, 'add', '.')
  git(root, 'commit', '-m', 'feature work')
  git(root, 'checkout', 'main')
  await writeFile(join(root, 'main.txt'), 'main\n')
  git(root, 'add', '.')
  git(root, 'commit', '-m', 'main work')
  git(root, 'merge', '--no-ff', '-m', 'merge feature', 'feature')
  return root
}

test('parseDecorations classifies head, branch, remote and tag refs', () => {
  assert.deepEqual(parseDecorations('HEAD -> main, origin/main, tag: v1.0.0'), [
    { name: 'main', kind: 'head' },
    { name: 'origin/main', kind: 'remote' },
    { name: 'v1.0.0', kind: 'tag' },
  ])
  assert.deepEqual(parseDecorations(''), [])
})

test('parseLog keeps parents, body and refs', () => {
  const output = [
    `aaaa${'\x1f'}bbbb cccc${'\x1f'}aaaa${'\x1f'}Ann${'\x1f'}ann@example.com${'\x1f'}2026-01-02T03:04:05+08:00${'\x1f'}HEAD -> main${'\x1f'}subject line${'\x1f'}body line 1`,
    'body line 2',
    '',
  ].join('\n') + '\x1e'
  const commits = parseLog(output)
  assert.equal(commits.length, 1)
  assert.deepEqual(commits[0].parents, ['bbbb', 'cccc'])
  assert.equal(commits[0].subject, 'subject line')
  assert.equal(commits[0].body, 'body line 1\nbody line 2')
  assert.deepEqual(commits[0].refs, [{ name: 'main', kind: 'head' }])
})

test('parseWorkingTree summarises staged, unstaged, untracked and conflicts', () => {
  const summary = parseWorkingTree(' M a.txt\0M  b.txt\0?? c.txt\0UU d.txt\0')
  assert.equal(summary.changed, 4)
  assert.equal(summary.unstaged, 2)
  assert.equal(summary.staged, 2)
  assert.equal(summary.untracked, 1)
  assert.equal(summary.conflicted, 1)
  assert.equal(summary.clean, false)
})

test('repoSnapshot reads branches, graph parents and working state', async (t) => {
  const root = await createRepository()
  t.after(() => rm(root, { recursive: true, force: true }))
  const snapshot = await repoSnapshot(root, { max: 40 })
  assert.equal(snapshot.isRepo, true)
  assert.equal(snapshot.root.replace(/\\/g, '/'), root.replace(/\\/g, '/'))
  assert.equal(snapshot.branch, 'main')
  assert.equal(snapshot.detached, false)
  const names = snapshot.branches.map((branch) => branch.name)
  assert.ok(names.includes('main'))
  assert.ok(names.includes('feature'))
  assert.ok(snapshot.branches.find((branch) => branch.name === 'main').current)

  const merge = snapshot.commits.find((commit) => commit.subject === 'merge feature')
  assert.ok(merge, 'merge commit is present')
  assert.equal(merge.parents.length, 2)
  assert.equal(snapshot.commits[0].hash, merge.hash)
  assert.ok(snapshot.working.clean)
  const headRefs = snapshot.commits[0].refs.map((ref) => ref.name)
  assert.ok(headRefs.includes('main'), `HEAD decoration should name main, got ${JSON.stringify(headRefs)}`)

  const detail = await commitDetail(root, merge.hash)
  assert.equal(detail.subject, 'merge feature')
  assert.ok(detail.files.length >= 1)
  assert.ok(detail.insertions >= 1)

  const diff = await commitDiff(root, merge.hash)
  assert.ok(diff.patch.includes('feature.txt'))
})

test('repoSnapshot reports a non-repository directory', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-git-tree-plain-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const snapshot = await repoSnapshot(root)
  assert.equal(snapshot.isRepo, false)
  assert.equal(snapshot.root, null)
})
