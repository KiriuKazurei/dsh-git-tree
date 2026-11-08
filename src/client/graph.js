/**
 * Pure Git graph lane assignment for the floating widget and the detail pane.
 *
 * The input is `git log --all --topo-order` (newest first): every commit names
 * its parent hashes. A first parent continues the commit's own lane, so a
 * branch renders as one straight vertical chain; every additional parent
 * (a merge) opens or reuses another lane, which is what draws the fork/merge
 * shape. A rebased branch is simply a chain replayed on a new base, so it
 * appears as its own lane meeting the base at the first replayed commit.
 *
 * Lanes are compacted at the bottom of the list only, so a lane keeps a
 * stable x position for as long as it is alive instead of jumping left as
 * branches end.
 */

/** Horizontal distance between two lanes, in CSS pixels. */
export const LANE_WIDTH = 12

/** Height of one commit row, in CSS pixels. */
export const ROW_HEIGHT = 22

/** Lane palette: host theme accents first, then stable graph hues. */
export const LANE_COLORS = [
  'var(--dsw-alias-brand-primary, #4c8dff)',
  'var(--dsw-alias-state-success-primary, #2ecc71)',
  'var(--dsw-alias-state-warn-primary, #f0a020)',
  'var(--dsw-alias-state-error-primary, #e5484d)',
  '#a371f7',
  '#39c5cf',
  '#db61a2',
  '#8b949e',
]

/**
 * Assign lanes and parent edges to a newest-first commit list.
 * @param {{hash: string, parents?: string[]}[]} commits - topo-ordered commits.
 * @returns {{
 *   rows: {commit: object, index: number, lane: number, color: string, parents: {hash: string, lane: number, row: number|null}[]}[],
 *   laneCount: number,
 *   laneWidth: number,
 *   rowHeight: number,
 *   height: number,
 * }} layout.
 */
export function layoutGraph(commits) {
  const lanes = []
  const rows = []
  const rowByHash = new Map()
  let nextColor = 0

  const allocateLane = () => {
    const empty = lanes.findIndex((lane) => lane.hash === null)
    if (empty >= 0) return empty
    lanes.push({ hash: null, color: LANE_COLORS[nextColor++ % LANE_COLORS.length] })
    return lanes.length - 1
  }

  for (let index = 0; index < commits.length; index += 1) {
    const commit = commits[index]
    const parents = Array.isArray(commit.parents) ? commit.parents.filter(Boolean) : []
    let lane = lanes.findIndex((candidate) => candidate.hash === commit.hash)
    if (lane < 0) lane = allocateLane()
    const color = lanes[lane].color

    // A hash can be expected by several lanes after a criss-cross merge; keep
    // the leftmost one and release the others.
    for (let other = lane + 1; other < lanes.length; other += 1) {
      if (lanes[other].hash === commit.hash) lanes[other] = { hash: null, color: lanes[other].color }
    }

    const parentLanes = []
    if (parents.length === 0) {
      lanes[lane] = { hash: null, color }
    } else {
      lanes[lane] = { hash: parents[0], color }
      parentLanes.push(lane)
      for (let parentIndex = 1; parentIndex < parents.length; parentIndex += 1) {
        const wanted = parents[parentIndex]
        let parentLane = lanes.findIndex((candidate, candidateIndex) => candidateIndex !== lane && candidate.hash === wanted)
        if (parentLane < 0) {
          parentLane = allocateLane()
          lanes[parentLane] = { hash: wanted, color: lanes[parentLane].color }
        }
        parentLanes.push(parentLane)
      }
    }

    rows.push({
      commit,
      index,
      lane,
      color,
      parents: parents.map((hash, parentIndex) => ({
        hash,
        lane: parentLanes[parentIndex] ?? lane,
        row: null,
      })),
    })
    rowByHash.set(commit.hash, index)

    while (lanes.length > 0 && lanes[lanes.length - 1].hash === null) lanes.pop()
  }

  // Resolve each parent's row now that every commit has a position.
  for (const row of rows) {
    for (const parent of row.parents) {
      const parentIndex = rowByHash.get(parent.hash)
      parent.row = parentIndex === undefined ? null : parentIndex
    }
  }

  const maxLane = rows.reduce(
    (highest, row) => Math.max(highest, row.lane, ...row.parents.map((parent) => parent.lane)),
    0,
  )
  const laneCount = rows.length === 0 ? 1 : maxLane + 1

  return {
    rows,
    laneCount,
    laneWidth: LANE_WIDTH,
    rowHeight: ROW_HEIGHT,
    height: rows.length * ROW_HEIGHT,
  }
}

/**
 * X center of a lane.
 * @param {number} lane - zero-based lane.
 * @returns {number} pixel center.
 */
export function laneX(lane) {
  return lane * LANE_WIDTH + LANE_WIDTH / 2 + 1
}

/**
 * Y center of a row.
 * @param {number} index - zero-based row index.
 * @returns {number} pixel center.
 */
export function rowY(index) {
  return index * ROW_HEIGHT + ROW_HEIGHT / 2
}
