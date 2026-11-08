import assert from 'node:assert/strict'
import test from 'node:test'
import { detectLanguage, mergeFileEntries, parseDiff, tokenizeLine } from '../src/client/diff.js'

const PATCH = [
  'diff --git a/AGENTS.md b/AGENTS.md',
  'index b98c983..8849b04 100644',
  '--- a/AGENTS.md',
  '+++ b/AGENTS.md',
  '@@ -36,6 +36,9 @@',
  ' 沙箱模式下删除工作区既有文件可能被 deny ACE 拒绝',
  '-旧的一行',
  '+新的一行',
  '+## 改完之后',
  '+  - 列表项',
  ' 另一行上下文',
  'diff --git a/src/app.js b/src/app.js',
  'index 1111111..2222222 100644',
  '--- a/src/app.js',
  '+++ b/src/app.js',
  '@@ -1,2 +1,3 @@ export function run',
  '-const x = 1',
  '+const x = 2',
  '+return "hi"',
  '',
].join('\n')

test('detectLanguage maps common repository files', () => {
  assert.equal(detectLanguage('AGENTS.md'), 'markdown')
  assert.equal(detectLanguage('src/app.tsx'), 'js')
  assert.equal(detectLanguage('package.json'), 'json')
  assert.equal(detectLanguage('scripts/build.ps1'), 'shell')
  assert.equal(detectLanguage('README'), 'text')
})

test('parseDiff keeps files, hunk line numbers and add/delete counts', () => {
  const files = parseDiff(PATCH)
  assert.equal(files.length, 2)
  assert.equal(files[0].path, 'AGENTS.md')
  assert.equal(files[0].language, 'markdown')
  assert.equal(files[1].path, 'src/app.js')
  assert.equal(files[1].language, 'js')
  assert.equal(files[0].additions, 3)
  assert.equal(files[0].deletions, 1)
  assert.equal(files[1].additions, 2)
  assert.equal(files[1].deletions, 1)

  const lines = files[0].lines
  const hunk = lines.find((line) => line.type === 'hunk')
  assert.equal(hunk.text, '@@ -36,6 +36,9 @@')
  // `---`/`+++` must be metadata, not a deletion/addition.
  assert.ok(lines.some((line) => line.type === 'meta' && line.text.startsWith('--- ')))
  assert.ok(lines.some((line) => line.type === 'meta' && line.text.startsWith('+++ ')))

  const context = lines.find((line) => line.type === 'context')
  assert.equal(context.oldNo, 36)
  assert.equal(context.newNo, 36)
  const deletion = lines.find((line) => line.type === 'del')
  assert.equal(deletion.oldNo, 37)
  assert.equal(deletion.newNo, null)
  const additions = lines.filter((line) => line.type === 'add')
  assert.deepEqual(additions.map((line) => line.newNo), [37, 38, 39])
  assert.equal(additions[1].text, '## 改完之后')
  assert.equal(additions[1].tokens[0].kind, 'heading')
})

test('parseDiff does not invent a context line from the trailing newline', () => {
  const files = parseDiff(PATCH)
  assert.equal(files[1].lines.at(-1).type, 'add')
  assert.equal(files[1].lines.filter((line) => line.type === 'hunk' || line.type === 'add' || line.type === 'del').length, 4)
})

test('parseDiff renders a plain unified diff without a git header', () => {
  const files = parseDiff([
    '--- a/file.txt',
    '+++ b/file.txt',
    '@@ -1 +1 @@',
    '-old',
    '+new',
  ].join('\n'))
  assert.equal(files.length, 1)
  assert.equal(files[0].path, '')
  assert.equal(files[0].lines.filter((line) => line.type === 'add').length, 1)
})

test('tokenizeLine highlights JS keywords, strings and numbers', () => {
  const tokens = tokenizeLine('const answer = 42 // note', 'js')
  assert.ok(tokens.some((token) => token.kind === 'keyword' && token.text === 'const'))
  assert.ok(tokens.some((token) => token.kind === 'number' && token.text === '42'))
  assert.ok(tokens.some((token) => token.kind === 'comment' && token.text.includes('note')))

  const stringTokens = tokenizeLine('return "hi"', 'js')
  assert.ok(stringTokens.some((token) => token.kind === 'string' && token.text === '"hi"'))
})

test('tokenizeLine highlights Markdown structure', () => {
  const heading = tokenizeLine('## 改完之后', 'markdown')
  assert.equal(heading.length, 1)
  assert.equal(heading[0].kind, 'heading')

  const bullet = tokenizeLine('  - 列表项', 'markdown')
  assert.ok(bullet.some((token) => token.kind === 'punct'))

  const inline = tokenizeLine('`code` 和 **粗体**', 'markdown')
  assert.ok(inline.some((token) => token.kind === 'code'))
  assert.ok(inline.some((token) => token.kind === 'strong'))
})

test('mergeFileEntries keeps patch order and appends stats-only files', () => {
  const diffFiles = [
    { path: 'src/app.js', additions: 2, deletions: 1, lines: [] },
    { path: 'doc/readme.md', additions: 4, deletions: 0, lines: [] },
  ]
  const statFiles = [
    { path: 'assets/logo.png', added: 0, deleted: 0, binary: true },
    { path: 'src/app.js', added: 2, deleted: 1, binary: false },
    { path: 'doc/readme.md', added: 4, deleted: 0, binary: false },
  ]
  const entries = mergeFileEntries(diffFiles, statFiles)
  assert.deepEqual(entries.map((entry) => entry.path), ['src/app.js', 'doc/readme.md', 'assets/logo.png'])
  assert.equal(entries[0].diff, diffFiles[0])
  assert.equal(entries[0].inPatch, true)
  assert.equal(entries[2].diff, null)
  assert.equal(entries[2].binary, true)
  assert.equal(entries[2].inPatch, false)
})

test('tokenizeLine tolerates unterminated strings and empty lines', () => {
  assert.deepEqual(tokenizeLine('', 'js'), [])
  const tokens = tokenizeLine('const x = "unterminated', 'js')
  assert.ok(tokens.some((token) => token.kind === 'string' && token.text.endsWith('unterminated')))
})

