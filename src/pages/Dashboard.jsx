import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, CalendarCheck2, CircleCheck, HandCoins, RefreshCw, Info } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { CountUp, DataTable, Donut, SearchInput, StatusBadge } from '../components/UI'
import { CheckoutModal } from '../components/CheckoutModal'
import { ScenarioEmpty } from '../components/ScenarioEmpty'
import { useApp, useToast } from '../state/AppState'
import { DEVICES, MIFI_PURCHASES, MIFI_SUBSCRIPTIONS, OVERVIEW, PHONE_PURCHASES, USER, fmtDMY, naira } from '../data/mock'
import { exportCSV, matchesSearch } from '../data/utils'

const ICONS = { wallet: Wallet, calendar: CalendarCheck2, check: CircleCheck, coins: HandCoins }
const ICON_COLOR = { yellow: '#e99a2c', blue: '#3b82f6', peach: '#f08a3c', lavender: '#8b5cf6' }

export default function Dashboard() {
  const { scenario } = useApp()
  return (
    <>
      <TopBar title="Dashboard" />
      <div className="page">
        <h2 className="greeting">Hi {USER.firstName}, Welcome back 👋🏾</h2>
        {scenario === 'active' ? <ActiveDashboard /> : <ScenarioEmpty area="dashboard" />}
      </div>
    </>
  )
}

function ActiveDashboard() {
  const [deviceId, setDeviceId] = useState('phone')
  const device = DEVICES.find((d) => d.id === deviceId)

  return (
    <>
      <div className="device-switch" role="tablist" aria-label="Your Devices">
        <span className="device-switch-label">Your Devices</span>
        {DEVICES.map((d) => (
          <button key={d.id} role="tab" aria-selected={d.id === deviceId} className={`device-tab ${d.id === deviceId ? 'active' : ''}`} onClick={() => setDeviceId(d.id)}>
            {d.label}
          </button>
        ))}
      </div>

      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 14 }}>Overview</h3>
        <div className="overview-grid">
          {OVERVIEW.map((o) => {
            const Icon = ICONS[o.icon]
            return (
              <div key={o.key} className={`ov-card ov-${o.tone}`}>
                <OverviewPattern />
                <span className="ov-icon">
                  <Icon size={12} color={ICON_COLOR[o.tone]} strokeWidth={2.2} />
                </span>
                <span className="ov-label">{o.label}</span>
                <strong className="ov-value"><CountUp value={o.value} /></strong>
              </div>
            )
          })}
        </div>
      </section>

      <div key={deviceId} className="dash-grid fade-in">
        {device.kind === 'phone' ? <StorageWidget /> : <SubscriptionWidget />}
        <div className="dash-right">
          <SummaryCard device={device} />
          {device.kind === 'mifi' && <MifiSubscriptions />}
        </div>
      </div>

      <PurchaseHistory key={`ph-${deviceId}`} rows={device.kind === 'phone' ? PHONE_PURCHASES : MIFI_PURCHASES} deviceLabel={device.label} />
    </>
  )
}

function OverviewPattern() {
  return (
    <svg className="ov-pattern" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M70 -10 C 95 30, 140 20, 170 60" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="18" />
      <path d="M95 -10 C 115 25, 150 15, 175 35" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="10" />
      <circle cx="150" cy="10" r="34" fill="#fff" fillOpacity="0.12" />
      <circle cx="120" cy="96" r="30" fill="#fff" fillOpacity="0.08" />
    </svg>
  )
}

function Legend({ items }) {
  return (
    <div className="legend">
      {items.map(([label, color]) => (
        <span key={label}>
          <i style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  )
}

function StorageWidget() {
  const navigate = useNavigate()
  return (
    <section className="card widget">
      <div className="card-head">
        <h3 className="card-title">Storage</h3>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/storage')}>
          <RefreshCw size={12} /> Buy Storage
        </button>
      </div>
      <div className="widget-body">
        <Donut value={79} size={200} stroke={26}>
          <strong className="donut-value">79%</strong>
          <span className="donut-label">Storage capacity used</span>
        </Donut>
        <div className="mini-tiles">
          <div className="mini-tile">
            <span>Used</span>
            <strong>3.2GB / 5GB</strong>
          </div>
          <div className="mini-tile">
            <span>Plan</span>
            <strong>Fractional Storage</strong>
          </div>
        </div>
      </div>
      <Legend items={[['Used', 'var(--primary)'], ['Available', 'var(--chart-dark)']]} />
    </section>
  )
}

function SubscriptionWidget() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const today = new Date()
  const exp = new Date(today.getTime() + 60 * 864e5)
  return (
    <section className="card widget">
      <div className="card-head">
        <h3 className="card-title">Active Subscriptions</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
          <RefreshCw size={12} /> Renew Plan
        </button>
      </div>
      <div className="widget-body">
        <Donut value={88} size={200} stroke={26}>
          <strong className="donut-value lg">3 Days</strong>
          <span className="donut-label">Until next subscription</span>
        </Donut>
        <div className="mini-tiles">
          <div className="mini-tile">
            <span>Descriptions</span>
            <strong>Signal Bundle</strong>
          </div>
          <div className="mini-tile">
            <span>Validity Period</span>
            <strong>2 Months</strong>
          </div>
          <div className="mini-tile">
            <span>Time Remaining</span>
            <strong>3 Days</strong>
          </div>
        </div>
      </div>
      <Legend items={[['Used Time', 'var(--primary)'], ['Available Bundle', 'var(--chart-dark)']]} />
      <CheckoutModal
        open={open}
        onClose={() => setOpen(false)}
        title="Renew Subscription Plan"
        details={[
          ['Subscription Type', 'Data Bundle'],
          ['Current Bundle Name', 'Signal Bundle'],
          ['Device', 'MTN MiFi M5 CPE'],
          ['Validity Period', '2 Months'],
          ['Price', naira(15000)],
          ['Date', fmtDMY(today)],
          ['Expiration Date', fmtDMY(exp)],
        ]}
        onComplete={() => toast('Plan renewed', { msg: 'Signal Bundle renewed for 2 months.' })}
        successText="Your Signal Bundle plan has been renewed."
        successCta="Back to Dashboard"
        onSuccessCta={() => {}}
      />
    </section>
  )
}

function SummaryCard({ device }) {
  return (
    <section className="card summary-card">
      <div className="card-head">
        <h3 className="card-title">{device.summaryTitle}</h3>
        <span className="pill-active" title="Device is active">
          <span className="dot" /> Active <Info size={11} />
        </span>
      </div>
      <div className="summary-grid">
        {device.summary.map(([k, v]) => (
          <div key={k} className="summary-tile">
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function MifiSubscriptions() {
  return (
    <section className="card">
      <h3 className="card-title" style={{ marginBottom: 12 }}>Active Subscriptions</h3>
      <div className="mini-table">
        <div className="mini-table-head">
          <span>Subscription Type</span>
          <span>Expiry Date</span>
        </div>
        <div className="mini-table-body">
          {MIFI_SUBSCRIPTIONS.map((s) => (
            <div key={s.type} className="mini-table-row">
              <span>{s.type}</span>
              <span>{s.expiry}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PurchaseHistory({ rows, deviceLabel }) {
  const toast = useToast()
  const [q, setQ] = useState('')
  const filtered = useMemo(() => rows.filter((r) => matchesSearch(r, q, ['sn', 'ref', 'description', 'method', 'status', 'date'])), [rows, q])
  const columns = [
    { key: 'sn', label: 'SN' },
    { key: 'ref', label: 'Payment Ref' },
    { key: 'description', label: 'Description', primary: true },
    { key: 'amount', label: 'Amount', render: (r) => naira(r.amount).replace(',', '') },
    { key: 'date', label: 'Purchase Date', render: (r) => r.date.replace(' | ', '  |  ') },
    { key: 'method', label: 'Payment Method' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]
  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Purchase History</h3>
        <div className="toolbar">
          <SearchInput value={q} onChange={setQ} />
          <button
            className="btn btn-primary btn-sm"
            style={{ minWidth: 76 }}
            onClick={() => {
              exportCSV(
                `purchase-history-${deviceLabel.replace(/\s+/g, '-').toLowerCase()}.csv`,
                columns.map((c) => ({ ...c, value: c.key === 'amount' ? (r) => r.amount : undefined })),
                filtered,
              )
              toast('Export started', { msg: `${filtered.length} record(s) exported to CSV.` })
            }}
          >
            Export
          </button>
        </div>
      </div>
      <DataTable columns={columns} rows={filtered} emptyText={`No purchases match “${q}”`} />
    </section>
  )
}
