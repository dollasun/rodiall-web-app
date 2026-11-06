import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Calendar, Download, SlidersHorizontal, EllipsisVertical, Eye, FileDown, RotateCcw } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { ActionMenu, DataTable, PaymentCardVisual, Popover, SearchInput, StatusBadge, useToggle } from '../components/UI'
import { CheckoutModal, DetailsModal } from '../components/CheckoutModal'
import { ScenarioEmpty } from '../components/ScenarioEmpty'
import { useApp, useToast } from '../state/AppState'
import { PAYMENTS, SUBSCRIPTIONS, USER, fmtDMY, naira, parseDMY } from '../data/mock'
import { downloadReceipt, exportCSV, matchesSearch } from '../data/utils'

export default function PurchaseHistory() {
  const { scenario } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'payments' ? 'payments' : 'subscriptions'
  const setTab = (t) => setParams(t === 'payments' ? { tab: t } : {}, { replace: true })

  return (
    <>
      <TopBar title={`Hello ${USER.firstName}, Welcome!`} mobileTitle="Purchase History" />
      <div className="page">
        <h2 className="page-title">Purchase History</h2>
        <div className="tabs-bar yellow-outline" role="tablist">
          <button role="tab" aria-selected={tab === 'subscriptions'} className={`tab-btn wide ${tab === 'subscriptions' ? 'active' : ''}`} onClick={() => setTab('subscriptions')}>
            Subscriptions
          </button>
          <button role="tab" aria-selected={tab === 'payments'} className={`tab-btn wide ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>
            Payments
          </button>
        </div>
        {scenario !== 'active' ? (
          <ScenarioEmpty area="history" />
        ) : tab === 'subscriptions' ? (
          <Subscriptions key="s" />
        ) : (
          <Payments key="p" />
        )}
      </div>
    </>
  )
}

/* ---------- filters ---------- */
function useFilters(rows, searchKeys, typeKey) {
  const [q, setQ] = useState('')
  const [range, setRange] = useState({ from: '', to: '' })
  const [statuses, setStatuses] = useState([])
  const [types, setTypes] = useState([])
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (!matchesSearch(r, q, searchKeys)) return false
        if (statuses.length && !statuses.includes(r.status)) return false
        if (types.length && !types.includes(r[typeKey])) return false
        if (range.from || range.to) {
          const d = parseDMY(r.date).getTime()
          if (range.from && d < new Date(range.from + 'T00:00').getTime()) return false
          if (range.to && d > new Date(range.to + 'T23:59').getTime()) return false
        }
        return true
      }),
    [rows, q, statuses, types, range, searchKeys, typeKey],
  )
  return { q, setQ, range, setRange, statuses, setStatuses, types, setTypes, filtered }
}

function DateFilter({ range, setRange }) {
  const ref = useRef(null)
  const [open, toggle, close] = useToggle()
  const [draft, setDraft] = useState(range)
  const active = range.from || range.to
  return (
    <>
      <button ref={ref} className={`tool-btn ${active ? 'active' : ''}`} onClick={() => { setDraft(range); toggle() }} aria-expanded={open}>
        <Calendar size={14} /> Date
      </button>
      <Popover anchorRef={ref} open={open} onClose={close} className="popover">
        <div className="popover-title">Filter by date</div>
        <div className="date-grid">
          <label className="field">
            <span className="popover-group-label">From</span>
            <input type="date" className="input" value={draft.from} max={draft.to || undefined} onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))} />
          </label>
          <label className="field">
            <span className="popover-group-label">To</span>
            <input type="date" className="input" value={draft.to} min={draft.from || undefined} onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))} />
          </label>
        </div>
        <div className="quick-ranges">
          {[
            ['Last 7 days', 7],
            ['Last 30 days', 30],
          ].map(([l, n]) => (
            <button
              key={l}
              className="chip-btn"
              onClick={() => {
                const to = new Date(2025, 0, 10)
                const from = new Date(to.getTime() - (n - 1) * 864e5)
                const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                setDraft({ from: iso(from), to: iso(to) })
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="popover-actions">
          <button className="btn btn-outline btn-sm" onClick={() => { setRange({ from: '', to: '' }); close() }}>Clear</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setRange(draft); close() }}>Apply</button>
        </div>
      </Popover>
    </>
  )
}

function FilterButton({ statusOptions, typeOptions, typeLabel, statuses, setStatuses, types, setTypes }) {
  const ref = useRef(null)
  const [open, toggle, close] = useToggle()
  const count = statuses.length + types.length
  const flip = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  return (
    <>
      <button ref={ref} className={`tool-btn ${count ? 'active' : ''}`} onClick={toggle} aria-label="Filters" aria-expanded={open}>
        <SlidersHorizontal size={15} />
        {count > 0 && <span className="count">{count}</span>}
      </button>
      <Popover anchorRef={ref} open={open} onClose={close} className="popover">
        <div className="popover-title">Filters</div>
        <div className="popover-group">
          <div className="popover-group-label">Status</div>
          {statusOptions.map((s) => (
            <label key={s} className="check-row">
              <input type="checkbox" checked={statuses.includes(s)} onChange={() => flip(statuses, setStatuses, s)} />
              {s}
            </label>
          ))}
        </div>
        <div className="popover-group">
          <div className="popover-group-label">{typeLabel}</div>
          {typeOptions.map((s) => (
            <label key={s} className="check-row">
              <input type="checkbox" checked={types.includes(s)} onChange={() => flip(types, setTypes, s)} />
              {s}
            </label>
          ))}
        </div>
        <div className="popover-actions">
          <button className="btn btn-outline btn-sm" onClick={() => { setStatuses([]); setTypes([]) }}>Reset</button>
          <button className="btn btn-primary btn-sm" onClick={close}>Done</button>
        </div>
      </Popover>
    </>
  )
}

/* ---------- Subscriptions tab ---------- */
function Subscriptions() {
  const toast = useToast()
  const f = useFilters(SUBSCRIPTIONS, ['sn', 'type', 'payment', 'duration', 'date', 'expiry', 'status', 'ref'], 'type')
  const [view, setView] = useState(null)
  const [retry, setRetry] = useState(null)

  const detailRows = (r) => [
    ['Reference', r.ref],
    ['Subscription Type', r.type],
    ['Payment Type', r.payment],
    ['Duration', r.duration],
    ['Amount', naira(r.amount)],
    ['Date', r.date],
    ['Expiration Date', r.expiry],
    ['Status', <StatusBadge key="s" status={r.status} />],
  ]

  const columns = [
    { key: 'sn', label: 'SN' },
    { key: 'type', label: 'Subscription  Type', primary: true },
    { key: 'payment', label: 'Payment Type' },
    { key: 'duration', label: 'Duration', sortValue: (r) => ({ '24 hours': 1, '7 Days': 7, '1 month': 30 })[r.duration] },
    { key: 'amount', label: 'Amount', render: (r) => naira(r.amount).replace(',', '') },
    { key: 'date', label: 'Date', sortValue: (r) => parseDMY(r.date).getTime() },
    { key: 'expiry', label: 'Expiration Date', sortValue: (r) => parseDMY(r.expiry).getTime() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status === 'Successful' ? 'Successful' : r.status} /> },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      className: 'col-action',
      render: (r) => (
        <ActionMenu
          trigger={<EllipsisVertical size={16} />}
          items={[
            { label: 'View details', icon: <Eye size={14} />, onClick: () => setView(r) },
            { label: 'Download receipt', icon: <FileDown size={14} />, onClick: () => { downloadReceipt(r, detailRows(r).slice(0, 7)); toast('Receipt downloaded') } },
            ...(r.status === 'Failed' ? ['sep', { label: 'Retry payment', icon: <RotateCcw size={14} />, onClick: () => setRetry(r) }] : []),
          ]}
        />
      ),
    },
  ]

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title" style={{ fontSize: 20 }}>Subscription History</h3>
        <div className="toolbar">
          <SearchInput value={f.q} onChange={f.setQ} width={310} />
          <DateFilter range={f.range} setRange={f.setRange} />
          <FilterButton
            statusOptions={['Successful', 'Failed']}
            typeOptions={['PAYG', 'Renewal']}
            typeLabel="Subscription type"
            statuses={f.statuses}
            setStatuses={f.setStatuses}
            types={f.types}
            setTypes={f.setTypes}
          />
        </div>
      </div>
      <DataTable columns={columns} rows={f.filtered} pageSize={7} emptyText="No subscriptions match your filters" />
      <DetailsModal open={!!view} onClose={() => setView(null)} title="Subscription Details" rows={view ? detailRows(view) : []} />
      <CheckoutModal
        open={!!retry}
        onClose={() => setRetry(null)}
        title="Retry Payment"
        details={retry ? [['Subscription Type', retry.type], ['Duration', retry.duration], ['Amount', naira(retry.amount)], ['Date', fmtDMY(new Date())]] : []}
        onComplete={() => toast('Payment successful', { msg: `${retry?.type} subscription is now active.` })}
        successText="Your subscription has been activated."
        successCta="Done"
        onSuccessCta={() => {}}
      />
    </section>
  )
}

/* ---------- Payments tab ---------- */
function Payments() {
  const toast = useToast()
  const { cards } = useApp()
  const card = cards.find((c) => c.isDefault) || cards[0]
  const [rows, setRows] = useState(PAYMENTS)
  const f = useFilters(rows, ['sn', 'type', 'bundle', 'method', 'date', 'status', 'ref'], 'type')
  const [view, setView] = useState(null)
  const [pay, setPay] = useState(null)
  const [pendingPaid, setPendingPaid] = useState(false)

  const detailRows = (r) => [
    ['Transaction Reference', r.ref],
    ['Purpose', r.type],
    ['Bundle Type', r.bundle],
    ['Payment Method', r.method],
    ['Amount', naira(r.amount)],
    ['Date Created', r.date],
    ['Status', <StatusBadge key="s" status={r.status} />],
  ]

  // Column headers follow the live portal's Payment History table
  const columns = [
    { key: 'sn', label: 'SN' },
    { key: 'ref', label: 'Transaction Reference' },
    { key: 'type', label: 'Purpose', primary: true },
    { key: 'method', label: 'Payment Method' },
    { key: 'amount', label: 'Amount', render: (r) => naira(r.amount).replace(',', '') },
    { key: 'date', label: 'Date Created', sortValue: (r) => parseDMY(r.date).getTime() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  const exportCols = columns.filter((c) => c.key !== 'action').map((c) => ({ ...c, value: c.key === 'amount' ? (r) => r.amount : undefined }))

  return (
    <>
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Payment Management</h3>
        <div className="pm-grid">
          <div className="subcard">
            <h4 className="subcard-title">Pending Payment</h4>
            {pendingPaid ? (
              <div className="pending-box paid">
                <StatusBadge status="Successful" />
                <span>You have no pending payments.</span>
              </div>
            ) : (
              <button className="pending-box" onClick={() => setPay({ pending: true })} aria-label="Pay pending PAYG 5GB, N2,000">
                <div className="pending-top">
                  <strong>PAYG 5GB</strong>
                  <span className="pending-amt">N2,000</span>
                </div>
                <span className="pending-valid">Valid For 30days</span>
                <span className="pending-desc">Get 5GB To Access Bundle Daily @2000N</span>
                <span className="pending-cta">Pay now <ArrowRight size={13} /></span>
              </button>
            )}
          </div>
          <div className="subcard">
            <h4 className="subcard-title">Payment Method</h4>
            {card ? <PaymentCardVisual card={card} /> : <p className="card-sub">No card added yet.</p>}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3 className="card-title" style={{ fontSize: 20 }}>Payment History</h3>
          <div className="toolbar">
            <SearchInput value={f.q} onChange={f.setQ} width={310} />
            <DateFilter range={f.range} setRange={f.setRange} />
            <button
              className="tool-btn"
              onClick={() => {
                exportCSV('payment-history.csv', exportCols, f.filtered)
                toast('Export started', { msg: `${f.filtered.length} payment(s) exported to CSV.` })
              }}
            >
              <Download size={14} /> Export
            </button>
            <FilterButton
              statusOptions={['Successful', 'Failed', 'Pending']}
              typeOptions={['PAYG', 'Renewal']}
              typeLabel="Subscription type"
              statuses={f.statuses}
              setStatuses={f.setStatuses}
              types={f.types}
              setTypes={f.setTypes}
            />
          </div>
        </div>
        <DataTable columns={columns} rows={f.filtered} pageSize={7} emptyText="No payments match your filters" onRowClick={setView} />
      </section>

      <DetailsModal
        open={!!view}
        onClose={() => setView(null)}
        title="Payment Details"
        rows={view ? detailRows(view) : []}
        footer={
          view && (
            <div className="modal-actions">
              <button className="btn btn-ghost btn-lg" onClick={() => setView(null)}>Close</button>
              {view.status === 'Successful' ? (
                <button className="btn btn-primary btn-lg" onClick={() => { downloadReceipt(view, detailRows(view).slice(0, 6)); toast('Receipt downloaded') }}>
                  <FileDown size={15} /> Download receipt
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => { const r = view; setView(null); setPay({ row: r }) }}>
                  <RotateCcw size={15} /> {view.status === 'Failed' ? 'Retry payment' : 'Complete payment'}
                </button>
              )}
            </div>
          )
        }
      />
      <CheckoutModal
        open={!!pay}
        onClose={() => setPay(null)}
        title={pay?.pending ? 'Pending Payment' : 'Complete Payment'}
        detailsLabel="Payment Details"
        details={
          pay?.pending
            ? [['Subscription Type', 'PAYG'], ['Bundle', 'PAYG 5GB'], ['Description', 'Get 5GB To Access Bundle Daily'], ['Validity Period', '30 days'], ['Price', 'N2,000'], ['Date', fmtDMY(new Date())]]
            : pay?.row
              ? [['Reference', pay.row.ref], ['Subscription Type', pay.row.type], ['Bundle Type', pay.row.bundle], ['Amount', naira(pay.row.amount)], ['Date', fmtDMY(new Date())]]
              : []
        }
        onComplete={(method) => {
          if (pay?.pending) setPendingPaid(true)
          if (pay?.row) {
            const id = pay.row.id
            setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'Successful', method: method === 'momo' ? 'MOMO Wallet' : 'Card' } : r)))
          }
          toast('Payment successful', { msg: 'Your payment has been received.' })
        }}
        successText="Your payment was successful and your subscription is active."
        successCta="Done"
        onSuccessCta={() => {}}
      />
    </>
  )
}
