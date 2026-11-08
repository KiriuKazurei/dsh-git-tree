/**
 * dsh-git-tree — Client half.
 *
 * Two surfaces share one data source (`POST /api/git-tree`):
 *
 *  1. `shell.overlay` — a fixed floating card outside every column's scroll
 *     container. It never scrolls away with the conversation. Hovering a
 *     commit shows its time, hash and description; clicking opens the detail
 *     tab in the built-in right Sidebar.
 *  2. `sidebar.right.pane.tab` — the full detail view (branch chips, the whole
 *     graph, commit metadata, changed files and the patch) registered as a
 *     right-Sidebar tab type so `ctx.sidebarRight.openTab('git-graph')` can
 *     expand it. If that service is absent the widget falls back to its own
 *     edge-anchored drawer, so the click still works.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import styles from './styles.css'
import { LANE_COLORS, layoutGraph, laneX, rowY } from './graph.js'
import { mergeFileEntries, parseDiff } from './diff.js'

/** Required Client services. */
export const inject = ['slots', 'locale', 'uiSession']

const NS = 'dshGitTree'
const KIND = 'git-graph'
const TAB_ID = 'dsh-git-tree'
const API = 'api/git-tree'
const WIDGET_MAX_COMMITS = 60
const DETAIL_MAX_COMMITS = 240
/** Left inset between the card border and the first graph lane (px). */
const GRAPH_INSET = 3
/** Safety cap: a 512 KiB patch can exceed this, and thousands of React rows stall the pane. */
const MAX_DIFF_ROWS = 4000

const en = {
  'tab.title': 'Git graph',
  'widget.title': 'Git tree',
  'widget.loading': 'Reading the Git graph…',
  'widget.noSession': 'No active conversation',
  'widget.noSessionHint': 'Open a conversation to see its project Git graph.',
  'widget.notRepo': 'The working directory is not a Git repository',
  'widget.error': 'Could not read the repository',
  'widget.retry': 'Retry',
  'widget.refresh': 'Refresh',
  'widget.details': 'Open details',
  'widget.collapse': 'Collapse',
  'widget.expand': 'Expand Git tree',
  'widget.detached': 'detached HEAD',
  'widget.clean': 'clean',
  'widget.changed': '{count} changed',
  'widget.ahead': '{count} ahead',
  'widget.behind': '{count} behind',
  'widget.branches': '{count} branches',
  'widget.commits': '{count} commits',
  'widget.stash': '{count} stashed',
  'widget.hint': 'Hover a commit for time, hash and message · click for details',
  'widget.drag': 'Drag to move the Git overlay',
  'widget.loadMore': 'Showing the newest {count} commits',
  'detail.title': 'Git details',
  'detail.close': 'Close',
  'detail.back': 'Back to graph',
  'detail.author': 'Author',
  'detail.date': 'Date',
  'detail.committer': 'Committer',
  'detail.hash': 'Commit',
  'detail.parents': 'Parents',
  'detail.refs': 'Refs',
  'detail.stat': '{files} files · +{insertions} −{deletions}',
  'detail.patch': 'Patch',
  'detail.wrap': 'Wrap',
  'detail.fileCount': '{count} files',
  'detail.linesTruncated': 'Only the first {count} diff lines are rendered.',
  'detail.expandFile': "Show this file's changes",
  'detail.collapseFile': "Hide this file's changes",
  'detail.collapseAll': 'Collapse all',
  'detail.binaryFile': 'Binary file — no textual diff.',
  'detail.noFileDiff': 'No patch text for this file (possibly cut off by the size limit).',
  'detail.diffError': 'Could not load the patch',
  'detail.loading': 'Loading…',
  'detail.noDiff': 'No textual difference (merge or empty commit).',
  'detail.merge': 'merge',
  'detail.root': 'Repository',
  'detail.working': 'Working tree',
  'detail.branches': 'Branches',
  'detail.commits': 'History',
  'detail.empty': 'No commits yet.',
  'detail.copyHash': 'Copy full hash',
  'detail.copied': 'Copied',
  'detail.truncated': 'Only the newest {count} commits are shown.',
  'detail.filesTruncated': 'Only the first {count} changed files are shown.',
  'detail.diffTruncated': 'The patch is too large and was cut off.',
  'time.now': 'just now',
  'time.minutes': '{count} min ago',
  'time.hours': '{count} h ago',
  'time.days': '{count} d ago',
}

const zh = {
  'tab.title': 'Git 树',
  'widget.title': 'Git 树',
  'widget.loading': '正在读取 Git 树…',
  'widget.noSession': '当前没有选中的会话',
  'widget.noSessionHint': '打开一个会话后显示其项目的 Git 树。',
  'widget.notRepo': '当前工作目录不是 Git 仓库',
  'widget.error': '读取仓库失败',
  'widget.retry': '重试',
  'widget.refresh': '刷新',
  'widget.details': '展开详情',
  'widget.collapse': '收起',
  'widget.expand': '展开 Git 树',
  'widget.detached': '游离 HEAD',
  'widget.clean': '干净',
  'widget.changed': '{count} 处改动',
  'widget.ahead': '领先 {count}',
  'widget.behind': '落后 {count}',
  'widget.branches': '{count} 个分支',
  'widget.commits': '{count} 次提交',
  'widget.stash': '{count} 个贮藏',
  'widget.hint': '悬停查看提交时间、哈希与描述 · 点击展开详情',
  'widget.drag': '拖动悬浮窗',
  'widget.loadMore': '仅显示最新 {count} 次提交',
  'detail.title': 'Git 详情',
  'detail.close': '关闭',
  'detail.back': '返回图形',
  'detail.author': '作者',
  'detail.date': '时间',
  'detail.committer': '提交者',
  'detail.hash': '提交',
  'detail.parents': '父提交',
  'detail.refs': '引用',
  'detail.stat': '{files} 个文件 · +{insertions} −{deletions}',
  'detail.patch': '改动',
  'detail.wrap': '自动换行',
  'detail.fileCount': '{count} 个文件',
  'detail.linesTruncated': '仅渲染前 {count} 行改动。',
  'detail.expandFile': '展开此文件改动',
  'detail.collapseFile': '折叠此文件改动',
  'detail.collapseAll': '全部折叠',
  'detail.binaryFile': '二进制文件，无文本改动。',
  'detail.noFileDiff': '此文件没有 patch 文本（可能因改动过大被截断）。',
  'detail.diffError': '改动加载失败',
  'detail.loading': '加载中…',
  'detail.noDiff': '没有文本改动（合并或空提交）。',
  'detail.merge': '合并',
  'detail.root': '仓库',
  'detail.working': '工作区',
  'detail.branches': '分支',
  'detail.commits': '历史',
  'detail.empty': '还没有提交。',
  'detail.copyHash': '复制完整哈希',
  'detail.copied': '已复制',
  'detail.truncated': '仅显示最新 {count} 次提交。',
  'detail.filesTruncated': '仅显示前 {count} 个改动文件。',
  'detail.diffTruncated': '改动过大，已截断显示。',
  'time.now': '刚刚',
  'time.minutes': '{count} 分钟前',
  'time.hours': '{count} 小时前',
  'time.days': '{count} 天前',
}

const MESSAGES = { en, zh }

/**
 * The floating card and the right-Sidebar tab body live in the same bundle,
 * so a click can carry the exact commit across `openTab` (which focuses an
 * already-open tab instead of remounting it). A lazy "latest" slot covers a
 * body that mounts after the click; live listeners cover an open body.
 */
const detailRequests = {
  latest: null,
  listeners: new Set(),
  request(hash) {
    this.latest = hash
    for (const listener of this.listeners) listener(hash)
  },
  consume() {
    const value = this.latest
    this.latest = null
    return value
  },
}

/** Subscribe one component to a plain snapshot store (the Client store shape). */
function useSource(source) {
  const subscribe = useCallback((listener) => source.subscribe(listener), [source])
  const getSnapshot = useCallback(() => source.getSnapshot(), [source])
  return useSyncExternalStore(subscribe, getSnapshot)
}

async function callApi(method, params) {
  const response = await fetch(API, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method, params }),
  })
  if (!response.ok) throw new Error(`git-tree HTTP ${response.status}`)
  const payload = await response.json()
  if (!payload || payload.ok !== true) {
    throw new Error(payload?.error?.message || 'git-tree request failed')
  }
  return payload.value
}

function useSnapshot(sessionId, { max = DETAIL_MAX_COMMITS, intervalMs = 7000, enabled = true } = {}) {
  const [state, setState] = useState({ phase: 'loading', snapshot: null, error: null })
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision((value) => value + 1), [])

  useEffect(() => {
    if (!sessionId || !enabled) {
      setState({ phase: 'idle', snapshot: null, error: null })
      return undefined
    }
    let active = true
    let timer = 0
    const load = async () => {
      try {
        const snapshot = await callApi('snapshot', { sessionId, max })
        if (active) setState({ phase: 'ready', snapshot, error: null })
      } catch (error) {
        if (active) {
          setState((previous) => ({
            phase: 'error',
            snapshot: previous.snapshot,
            error: error instanceof Error ? error.message : String(error),
          }))
        }
      }
    }
    setState((previous) => ({ phase: previous.snapshot ? 'ready' : 'loading', snapshot: previous.snapshot, error: null }))
    void load()
    if (intervalMs > 0) {
      timer = window.setInterval(() => {
        if (document.visibilityState === 'visible') void load()
      }, intervalMs)
    }
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [sessionId, max, intervalMs, enabled, revision])

  return [state, reload]
}

const ANCHOR_KEY = 'dsh.gitTree.anchor'
const LEGACY_POSITION_KEY = 'dsh.gitTree.position'
/** Keep in sync with `.dshg-widget { width }` in styles.css. */
const CARD_WIDTH = 256

/**
 * Read the anchored position (`right`/`top` in viewport pixels). A value
 * written by the pre-anchor build (`x`/`y`) is returned as a legacy pair and
 * migrated once the card is measurable.
 */
function readStoredAnchor() {
  try {
    const raw = window.localStorage.getItem(ANCHOR_KEY)
    if (raw) {
      const value = JSON.parse(raw)
      if (value && value.v === 2 && Number.isFinite(value.right) && Number.isFinite(value.top)) {
        return { right: value.right, top: value.top }
      }
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_POSITION_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw)
      if (legacy && Number.isFinite(legacy.x) && Number.isFinite(legacy.y)) {
        return { legacyX: legacy.x, legacyY: legacy.y }
      }
    }
  } catch {
    // Storage is optional; fall back to the default corner.
  }
  return null
}

function persistAnchor(anchor) {
  try {
    if (anchor === null) {
      window.localStorage.removeItem(ANCHOR_KEY)
      return
    }
    window.localStorage.setItem(ANCHOR_KEY, JSON.stringify({
      v: 2,
      right: Math.round(anchor.right),
      top: Math.round(anchor.top),
    }))
  } catch {
    // Storage is optional.
  }
}

function formatDateTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso || ''
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatRelative(iso, tr) {
  const time = new Date(iso).getTime()
  if (!Number.isFinite(time)) return ''
  const delta = Date.now() - time
  if (delta < 60_000) return tr('time.now')
  if (delta < 3_600_000) return tr('time.minutes', { count: Math.floor(delta / 60_000) })
  if (delta < 86_400_000) return tr('time.hours', { count: Math.floor(delta / 3_600_000) })
  if (delta < 30 * 86_400_000) return tr('time.days', { count: Math.floor(delta / 86_400_000) })
  return formatDateTime(iso)
}

function refLabel(ref) {
  return ref.kind === 'head' ? ref.name : ref.name
}

function branchChipClass(branch) {
  return `dshg-chip${branch.current ? ' dshg-chip-current' : ''}${branch.remote ? ' dshg-chip-remote' : ''}`
}

function laneColor(index) {
  return LANE_COLORS[index % LANE_COLORS.length]
}

function BranchGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" className="dshg-glyph">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M4 4.2v7.6" />
        <path d="M12 6.2v1.2c0 1.4-1.1 2.5-2.5 2.5H6.5" />
      </g>
      <g fill="currentColor">
        <circle cx="4" cy="3" r="1.5" />
        <circle cx="4" cy="13" r="1.5" />
        <circle cx="12" cy="4.6" r="1.5" />
      </g>
    </svg>
  )
}

function ExpandGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M9.5 3h3.5v3.5M6.5 13H3V9.5M13 3 9 7M3 13l4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M13 8a5 5 0 1 1-1.6-3.7M13 3v3h-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M10 4 6 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CaretGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DirtyDot({ working, tr }) {
  if (working === undefined || working === null) return null
  if (working.clean) {
    return <span className="dshg-clean" title={tr('widget.clean')} aria-label={tr('widget.clean')} />
  }
  return (
    <span
      className="dshg-dirty"
      title={`${tr('widget.changed', { count: working.changed })}${working.conflicted > 0 ? ' · conflict' : ''}`}
      aria-label={tr('widget.changed', { count: working.changed })}
    />
  )
}

function RefChips({ refs, tr, limit = 4 }) {
  if (!Array.isArray(refs) || refs.length === 0) return null
  return (
    <span className="dshg-refs">
      {refs.slice(0, limit).map((ref) => (
        <span key={`${ref.kind}:${ref.name}`} className={`dshg-ref dshg-ref-${ref.kind}`} title={refLabel(ref)}>
          {refLabel(ref)}
        </span>
      ))}
    </span>
  )
}

/**
 * Draw the lane/edge canvas for a list of graph rows.
 * @param {{layout: object, graphWidth: number, headShort: string, selected?: string, onSelect?: Function, onHover?: Function, timeLabel?: Function}} props - render input.
 * @returns {JSX.Element} graph.
 */
function GraphCanvas({ layout, graphWidth, headShort, selected, onSelect, onHover, timeLabel }) {
  const { rows, rowHeight, height } = layout
  return (
    <div className="dshg-canvas" style={{ height }}>
      <div className="dshg-graph" style={{ width: graphWidth, left: GRAPH_INSET }}>
        <svg width={graphWidth} height={height} aria-hidden="true">
          {rows.map((row) => row.parents.map((parent) => {
            const x1 = laneX(row.lane)
            const y1 = rowY(row.index)
            const x2 = laneX(parent.lane)
            const y2 = parent.row === null ? height - rowHeight / 2 : rowY(parent.row)
            const mid = y1 + (y2 - y1) / 2
            return (
              <path
                key={`${row.commit.hash}:${parent.hash}`}
                d={`M ${x1} ${y1} C ${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`}
                fill="none"
                stroke={laneColor(row.lane)}
                strokeWidth="1.6"
                strokeOpacity="0.85"
              />
            )
          }))}
          {rows.map((row) => {
            const isHead = headShort !== '' && (row.commit.short === headShort || row.commit.hash.startsWith(headShort))
            return (
              <g key={row.commit.hash}>
                {isHead ? (
                  <circle cx={laneX(row.lane)} cy={rowY(row.index)} r="5.4" fill="none" stroke={laneColor(row.lane)} strokeWidth="1.4" strokeOpacity="0.55" />
                ) : null}
                <circle
                  cx={laneX(row.lane)}
                  cy={rowY(row.index)}
                  r={row.commit.parents.length > 1 ? '4.2' : '3.5'}
                  fill={laneColor(row.lane)}
                  stroke="var(--dsw-alias-bg-layer-1, #1b1c1f)"
                  strokeWidth="1.4"
                />
              </g>
            )
          })}
        </svg>
      </div>
      {rows.map((row) => (
        <div
          key={row.commit.hash}
          className={`dshg-row${selected === row.commit.hash ? ' dshg-row-selected' : ''}`}
          style={{ height: rowHeight, paddingLeft: graphWidth + GRAPH_INSET + 6, lineHeight: `${rowHeight}px` }}
          onClick={onSelect ? () => onSelect(row.commit.hash) : undefined}
          onMouseEnter={onHover ? (event) => onHover(row.commit, event) : undefined}
          onMouseLeave={onHover ? () => onHover(null) : undefined}
          role={onSelect ? 'button' : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onKeyDown={onSelect ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(row.commit.hash) } } : undefined}
        >
          <span className="dshg-hash">{row.commit.short}</span>
          <span className="dshg-subject">{row.commit.subject || '(no message)'}</span>
          {timeLabel ? <span className="dshg-time">{timeLabel(row.commit)}</span> : null}
        </div>
      ))}
    </div>
  )
}

function CommitTooltip({ hover, tr }) {
  const commit = hover.commit
  const width = 320
  const left = Math.max(8, hover.x - width - 12)
  const top = Math.min(Math.max(8, hover.y - 6), Math.max(8, window.innerHeight - 320))
  const body = (commit.body || '').trim()
  return (
    <div className="dshg-tooltip" style={{ left, top, width }} role="tooltip">
      <div className="dshg-tooltip-subject">{commit.subject || '(no message)'}</div>
      <div className="dshg-tooltip-meta">
        <code className="dshg-tooltip-hash">{commit.hash.slice(0, 12)}</code>
        <span>{formatDateTime(commit.date)}</span>
        <span>{formatRelative(commit.date, tr)}</span>
      </div>
      {commit.refs.length > 0 ? <div className="dshg-tooltip-refs"><RefChips refs={commit.refs} tr={tr} limit={4} /></div> : null}
      <div className="dshg-tooltip-author">{commit.author}{commit.email ? ` <${commit.email}>` : ''}</div>
      {body !== '' ? <div className="dshg-tooltip-body">{body.length > 420 ? `${body.slice(0, 420)}…` : body}</div> : null}
      {commit.parents.length > 1 ? (
        <div className="dshg-tooltip-merge">
          {tr('detail.merge')} · {commit.parents.length} {tr('detail.parents')}
        </div>
      ) : null}
      <div className="dshg-tooltip-hint">{tr('widget.details')} →</div>
    </div>
  )
}

function WidgetShell({ children, className = '', style, innerRef, label }) {
  return (
    <div
      ref={innerRef}
      style={style}
      className={`dshg-widget ${className}`}
      role="complementary"
      aria-label={label ?? 'Git tree'}
    >
      {children}
    </div>
  )
}

function WidgetBody({ state, snapshot, sessionId, tr, onRetry, children }) {
  if (!sessionId) {
    return (
      <div className="dshg-empty">
        <div className="dshg-empty-title">{tr('widget.noSession')}</div>
        <div className="dshg-empty-hint">{tr('widget.noSessionHint')}</div>
      </div>
    )
  }
  if (state.phase === 'loading' && !snapshot) {
    return <div className="dshg-empty"><div className="dshg-empty-hint">{tr('widget.loading')}</div></div>
  }
  if (state.phase === 'error' && !snapshot) {
    return (
      <div className="dshg-empty">
        <div className="dshg-empty-title">{tr('widget.error')}</div>
        <div className="dshg-empty-hint">{state.error}</div>
        <button type="button" className="dshg-link" onClick={onRetry}>{tr('widget.retry')}</button>
      </div>
    )
  }
  if (snapshot && snapshot.isRepo === false) {
    return (
      <div className="dshg-empty">
        <div className="dshg-empty-title">{tr('widget.notRepo')}</div>
        <div className="dshg-empty-hint">{snapshot.cwd}</div>
      </div>
    )
  }
  return children
}

/**
 * The floating card: fixed in the frame's overlay layer, never inside the
 * conversation scroller.
 */
function GitTreeWidget({ sessionSource, translate, openDetails, getSidebarRight }) {
  const tr = translate
  const binding = useSource(sessionSource)
  const sessionId = binding?.key
  const [collapsed, setCollapsed] = useState(() => {
    try { return window.localStorage.getItem('dsh.gitTree.collapsed') === '1' } catch { return false }
  })
  const [rightbarOpen, setRightbarOpen] = useState(() => {
    try {
      const service = getSidebarRight()
      return Boolean(service && typeof service.isExpanded === 'function' && service.isExpanded())
    } catch {
      return false
    }
  })
  const [fallback, setFallback] = useState(false)
  const [hover, setHover] = useState(null)
  const listRef = useRef(null)
  const [state, reload] = useSnapshot(sessionId, {
    max: WIDGET_MAX_COMMITS,
    intervalMs: 7000,
    enabled: !rightbarOpen && !fallback,
  })
  const snapshot = state.snapshot

  useEffect(() => {
    const read = () => {
      try {
        const service = getSidebarRight()
        setRightbarOpen(Boolean(service && typeof service.isExpanded === 'function' && service.isExpanded()))
      } catch {
        setRightbarOpen(false)
      }
    }
    read()
    const timer = window.setInterval(read, 600)
    return () => window.clearInterval(timer)
  }, [getSidebarRight])

  useEffect(() => {
    try { window.localStorage.setItem('dsh.gitTree.collapsed', collapsed ? '1' : '0') } catch { /* storage is optional */ }
  }, [collapsed])

  const layout = useMemo(() => layoutGraph(snapshot?.commits ?? []), [snapshot])
  const graphWidth = Math.min(layout.laneCount * 12 + 4, 84)
  const branches = useMemo(() => {
    const list = snapshot?.branches ?? []
    return [...list.filter((branch) => !branch.remote), ...list.filter((branch) => branch.remote)]
  }, [snapshot])

  const handleOpen = useCallback((hash) => {
    if (typeof hash === 'string' && hash !== '') {
      detailRequests.request(hash)
    }
    if (openDetails()) {
      // Hide immediately; the expansion poll keeps it hidden while the panel
      // stays open and restores the card once the panel is collapsed.
      setRightbarOpen(true)
      return
    }
    setFallback(true)
  }, [openDetails])

  // ── anchored positioning + drag ───────────────────────────────────────
  // The card is anchored by its distance to the window's right edge and from
  // the top, so resizing the window keeps it hugging the right edge instead
  // of leaving it at a stale absolute x. Dragging only updates this pair.
  const rootRef = useRef(null)
  const dragRef = useRef(null)
  const storedAnchorRef = useRef(undefined)
  const [anchor, setAnchor] = useState(() => {
    const stored = readStoredAnchor()
    storedAnchorRef.current = stored
    return stored && Number.isFinite(stored.right) ? { right: stored.right, top: stored.top } : null
  })
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  useEffect(() => {
    let frame = 0
    const onResize = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setViewport({ w: window.innerWidth, h: window.innerHeight })
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Migrate the pre-anchor build's absolute {x, y} once the card is measurable.
  useEffect(() => {
    const stored = storedAnchorRef.current
    storedAnchorRef.current = undefined
    if (stored && Number.isFinite(stored.legacyX)) {
      const width = rootRef.current?.offsetWidth ?? CARD_WIDTH
      const right = Math.max(8, window.innerWidth - (stored.legacyX + width))
      const top = Math.max(0, Math.min(stored.legacyY, window.innerHeight - 160))
      const next = { right, top }
      setAnchor(next)
      persistAnchor(next)
      try { window.localStorage.removeItem(LEGACY_POSITION_KEY) } catch { /* optional */ }
    }
  }, [])

  useEffect(() => () => { document.body.style.userSelect = '' }, [])

  // Rendering borrows the anchor through the live viewport; the stored pair is
  // never overwritten by a resize, so expanding the window restores the exact
  // right-edge distance the user chose.
  const effectiveRight = anchor === null
    ? null
    : Math.max(0, Math.min(anchor.right, viewport.w - CARD_WIDTH - 8))
  const effectiveTop = anchor === null
    ? null
    : Math.max(0, Math.min(anchor.top, viewport.h - 160))
  const positionStyle = anchor === null
    ? undefined
    : {
      left: 'auto',
      right: effectiveRight,
      top: effectiveTop,
      maxHeight: Math.max(140, Math.min(380, viewport.h - effectiveTop - 24)),
    }
  const pillStyle = anchor === null
    ? undefined
    : { right: effectiveRight, top: effectiveTop }

  const writeDragFrame = useCallback((element, right, top) => {
    const maxRight = Math.max(0, window.innerWidth - CARD_WIDTH - 8)
    const nextRight = Math.max(0, Math.min(Math.round(right), maxRight))
    const nextTop = Math.max(0, Math.min(Math.round(top), Math.max(0, window.innerHeight - 160)))
    element.style.left = 'auto'
    element.style.right = `${nextRight}px`
    element.style.top = `${nextTop}px`
    element.style.maxHeight = `${Math.max(140, Math.min(380, window.innerHeight - nextTop - 24))}px`
    return { right: nextRight, top: nextTop }
  }, [])

  const onDragStart = useCallback((event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const element = rootRef.current
    if (element === null) return
    const rect = element.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      last: writeDragFrame(element, window.innerWidth - (rect.left + rect.width), rect.top),
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture is best-effort.
    }
    document.body.style.userSelect = 'none'
    event.preventDefault()
  }, [writeDragFrame])

  const onDragMove = useCallback((event) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    const element = rootRef.current
    if (element === null) return
    // Move via (right, top), so even a resize mid-drag keeps the anchor model.
    const left = event.clientX - drag.offsetX
    drag.last = writeDragFrame(element, window.innerWidth - (left + CARD_WIDTH), event.clientY - drag.offsetY)
  }, [writeDragFrame])

  const onDragEnd = useCallback((event) => {
    const drag = dragRef.current
    if (drag === null) return
    dragRef.current = null
    document.body.style.userSelect = ''
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Already released.
    }
    if (drag.last) {
      setAnchor(drag.last)
      persistAnchor(drag.last)
    }
  }, [])

  const onDragKeyDown = useCallback((event) => {
    const step = event.shiftKey ? 48 : 16
    const dx = event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0
    const dy = event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0
    if (dx === 0 && dy === 0) return
    event.preventDefault()
    const element = rootRef.current
    const rect = element?.getBoundingClientRect()
    const base = anchor ?? {
      right: Math.max(0, window.innerWidth - ((rect?.left ?? 0) + (rect?.width ?? CARD_WIDTH))),
      top: Math.max(0, rect?.top ?? 0),
    }
    const next = {
      right: Math.max(0, Math.min(base.right - dx, Math.max(0, window.innerWidth - CARD_WIDTH - 8))),
      top: Math.max(0, Math.min(base.top + dy, Math.max(0, window.innerHeight - 160))),
    }
    setAnchor(next)
    persistAnchor(next)
  }, [anchor])

  if (fallback) {
    return <FallbackDrawer sessionId={sessionId} translate={tr} onClose={() => setFallback(false)} />
  }
  // The built-in right Sidebar owns that edge while it is open; two surfaces
  // showing the same graph would overlap and fight for the same corner.
  if (rightbarOpen) return null

  if (collapsed) {
    return (
      <div className="dshg-pill" style={pillStyle} role="complementary" aria-label={tr('widget.title')}>
        <button type="button" className="dshg-pill-main" onClick={() => setCollapsed(false)} title={tr('widget.expand')}>
          <BranchGlyph />
          <span className="dshg-pill-branch">{snapshot?.branch && !snapshot.detached ? snapshot.branch : (snapshot ? tr('widget.detached') : '…')}</span>
          <DirtyDot working={snapshot?.working} tr={tr} />
        </button>
        <button type="button" className="dshg-iconbtn" onClick={() => handleOpen()} title={tr('widget.details')} aria-label={tr('widget.details')}>
          <ExpandGlyph />
        </button>
      </div>
    )
  }

  return (
    <WidgetShell innerRef={rootRef} style={positionStyle} label={tr('widget.title')}>
      <div className="dshg-head">
        <span className="dshg-head-glyph"><BranchGlyph /></span>
        <button
          type="button"
          className="dshg-branch"
          onClick={() => handleOpen()}
          title={`${snapshot?.root ?? ''}${snapshot?.ahead ? ` · ${tr('widget.ahead', { count: snapshot.ahead })}` : ''}${snapshot?.behind ? ` · ${tr('widget.behind', { count: snapshot.behind })}` : ''}`}
        >
          {snapshot ? (snapshot.isRepo ? (snapshot.detached ? tr('widget.detached') : snapshot.branch) : tr('widget.title')) : tr('widget.title')}
        </button>
        <DirtyDot working={snapshot?.working} tr={tr} />
        <span
          className="dshg-drag"
          role="button"
          tabIndex={0}
          aria-label={tr('widget.drag')}
          title={tr('widget.drag')}
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          onKeyDown={onDragKeyDown}
        >
          <span className="dshg-drag-bar" aria-hidden="true" />
        </span>
        <button type="button" className="dshg-iconbtn" onClick={() => handleOpen()} title={tr('widget.details')} aria-label={tr('widget.details')}>
          <ExpandGlyph />
        </button>
        <button type="button" className="dshg-iconbtn" onClick={() => setCollapsed(true)} title={tr('widget.collapse')} aria-label={tr('widget.collapse')}>
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      <WidgetBody state={state} snapshot={snapshot} sessionId={sessionId} tr={tr} onRetry={reload}>
        {branches.length > 0 ? (
          <div className="dshg-strip" role="list" aria-label={tr('detail.branches')}>
            {branches.slice(0, 12).map((branch) => (
              <span key={branch.ref} className={branchChipClass(branch)} role="listitem" title={`${branch.name}${branch.ahead ? ` ↑${branch.ahead}` : ''}${branch.behind ? ` ↓${branch.behind}` : ''}`}>
                {branch.name}
                {branch.ahead ? <em className="dshg-chip-track">↑{branch.ahead}</em> : null}
                {branch.behind ? <em className="dshg-chip-track">↓{branch.behind}</em> : null}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="dshg-list"
          ref={listRef}
          onScroll={() => setHover(null)}
        >
          {layout.rows.length === 0 ? (
            <div className="dshg-empty"><div className="dshg-empty-hint">{tr('detail.empty')}</div></div>
          ) : (
            <GraphCanvas
              layout={layout}
              graphWidth={graphWidth}
              headShort={snapshot?.head ?? ''}
              onSelect={handleOpen}
              onHover={(commit, event) => {
                if (!commit) {
                  setHover(null)
                  return
                }
                const rect = event.currentTarget.getBoundingClientRect()
                setHover({ commit, x: rect.left, y: rect.top })
              }}
            />
          )}
        </div>

        <div className="dshg-foot">
          <span className="dshg-foot-text">
            {snapshot ? `${tr('widget.branches', { count: snapshot.branches.length })} · ${tr('widget.commits', { count: snapshot.commits.length })}` : ''}
            {snapshot?.working && !snapshot.working.clean ? ` · ${tr('widget.changed', { count: snapshot.working.changed })}` : ''}
            {snapshot?.stash ? ` · ${tr('widget.stash', { count: snapshot.stash })}` : ''}
          </span>
          <button type="button" className="dshg-iconbtn" onClick={reload} title={tr('widget.refresh')} aria-label={tr('widget.refresh')}>
            <RefreshGlyph />
          </button>
        </div>
      </WidgetBody>

      {hover ? <CommitTooltip hover={hover} tr={tr} /> : null}
    </WidgetShell>
  )
}

/**
 * The full detail pane. Rendered both as a right-Sidebar tab body and inside
 * the fallback drawer.
 */
function DiffTokens({ tokens }) {
  if (!tokens || tokens.length === 0) return null
  return tokens.map((token, index) => (
    token.kind === 'plain'
      ? <React.Fragment key={index}>{token.text}</React.Fragment>
      : <span key={index} className={`dshg-tok-${token.kind}`}>{token.text}</span>
  ))
}

function DiffLine({ line }) {
  if (line.type === 'hunk') {
    return (
      <div className="dshg-diff-line dshg-diff-hunk">
        <span className="dshg-diff-text">{line.text}</span>
      </div>
    )
  }
  if (line.type === 'meta') {
    return (
      <div className="dshg-diff-line dshg-diff-meta">
        <span className="dshg-diff-text">{line.text}</span>
      </div>
    )
  }
  const mark = line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '
  return (
    <div className={`dshg-diff-line dshg-diff-${line.type}`}>
      <span className="dshg-diff-gutter">{line.oldNo ?? ''}</span>
      <span className="dshg-diff-gutter">{line.newNo ?? ''}</span>
      <span className={`dshg-diff-mark dshg-diff-mark-${line.type}`}>{mark}</span>
      <span className="dshg-diff-text"><DiffTokens tokens={line.tokens} /></span>
    </div>
  )
}

/**
 * Render parsed file groups as a line-numbered, highlighted diff.
 * @param {{files: object[], emptyLabel: string, limitLabel: string, showFileHeader?: boolean}} props - parsed patch and copy.
 * @returns {JSX.Element} diff view.
 */
function DiffView({ files, emptyLabel, limitLabel, showFileHeader = true }) {
  const rows = useMemo(() => {
    const flat = []
    files.forEach((file, fileIndex) => {
      if (showFileHeader) flat.push({ kind: 'file', file, fileIndex })
      file.lines.forEach((line, lineIndex) => {
        flat.push({ kind: 'line', line, key: `${fileIndex}:${lineIndex}` })
      })
    })
    return flat
  }, [files, showFileHeader])
  if (files.length === 0) return <div className="dshg-empty-hint">{emptyLabel}</div>
  const visible = rows.length > MAX_DIFF_ROWS ? rows.slice(0, MAX_DIFF_ROWS) : rows
  return (
    <div className="dshg-diff">
      {visible.map((row) => (
        row.kind === 'file' ? (
          <div key={`file-${row.fileIndex}`} className="dshg-diff-file" data-diff-path={row.file.path}>
            <span className="dshg-diff-file-path" title={row.file.path}>{row.file.path || '—'}</span>
            <span className="dshg-diff-file-stat">
              <em className="dshg-add">+{row.file.additions}</em>
              <em className="dshg-del">−{row.file.deletions}</em>
            </span>
          </div>
        ) : <DiffLine key={row.key} line={row.line} />
      ))}
      {rows.length > MAX_DIFF_ROWS ? <div className="dshg-diff-note">{limitLabel}</div> : null}
    </div>
  )
}

function GitDetails({ sessionId, translate }) {
  const tr = translate
  const [state, reload] = useSnapshot(sessionId, { max: DETAIL_MAX_COMMITS, intervalMs: 10_000 })
  const snapshot = state.snapshot
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState({ phase: 'idle', value: null, error: null })
  const [diff, setDiff] = useState({ phase: 'idle', value: null, error: null })
  const [copied, setCopied] = useState(false)
  const [wrap, setWrap] = useState(false)
  const [expandedFiles, setExpandedFiles] = useState(() => new Set())
  const layout = useMemo(() => layoutGraph(snapshot?.commits ?? []), [snapshot])
  const graphWidth = Math.min(layout.laneCount * 12 + 4, 150)
  const selectedCommit = useMemo(
    () => (snapshot?.commits ?? []).find((commit) => commit.hash === selected) ?? null,
    [snapshot, selected],
  )
  const patchText = diff.phase === 'ready' && diff.value ? diff.value.patch : ''
  const diffFiles = useMemo(() => parseDiff(patchText), [patchText])
  const fileEntries = useMemo(
    () => mergeFileEntries(diffFiles, detail.value?.files),
    [diffFiles, detail.value],
  )
  const diffAdditions = useMemo(
    () => diffFiles.reduce((total, file) => total + file.additions, 0),
    [diffFiles],
  )
  const diffDeletions = useMemo(
    () => diffFiles.reduce((total, file) => total + file.deletions, 0),
    [diffFiles],
  )

  // A click on the floating graph asks for one commit; this pane may mount
  // after that click (lazy consume) or already be open (live listener).
  useEffect(() => {
    const pending = detailRequests.consume()
    if (pending) setSelected(pending)
    const listener = (hash) => setSelected(hash)
    detailRequests.listeners.add(listener)
    return () => {
      detailRequests.listeners.delete(listener)
    }
  }, [])

  useEffect(() => {
    if (!sessionId || !selected) {
      setDetail({ phase: 'idle', value: null, error: null })
      setDiff({ phase: 'idle', value: null, error: null })
      return undefined
    }
    let active = true
    setDetail({ phase: 'loading', value: null, error: null })
    setDiff({ phase: 'loading', value: null, error: null })
    setExpandedFiles(new Set())
    callApi('commit', { sessionId, hash: selected })
      .then((value) => { if (active) setDetail({ phase: 'ready', value, error: null }) })
      .catch((error) => { if (active) setDetail({ phase: 'error', value: null, error: error.message }) })
    callApi('diff', { sessionId, hash: selected })
      .then((value) => { if (active) setDiff({ phase: 'ready', value, error: null }) })
      .catch((error) => { if (active) setDiff({ phase: 'error', value: null, error: error.message }) })
    return () => { active = false }
  }, [sessionId, selected])

  const toggleFile = useCallback((path) => {
    if (!path) return
    setExpandedFiles((current) => {
      const next = new Set(current)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const collapseAll = useCallback(() => setExpandedFiles(new Set()), [])

  const copyHash = useCallback(() => {
    if (!selected) return
    try {
      void navigator.clipboard?.writeText(selected)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard is optional */ }
  }, [selected])

  if (!sessionId) {
    return <div className="dshg-detail dshg-empty"><div className="dshg-empty-hint">{tr('widget.noSession')}</div></div>
  }

  if (selected) {
    const value = detail.value
    const commit = selectedCommit
    const subject = value?.subject ?? commit?.subject ?? ''
    const fullHash = value?.hash ?? selected
    const shortHash = value?.short ?? commit?.short ?? selected.slice(0, 7)
    const body = value?.body ?? commit?.body ?? ''
    const files = value?.files ?? []
    const isMerge = (value?.parents?.length ?? commit?.parents?.length ?? 0) > 1
    return (
      <div className="dshg-detail">
        <div className="dshg-detail-head dshg-detail-head-commit">
          <button type="button" className="dshg-back" onClick={() => setSelected(null)}>
            <ChevronGlyph /> {tr('detail.back')}
          </button>
          <span className="dshg-commit-short">{shortHash}</span>
          <span className="dshg-head-spacer" />
          <button type="button" className="dshg-iconbtn" onClick={reload} title={tr('widget.refresh')} aria-label={tr('widget.refresh')}>
            <RefreshGlyph />
          </button>
        </div>

        <div className="dshg-detail-body">
          <div className="dshg-detail-info">
            <h2 className="dshg-commit-title">{subject}</h2>
            <div className="dshg-commit-tags">
              {isMerge ? <span className="dshg-tag dshg-tag-merge">{tr('detail.merge')}</span> : null}
              {value ? (
                <span className="dshg-tag">
                  {tr('detail.stat', { files: files.length, insertions: value.insertions, deletions: value.deletions })}
                </span>
              ) : null}
            </div>

            <div className="dshg-commit-meta">
              <div className="dshg-kv"><span>{tr('detail.hash')}</span><button type="button" className="dshg-hashbtn" onClick={copyHash} title={tr('detail.copyHash')}>{copied ? tr('detail.copied') : fullHash}</button></div>
              <div className="dshg-kv"><span>{tr('detail.author')}</span><b>{value?.author ?? commit?.author ?? ''}</b></div>
              <div className="dshg-kv"><span>{tr('detail.date')}</span><b>{formatDateTime(value?.date ?? commit?.date ?? '')}</b></div>
              {value?.committer && value.committer !== value.author ? (
                <div className="dshg-kv"><span>{tr('detail.committer')}</span><b>{value.committer}</b></div>
              ) : null}
              {commit?.refs?.length > 0 ? (
                <div className="dshg-kv"><span>{tr('detail.refs')}</span><RefChips refs={commit.refs} tr={tr} limit={6} /></div>
              ) : null}
              {value?.parents?.length > 0 ? (
                <div className="dshg-kv"><span>{tr('detail.parents')}</span><span className="dshg-parents">{value.parents.map((hash) => <code key={hash}>{hash.slice(0, 7)}</code>)}</span></div>
              ) : null}
            </div>

            {detail.phase === 'loading' ? <div className="dshg-empty-hint">{tr('detail.loading')}</div> : null}
            {detail.phase === 'error' ? <div className="dshg-error">{detail.error}</div> : null}
            {body ? <pre className="dshg-commit-body">{body}</pre> : null}
          </div>

          <section className="dshg-detail-diff" aria-label={tr('detail.patch')}>
            <div className="dshg-code-toolbar">
              <span className="dshg-code-title">{tr('detail.patch')}</span>
              {diff.phase === 'ready' ? (
                <span className="dshg-code-stat">
                  <em className="dshg-add">+{value?.insertions ?? diffAdditions}</em>
                  <em className="dshg-del">−{value?.deletions ?? diffDeletions}</em>
                </span>
              ) : null}
              {fileEntries.length > 0 ? (
                <span className="dshg-code-count">{tr('detail.fileCount', { count: fileEntries.length })}</span>
              ) : null}
              <span className="dshg-head-spacer" />
              {expandedFiles.size > 0 ? (
                <button type="button" className="dshg-textbtn" onClick={collapseAll}>
                  {tr('detail.collapseAll')}
                </button>
              ) : null}
              <button
                type="button"
                className={`dshg-wrapbtn${wrap ? ' dshg-wrapbtn-on' : ''}`}
                aria-pressed={wrap}
                onClick={() => setWrap((current) => !current)}
              >
                {tr('detail.wrap')}
              </button>
            </div>

            {diff.phase === 'loading' ? <div className="dshg-empty-hint">{tr('detail.loading')}</div> : null}
            {diff.phase === 'error' ? <div className="dshg-error">{tr('detail.diffError')}: {diff.error}</div> : null}

            {fileEntries.length === 0 && diff.phase === 'ready' ? (
              <div className="dshg-empty-hint">{tr('detail.noDiff')}</div>
            ) : (
              <div className="dshg-file-list">
                {fileEntries.map((entry) => {
                  const entryKey = entry.path || '__unnamed__'
                  const open = expandedFiles.has(entryKey)
                  return (
                    <section key={entryKey} className="dshg-file-entry">
                      <button
                        type="button"
                        className="dshg-file-row"
                        aria-expanded={open}
                        onClick={() => toggleFile(entryKey)}
                        title={open ? tr('detail.collapseFile') : tr('detail.expandFile')}
                      >
                        <span className="dshg-file-caret" aria-hidden="true"><CaretGlyph /></span>
                        <span className="dshg-file-path">{entry.path || '—'}</span>
                        <span className="dshg-file-stat">
                          {entry.binary
                            ? 'bin'
                            : <><em className="dshg-add">+{entry.additions}</em><em className="dshg-del">−{entry.deletions}</em></>}
                        </span>
                      </button>
                      {open ? (
                        <div className={`dshg-file-diff${wrap ? ' dshg-diff-wrap' : ''}`}>
                          {entry.diff ? (
                            <DiffView
                              files={[entry.diff]}
                              showFileHeader={false}
                              emptyLabel={tr('detail.noDiff')}
                              limitLabel={tr('detail.linesTruncated', { count: MAX_DIFF_ROWS })}
                            />
                          ) : (
                            <div className="dshg-empty-hint">
                              {entry.binary ? tr('detail.binaryFile') : tr('detail.noFileDiff')}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </section>
                  )
                })}
              </div>
            )}

            {value?.filesTruncated ? <div className="dshg-diff-note">{tr('detail.filesTruncated', { count: files.length })}</div> : null}
            {diff.phase === 'ready' && diff.value?.truncated ? <div className="dshg-diff-note">{tr('detail.diffTruncated')}</div> : null}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="dshg-detail">
      <div className="dshg-detail-head">
        <span className="dshg-head-glyph"><BranchGlyph /></span>
        <div className="dshg-detail-repo">
          <div className="dshg-detail-name">{snapshot?.name ?? tr('detail.title')}</div>
          <div className="dshg-detail-path" title={snapshot?.root ?? ''}>{snapshot?.root ?? ''}</div>
        </div>
        <DirtyDot working={snapshot?.working} tr={tr} />
        <button type="button" className="dshg-iconbtn" onClick={reload} title={tr('widget.refresh')} aria-label={tr('widget.refresh')}>
          <RefreshGlyph />
        </button>
      </div>

      {state.phase === 'error' && !snapshot ? (
        <div className="dshg-empty"><div className="dshg-empty-title">{tr('widget.error')}</div><div className="dshg-empty-hint">{state.error}</div><button type="button" className="dshg-link" onClick={reload}>{tr('widget.retry')}</button></div>
      ) : null}
      {state.phase !== 'error' && !snapshot && state.phase !== 'idle' ? (
        <div className="dshg-empty"><div className="dshg-empty-hint">{tr('widget.loading')}</div></div>
      ) : null}
      {snapshot && snapshot.isRepo === false ? (
        <div className="dshg-empty"><div className="dshg-empty-title">{tr('widget.notRepo')}</div><div className="dshg-empty-hint">{snapshot.cwd}</div></div>
      ) : null}

      {snapshot && snapshot.isRepo ? (
        <>
          <div className="dshg-summary">
            <span className={snapshot.detached ? 'dshg-summary-detached' : ''}>{snapshot.detached ? tr('widget.detached') : snapshot.branch}</span>
            {snapshot.ahead ? <em className="dshg-chip-track">{tr('widget.ahead', { count: snapshot.ahead })}</em> : null}
            {snapshot.behind ? <em className="dshg-chip-track">{tr('widget.behind', { count: snapshot.behind })}</em> : null}
            <span className="dshg-head-spacer" />
            <span className="dshg-summary-work">{snapshot.working.clean ? tr('widget.clean') : tr('widget.changed', { count: snapshot.working.changed })}</span>
          </div>

          {snapshot.branches.length > 0 ? (
            <div className="dshg-strip dshg-strip-wide" role="list" aria-label={tr('detail.branches')}>
              {snapshot.branches.map((branch) => (
                <span key={branch.ref} className={branchChipClass(branch)} role="listitem" title={`${branch.name}${branch.upstream ? ` → ${branch.upstream}` : ''}`}>
                  {branch.name}
                  {branch.gone ? <em className="dshg-chip-track">gone</em> : null}
                  {branch.ahead ? <em className="dshg-chip-track">↑{branch.ahead}</em> : null}
                  {branch.behind ? <em className="dshg-chip-track">↓{branch.behind}</em> : null}
                </span>
              ))}
            </div>
          ) : null}

          <div className="dshg-detail-list">
            {layout.rows.length === 0 ? (
              <div className="dshg-empty"><div className="dshg-empty-hint">{tr('detail.empty')}</div></div>
            ) : (
              <GraphCanvas
                layout={layout}
                graphWidth={graphWidth}
                headShort={snapshot.head}
                selected={selected}
                onSelect={setSelected}
                timeLabel={(commit) => formatRelative(commit.date, tr)}
              />
            )}
          </div>
          <div className="dshg-detail-foot">
            {snapshot.truncated ? tr('detail.truncated', { count: snapshot.commits.length }) : ''}
          </div>
        </>
      ) : null}
    </div>
  )
}

function FallbackDrawer({ sessionId, translate, onClose }) {
  return (
    <div className="dshg-drawer" role="dialog" aria-label={translate('detail.title')}>
      <div className="dshg-drawer-head">
        <span>{translate('detail.title')}</span>
        <button type="button" className="dshg-iconbtn" onClick={onClose} aria-label={translate('detail.close')}>✕</button>
      </div>
      <div className="dshg-drawer-body">
        <GitDetails sessionId={sessionId} translate={translate} />
      </div>
    </div>
  )
}

/**
 * Install the Client half.
 * @param {import('@deepseek-ai/cordis').Context} ctx - Client context.
 */
export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, MESSAGES), 'dsh-git-tree: locale dictionaries')
  const translate = ctx.locale.bind(NS)
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.dshGitTree = 'true'
    style.textContent = styles
    document.head.append(style)
    return () => style.remove()
  }, 'dsh-git-tree: styles')

  const fallbackSessionSource = {
    subscribe: () => () => {},
    getSnapshot: () => ({ key: undefined }),
  }
  const sessionSource = ctx.uiSession?.adapter?.current ?? fallbackSessionSource
  const getSidebarRight = () => {
    try {
      return ctx.get('sidebarRight')
    } catch {
      return undefined
    }
  }
  const openDetails = () => {
    const service = getSidebarRight()
    if (!service || typeof service.openTab !== 'function') return false
    try {
      service.openTab(KIND)
      return true
    } catch (error) {
      console.warn('[dsh-git-tree] could not open the right Sidebar tab', error)
      return false
    }
  }

  // A tab type is a static declaration plus a body; both are owned by this
  // plugin's effect so unloading removes them together.
  ctx.inject(['sidebarRightTabs'], (scoped) => {
    scoped.effect(() => {
      try {
        return scoped.sidebarRightTabs.register({
          id: TAB_ID,
          kind: KIND,
          title: () => translate('tab.title'),
          keepMounted: true,
        })
      } catch (error) {
        console.warn('[dsh-git-tree] tab type registration failed', error)
        return undefined
      }
    }, 'dsh-git-tree: right Sidebar tab type')
  })

  ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab',
    key: TAB_ID,
    inject: () => ({ translate }),
  }, GitDetails))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'git-tree-widget',
    order: 20,
    inject: () => ({ translate, sessionSource, openDetails, getSidebarRight }),
  }, GitTreeWidget))
}
