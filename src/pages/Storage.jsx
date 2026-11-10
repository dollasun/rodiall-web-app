import { useState } from 'react'
import { Cloud } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { CheckoutModal } from '../components/CheckoutModal'
import { ScenarioEmpty } from '../components/ScenarioEmpty'
import { useApp, useToast } from '../state/AppState'
import { STORAGE_PLANS, fmtDMY, ugx } from '../data/mock'

const CAPACITY = 128

export default function Storage() {
  const { scenario, purchasedStorage, set, addNotification } = useApp()
  const toast = useToast()
  const [plan, setPlan] = useState(null)
  const today = new Date()
  const exp = new Date(today.getTime() + 30 * 864e5)
  const purchased = purchasedStorage || 0

  return (
    <>
      <TopBar title="Storage" variant="profile" />
      <div className="page">
        {scenario !== 'active' ? (
          <ScenarioEmpty area="storage" />
        ) : (
          <>
            <section className="card">
              <h3 className="card-title" style={{ marginBottom: 14 }}>Storage</h3>
              <div className="storage-grid">
                <div className="st-card st-yellow">
                  <div className="st-top">
                    <span className="st-label">Base Usage</span>
                    <Cloud size={16} />
                  </div>
                  <strong className="st-value">122.5 GB</strong>
                  <div className="st-bar">
                    <i style={{ width: '88%' }} />
                  </div>
                  <div className="st-legend">
                    <span>Base: <b>2 GB</b></span>
                    <span>Free: <b>5.5 GB</b></span>
                    <span>Purchased: <b>{purchased} GB</b></span>
                  </div>
                </div>
                <div className="st-card st-plain">
                  <div className="st-top">
                    <span className="st-label">Purchased</span>
                    <Cloud size={16} />
                  </div>
                  <strong className="st-value">
                    <span className="muted">{purchased}</span> / {CAPACITY} GB
                  </strong>
                  <div className="st-bar thin">
                    <i style={{ width: `${Math.max(1, (purchased / CAPACITY) * 100)}%` }} />
                  </div>
                  <div className="st-legend">
                    <span>Available: <b>{CAPACITY - purchased} GB</b></span>
                    <span>Purchased: <b>{purchased} GB</b></span>
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Upgrade Your Storage</h3>
              <div className="upgrade-grid">
                {STORAGE_PLANS.map((p) => {
                  const full = purchased + p.gb > CAPACITY
                  return (
                    <div key={p.gb} className="up-card">
                      <div className="up-top">
                        <span className="up-ic">
                          <Cloud size={14} />
                        </span>
                        <strong>{p.gb} GB</strong>
                        {p.popular && <span className="up-pop">Popular</span>}
                      </div>
                      <div className="up-mid">
                        <span>Valid For 30days</span>
                        <span>{ugx(p.price)}</span>
                      </div>
                      <button className="btn btn-outline-yellow btn-block btn-sm" onClick={() => setPlan(p)} disabled={full} title={full ? 'Exceeds available capacity' : undefined}>
                        Buy
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>
      <CheckoutModal
        open={!!plan}
        onClose={() => setPlan(null)}
        details={
          plan
            ? [
                ['Subscription Type', 'Storage'],
                ['Current Bundle Name', 'Do_MI5_PAYG'],
                ['Plan Descriptions', `${plan.gb} GB Fractional Storage`],
                ['Validity Period', '30 days'],
                ['Price', ugx(plan.price)],
                ['Date', fmtDMY(today)],
                ['Expiration Date', fmtDMY(exp)],
              ]
            : []
        }
        onComplete={() => {
          set((s) => ({ purchasedStorage: (s.purchasedStorage || 0) + plan.gb }))
          addNotification({ tone: 'success', icon: 'database', title: 'Storage upgrade successful', body: `${plan.gb} GB fractional storage has been added to your device.`, cat: 'Storage' })
          toast('Storage upgraded', { msg: `${plan.gb} GB added to your storage.` })
        }}
      />
    </>
  )
}
