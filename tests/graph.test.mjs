import assert from 'node:assert/strict'
import test from 'node:test'
import { layoutGraph } from '../src/client/graph.js'

test('linear history stays on one lane', () => {
  const layout = layoutGraph([
    { hash: 'c3', parents: ['c2'] },
    { hash: 'c2', parents: ['c1'] },
    { hash: 'c1', parents: [] },
  ])
  assert.equal(layout.laneCount, 1)
  assert.deepEqual(layout.rows.map((row) => row.lane), [0, 0, 0])
  assert.equal(layout.rows[0].parents[0].row, 1)
  assert.equal(layout.rows[2].parents.length, 0)
})

test('a merge opens a second lane and connects both parents', () => {
  const layout = layoutGraph([
    { hash: 'merge', parents: ['a', 'b'] },
    { hash: 'a', parents: ['base'] },
    { hash: 'b', parents: ['base'] },
    { hash: 'base', parents: [] },
  ])
  assert.ok(layout.laneCount >= 2)
  const merge = layout.rows[0]
  assert.equal(merge.lane, 0)
  assert.equal(merge.parents.length, 2)
  assert.notEqual(merge.parents[0].lane, merge.parents[1].lane)
  assert.equal(merge.parents[0].row, 1)
  assert.equal(merge.parents[1].row, 2)
  // Both branches converge on the shared base row.
  assert.equal(layout.rows[1].parents[0].row, 3)
  assert.equal(layout.rows[2].parents[0].row, 3)
})

test('a rebased branch is a separate lane meeting its base', () => {
  const layout = layoutGraph([
    { hash: 'replayed-2', parents: ['replayed-1'] },
    { hash: 'replayed-1', parents: ['base'] },
    { hash: 'base', parents: ['older'] },
    { hash: 'older', parents: [] },
  ])
  assert.equal(layout.rows[0].lane, 0)
  assert.equal(layout.rows[1].lane, 0)
  assert.equal(layout.rows[2].lane, 0)
  assert.equal(layout.rows[2].parents[0].row, 3)
})

test('empty history produces an empty layout', () => {
  const layout = layoutGraph([])
  assert.deepEqual(layout.rows, [])
  assert.equal(layout.laneCount, 1)
  assert.equal(layout.height, 0)
})

test('a truncated parent leaves a dangling edge instead of throwing', () => {
  const layout = layoutGraph([{ hash: 'tip', parents: ['missing'] }])
  assert.equal(layout.rows[0].parents[0].row, null)
  assert.equal(layout.rows[0].parents[0].lane, 0)
})
