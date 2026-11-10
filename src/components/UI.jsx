import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, Sun, Moon, X, Nfc } from 'lucide-react'
import { useApp } from '../state/AppState'

/* ---------------- Modal ---------------- */
const modalStack = []
let modalSeq = 0

export function Modal({ open, onClose, children, className = '', width, labelledBy, dismissable = true }) {
  const closeRef = useRef(onClose)
  const dismissRef = useRef(dismissable)
  useEffect(() => {
    closeRef.current = onClose
    dismissRef.current = dismissable
  })
  useEffect(() => {
    if (!open) return
    const id = ++modalSeq
    modalStack.push(id)
    const onKey = (e) => {
      // only the top-most modal reacts to Escape
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === id && dismissRef.current) closeRef.current?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      const i = modalStack.indexOf(id)
      if (i > -1) modalStack.splice(i, 1)
      document.removeEventListener('keydown', onKey)
      if (!modalStack.length) document.body.style.overflow = ''
    }
  }, [open])
  if (!open) return null
  // Dashboard dialogs become native-style bottom sheets on phones; Rodiall + success modals stay centered cards.
  const sheet = !/rd-modal|success-modal/.test(className)
  // Portal to <body> so modals never get trapped under the sticky app bar / bottom nav
  return createPortal(
    <div
      className={`modal-overlay ${sheet ? 'is-sheet' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissable) onClose?.()
      }}
    >
      <div className={`modal ${sheet ? 'sheet' : ''} ${className}`} style={width ? { maxWidth: width } : undefined} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {sheet && <span className="sheet-grabber" aria-hidden="true" />}
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function ModalHeader({ title, onClose, id }) {
  return (
    <div className="modal-head">
      <h3 className="modal-title" id={id}>{title}</h3>
      {onClose && (
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

/* ---------------- Anchored menu / popover (portal, fixed) ---------------- */
export function Popover({ anchorRef, open, onClose, children, align = 'right', className = '', offset = 6 }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  const place = useCallback(() => {
    const a = anchorRef.current
    const m = ref.current
    if (!a || !m) return
    const r = a.getBoundingClientRect()
    const mw = m.offsetWidth
    const mh = m.offsetHeight
    let left = align === 'right' ? r.right - mw : r.left
    left = Math.max(8, Math.min(left, window.innerWidth - mw - 8))
    let top = r.bottom + offset
    if (top + mh > window.innerHeight - 8 && r.top - mh - offset > 8) top = r.top - mh - offset
    setPos({ top, left })
  }, [anchorRef, align, offset])

  useLayoutEffect(() => {
    if (open) place()
    else setPos(null)
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return
      onClose()
    }
    const onKey = (e) => e.key === 'Escape' && onClose()
    const onScroll = (e) => {
      if (ref.current?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onClose)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onClose)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null
  return createPortal(
    <div ref={ref} className={`menu ${className}`} style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }} role="menu">
      {children}
    </div>,
    document.body,
  )
}

export function useToggle(initial = false) {
  const [open, setOpen] = useState(initial)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((o) => !o), [])
  return [open, toggle, close, setOpen]
}

/** Kebab / dropdown menu with items [{label, icon, onClick, danger}] */
export function ActionMenu({ items, trigger, align = 'right', label = 'Open actions' }) {
  const anchor = useRef(null)
  const [open, toggle, close] = useToggle()
  return (
    <>
      <button ref={anchor} className="kebab" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={label}>
        {trigger}
      </button>
      <Popover anchorRef={anchor} open={open} onClose={close} align={align}>
        {items.map((it, i) =>
          it === 'sep' ? (
            <div key={i} className="menu-sep" />
          ) : (
            <button
              key={it.label}
              role="menuitem"
              className={`menu-item ${it.danger ? 'danger' : ''}`}
              onClick={() => {
                close()
                it.onClick?.()
              }}
            >
              {it.icon}
              {it.label}
            </button>
          ),
        )}
      </Popover>
    </>
  )
}

/* ---------------- Status ---------------- */
export function StatusBadge({ status }) {
  const s = String(status).toLowerCase()
  const cls = s.startsWith('success') ? 'success' : s === 'failed' ? 'failed' : 'pending'
  return <span className={`status ${cls}`}>{status}</span>
}

/* ---------------- Success badge ---------------- */
export function SuccessBadge({ size = 96, confetti = false }) {
  // Static accent dots only where the Rodiall brand designs call for them; no looping effects.
  const dots = confetti
    ? [
        { l: '8%', t: '22%', s: 4, c: '#7b9bff' },
        { l: '86%', t: '14%', s: 5, c: '#f59e57' },
        { l: '94%', t: '52%', s: 7, c: '#5cc488' },
        { l: '74%', t: '90%', s: 5, c: '#f59e57' },
        { l: '48%', t: '-2%', s: 3, c: '#7b9bff' },
      ]
    : []
  return (
    <div className="success-badge" style={{ width: size, height: size }}>
      <span className="ring" />
      <span className="core" style={{ width: size / 2, height: size / 2 }}>
        <svg width={size / 4} height={size / 4} viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#1d1d1f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {dots.map((p, i) => (
        <span key={i} className="dot-accent" style={{ left: p.l, top: p.t, width: p.s, height: p.s, background: p.c, animationDelay: `${0.25 + i * 0.05}s` }} />
      ))}
    </div>
  )
}

/* ---------------- Payment card visual ---------------- */
export function PaymentCardVisual({ card }) {
  return (
    <div className="pcard" aria-label={`${card.brand} ending ${card.last4}`}>
      <div className="pcard-top">
        <span className="pcard-chip">
          <svg width="60%" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="1" y="1" width="18" height="10" rx="2" />
            <path d="M7 1v10M13 1v10M1 6h6M13 6h6" />
          </svg>
        </span>
        <Nfc size={14} style={{ opacity: 0.6 }} />
      </div>
      <div>
        <div className="pcard-number">
          <span>{card.first4}</span>
          <span>****</span>
          <span>****</span>
          <span>{card.last4}</span>
        </div>
        <div className="pcard-name">{card.name}</div>
      </div>
      <div className="pcard-bottom">
        <div className="pcard-meta">
          Expiry Date
          <b>**/****</b>
        </div>
        <div className="pcard-meta">
          CVV
          <b>****</b>
        </div>
        <div className="pcard-brand">
          <span className="mc">
            <span />
            <span />
          </span>
          Mastercard
        </div>
      </div>
    </div>
  )
}

/* ---------------- Donut ---------------- */
export function Donut({ value, size = 168, stroke = 22, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const used = Math.max(0, Math.min(100, value))
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--chart-dark)" strokeWidth={stroke} />
        <circle
          className="donut-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeDasharray={`${(used / 100) * c} ${c}`}
          style={{ '--c': c }}
        />
      </svg>
      <div className="donut-center">{children}</div>
    </div>
  )
}

/* ---------------- Scroll rail (custom horizontal scrollbar) ---------------- */
export function ScrollRail({ targetRef }) {
  const [thumb, setThumb] = useState({ w: 100, l: 0 })
  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    const update = () => {
      const ratio = el.clientWidth / el.scrollWidth
      const w = Math.min(100, ratio * 100)
      const max = el.scrollWidth - el.clientWidth
      const l = max > 0 ? (el.scrollLeft / max) * (100 - w) : 0
      setThumb({ w, l })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [targetRef])

  const onRail = (e) => {
    const el = targetRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    el.scrollTo({ left: pct * (el.scrollWidth - el.clientWidth), behavior: 'smooth' })
  }
  const onDrag = (e) => {
    const el = targetRef.current
    const rail = e.currentTarget.parentElement
    if (!el || !rail) return
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startScroll = el.scrollLeft
    const scale = (el.scrollWidth - el.clientWidth) / (rail.offsetWidth * (1 - thumb.w / 100) || 1)
    const move = (ev) => {
      el.scrollLeft = startScroll + (ev.clientX - startX) * scale
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  return (
    <div className="rail" onClick={onRail} aria-hidden="true">
      <div className="rail-thumb" style={{ width: `${thumb.w}%`, left: `${thumb.l}%` }} onPointerDown={onDrag} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}

/* ---------------- Data table ---------------- */
/**
 * columns: [{ key, label, sortable=true, render(row), sortValue(row), className }]
 */
export function DataTable({ columns, rows, pageSize, emptyText = 'No records found', minWidth, onRowClick }) {
  const scrollRef = useRef(null)
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sort.key) return rows
    const col = columns.find((c) => c.key === sort.key)
    const get = col?.sortValue || ((r) => r[sort.key])
    return [...rows].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort, columns])

  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  useEffect(() => setPage(1), [rows, pageSize])
  const current = Math.min(page, pages)
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted

  const onSort = (c) => {
    if (c.sortable === false) return
    setSort((s) => (s.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' }))
  }

  // 5-page sliding window
  const windowStart = Math.max(1, Math.min(current - 2, pages - 4))
  const pageNums = Array.from({ length: Math.min(5, pages) }, (_, i) => windowStart + i)

  // Mobile card layout: primary column as title, status + action top-right, the rest as a label/value grid
  const cell = (c, r) => (c.render ? c.render(r) : r[c.key])
  const primary = columns.find((c) => c.primary) || columns.find((c) => c.key !== 'sn')
  const statusCol = columns.find((c) => c.key === 'status')
  const actionCol = columns.find((c) => c.key === 'action')
  const rest = columns.filter((c) => ![primary, statusCol, actionCol].includes(c) && c.key !== 'sn')

  return (
    <div>
      <div className="mcards">
        {visible.length === 0 ? (
          <div className="mcard-empty">{emptyText}</div>
        ) : (
          visible.map((r) => (
            <div
              className={`mcard ${onRowClick ? 'clickable' : ''}`}
              key={r.id}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(r) : undefined}
            >
              <div className="mcard-head">
                <div style={{ minWidth: 0 }}>
                  <div className="mcard-title">{cell(primary, r)}</div>
                  {r.sn && <div className="mcard-sub">#{r.sn}</div>}
                </div>
                <div className="mcard-right">
                  {statusCol && cell(statusCol, r)}
                  {actionCol && cell(actionCol, r)}
                  {onRowClick && !actionCol && <ChevronRight size={16} className="mcard-chev" aria-hidden="true" />}
                </div>
              </div>
              <div className="mcard-grid">
                {rest.map((c) => (
                  <div key={c.key}>
                    <span>{c.label}</span>
                    <b>{cell(c, r)}</b>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="table-shell">
        <div className="table-scroll" ref={scrollRef}>
          <table className="dtable" style={minWidth ? { minWidth } : undefined}>
            <thead>
              <tr>
                {columns.map((c) => {
                  const sortable = c.sortable !== false
                  const active = sort.key === c.key
                  return (
                    <th
                      key={c.key}
                      className={`${sortable ? 'sortable' : ''} ${active ? 'sorted' : ''} ${c.className || ''}`}
                      onClick={() => onSort(c)}
                      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    >
                      <span className="th-inner">
                        {c.label}
                        {sortable &&
                          (active ? (
                            sort.dir === 'asc' ? <ChevronUp size={11} className="sort-ic" /> : <ChevronDown size={11} className="sort-ic" />
                          ) : (
                            <ChevronsUpDown size={11} className="sort-ic" />
                          ))}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={columns.length}>{emptyText}</td>
                </tr>
              ) : (
                visible.map((r) => (
                  <tr
                    key={r.id}
                    className={onRowClick ? 'clickable' : undefined}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(r) : undefined}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={c.className}>
                        {c.render ? c.render(r) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!pageSize && (
          <div className="table-footer no-pager" style={{ padding: '4px 0 14px' }}>
            <ScrollRail targetRef={scrollRef} />
          </div>
        )}
      </div>
      {pageSize && (
        <div className="table-footer">
          <span className="showing">
            Showing {current} of {pages}
          </span>
          <ScrollRail targetRef={scrollRef} />
          <div className="pager">
            <button className="nav" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
              <ChevronLeft size={13} />
            </button>
            {pageNums.map((n) => (
              <button key={n} className={n === current ? 'active' : ''} onClick={() => setPage(n)} aria-current={n === current ? 'page' : undefined}>
                {n}
              </button>
            ))}
            <button className="nav" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Search ---------------- */
export function SearchInput({ value, onChange, placeholder = 'Search', width }) {
  return (
    <label className="search" style={width ? { width } : undefined}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" style={{ display: 'grid', color: 'var(--text-4)' }}>
          <X size={12} />
        </button>
      )}
    </label>
  )
}

/* ---------------- Theme switch ---------------- */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useApp()
  const on = theme === 'dark'
  return (
    <button className={`theme-switch ${on ? 'on' : ''}`} onClick={toggleTheme} role="switch" aria-checked={on} aria-label="Toggle dark mode" title={on ? 'Switch to light mode' : 'Switch to dark mode'}>
      <span className="knob">{on ? <Moon size={9} /> : <Sun size={10} />}</span>
    </button>
  )
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ icon, mini, title, text, action, children, compact }) {
  return (
    <div className="empty-card fade-in" style={compact ? { padding: '48px 24px', border: 0 } : undefined}>
      <div className="empty-art">
        <span className="tile">{icon}</span>
        {mini && <span className="mini">{mini}</span>}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-text">{text}</p>
      {action}
      {children}
    </div>
  )
}

export function Steps({ steps, current }) {
  return (
    <div className="steps-row">
      {steps.map((s, i) => (
        <div key={s} className={`step-item ${i < current ? 'done' : i === current ? 'current' : ''}`}>
          <span className="num">{i < current ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
          {s}
        </div>
      ))}
    </div>
  )
}

/* ---------------- Count-up figure (plays once, honours reduced motion) ---------------- */
export function CountUp({ value, duration = 700 }) {
  // Accepts formatted strings like "UGX 51,000" and animates only the numeric part.
  const match = String(value).match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(() => (match && !reduced ? 0 : target))
  useEffect(() => {
    if (!match || reduced) return
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setN(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  if (!match) return value
  const formatted = n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span aria-label={value}>
      {match[1]}
      {formatted}
      {match[3]}
    </span>
  )
}
