import { useState } from 'react'
import { ArrowRight, Banknote, HandCoins, ScrollText, Barcode, Zap, UsersRound, Plus, Trash2 } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { CheckoutModal } from '../components/CheckoutModal'
import { useApp, useToast } from '../state/AppState'
import { USER, ugx, fmtDMY } from '../data/mock'

const PLANS = [
  { id: 'topup', tone: 'blue', title: 'Top-up', icon: Banknote, label: 'Buy Airtime', total: 250000, via: 'Total Purchases via Top-up' },
  { id: 'epin', tone: 'orange', title: 'E PIN', icon: HandCoins, label: 'Buy Airtime PINs', total: 250000, via: 'Total Purchases via Bundle' },
  { id: 'direct', tone: 'purple', title: 'Pay Direct', icon: ScrollText, label: 'Pay by Bank or Card', total: 250000, via: 'Total Purchases via Top-up' },
  { id: 'data', tone: 'green', title: 'Data Bundle', icon: Barcode, label: 'Buy Data', total: 250000, via: 'Total Purchases via Bundle' },
  { id: 'flex', tone: 'yellow', title: 'Pay As You Go (Flex)', icon: Zap, label: 'Get Data. Pay As You Go', total: 250000, via: 'Total Purchases via Top-up' },
  { id: 'squad', tone: 'red', title: 'Squad Data', icon: UsersRound, label: 'Family and Friends Data Pool', total: 250000, via: 'Total Purchases via E-Pin' },
]

const OPTIONS = {
  topup: [
    { id: 'a500', name: 'UGX 500 Airtime', price: 500 },
    { id: 'a1000', name: 'UGX 1,000 Airtime', price: 1000 },
    { id: 'a2000', name: 'UGX 2,000 Airtime', price: 2000 },
    { id: 'a5000', name: 'UGX 5,000 Airtime', price: 5000 },
  ],
  epin: [
    { id: 'p100', name: 'UGX 100 PIN', price: 100 },
    { id: 'p200', name: 'UGX 200 PIN', price: 200 },
    { id: 'p500', name: 'UGX 500 PIN', price: 500 },
    { id: 'p1000', name: 'UGX 1,000 PIN', price: 1000 },
  ],
  direct: [
    { id: 'd2000', name: 'Repayment UGX 2,000', price: 2000, note: 'Weekly instalment' },
    { id: 'd8000', name: 'Repayment UGX 8,000', price: 8000, note: 'Monthly instalment' },
    { id: 'd51000', name: 'Clear balance', price: 51000, note: 'Outstanding balance' },
  ],
  data: [
    { id: 'b1', name: 'MTN 1GB Daily', price: 350, note: 'Valid for 1 day' },
    { id: 'b5', name: 'MTN 5GB Weekly', price: 1500, note: 'Valid for 7 days' },
    { id: 'b15', name: 'MTN 15GB Monthly', price: 10500, note: 'Valid for 30 days' },
    { id: 'b40', name: 'MTN 40GB Monthly', price: 16000, note: 'Valid for 30 days' },
  ],
  flex: [
    { id: 'f2', name: 'PAYG 2GB Daily', price: 2000, note: 'Access bundle daily' },
    { id: 'f5', name: 'PAYG 5GB', price: 2000, note: 'Get 5GB to access bundle daily for UGX 2,000' },
    { id: 'f10', name: 'PAYG 10GB', price: 3500, note: 'Valid for 30 days' },
  ],
  squad: [
    { id: 's20', name: 'Squad 20GB Pool', price: 6000, note: 'Up to 3 members · 30 days' },
    { id: 's50', name: 'Squad 50GB Pool', price: 13500, note: 'Up to 5 members · 30 days' },
    { id: 's100', name: 'Squad 100GB Pool', price: 24000, note: 'Up to 8 members · 30 days' },
  ],
}

export default function RepayPlus() {
  const [active, setActive] = useState(null)
  return (
    <>
      <TopBar title="Repay+ Plus" variant="profile" />
      <div className="page">
        <section className="card plans-card">
          <h2 className="plans-title">Pick a plan you love</h2>
          <div className="plans-grid">
            {PLANS.map((p) => {
              const Icon = p.icon
              return (
                <button key={p.id} className={`plan plan-${p.tone}`} onClick={() => setActive(p)}>
                  <span className="plan-head">
                    <span className="plan-icon">
                      <Icon size={15} color="#fff" strokeWidth={2} />
                    </span>
                    {p.title}
                  </span>
                  <span className="plan-inner">
                    <span className="plan-label">{p.label}</span>
                    <strong className="plan-total">{ugx(p.total)}</strong>
                    <small className="plan-via">{p.via}</small>
                    <span className="plan-arrow" aria-hidden="true">
                      <ArrowRight size={11} />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
      {active && <PlanFlow plan={active} onClose={() => setActive(null)} />}
    </>
  )
}

function PlanFlow({ plan, onClose }) {
  const toast = useToast()
  const { addNotification } = useApp()
  const options = OPTIONS[plan.id]
  const [opt, setOpt] = useState(options[Math.min(1, options.length - 1)].id)
  const [phone, setPhone] = useState(USER.primaryPhone)
  const [qty, setQty] = useState(1)
  const [members, setMembers] = useState(['08031234567'])
  const chosen = options.find((o) => o.id === opt)
  const total = chosen.price * (plan.id === 'epin' ? qty : 1)
  const phoneOk = /^0\d{10}$/.test(phone.replace(/\s/g, ''))
  const membersOk = plan.id !== 'squad' || members.every((m) => /^0\d{10}$/.test(m.replace(/\s/g, '')))
  const today = new Date()

  const needsPhone = ['topup', 'data', 'flex'].includes(plan.id)
  const details = [
    ['Plan', plan.title],
    ['Package', chosen.name],
    ...(needsPhone ? [['Recipient', phone || '—']] : []),
    ...(plan.id === 'epin' ? [['Quantity', String(qty)]] : []),
    ...(plan.id === 'squad' ? [['Members', String(members.length + 1)]] : []),
    ['Date', fmtDMY(today)],
    ['Total', ugx(total)],
  ]

  const successText = {
    topup: `${chosen.name} sent to ${phone}.`,
    epin: `${qty} × ${chosen.name}${qty > 1 ? 's have' : ' has'} been sent to you via SMS.`,
    direct: `Your payment of ${ugx(total)} has been received.`,
    data: `${chosen.name} has been activated on ${phone}.`,
    flex: `${chosen.name} has been activated on ${phone}.`,
    squad: `${chosen.name} created. Invites were sent to ${members.length} member(s).`,
  }[plan.id]

  return (
    <CheckoutModal
      open
      onClose={onClose}
      title={plan.title === 'Pay As You Go (Flex)' ? 'Pay As You Go (Flex)' : plan.title}
      detailsLabel="Summary"
      details={details}
      canContinue={(!needsPhone || phoneOk) && membersOk}
      onComplete={() => {
        addNotification({ tone: 'success', icon: 'coins', title: `${plan.title} successful`, body: successText, cat: 'Repay+' })
        toast(`${plan.title} successful`, { msg: successText })
      }}
      successText={successText}
      successCta="Done"
      onSuccessCta={() => {}}
    >
      <div>
        <div className="modal-section-label">{plan.label}</div>
        <div className="opt-grid">
          {options.map((o) => (
            <button key={o.id} type="button" className={`opt-tile ${o.id === opt ? 'selected' : ''}`} onClick={() => setOpt(o.id)} aria-pressed={o.id === opt}>
              <span className="opt-name">{o.name}</span>
              {o.note && <span className="opt-note">{o.note}</span>}
              <span className="opt-price">{ugx(o.price)}</span>
            </button>
          ))}
        </div>
      </div>
      {needsPhone && (
        <div className="field">
          <label className="field-label" htmlFor="plan-phone">Phone number</label>
          <input id="plan-phone" className={`input ${phone && !phoneOk ? 'invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))} inputMode="tel" maxLength={13} />
          {phone && !phoneOk && <span className="field-error">Enter a valid 11-digit phone number</span>}
        </div>
      )}
      {plan.id === 'epin' && (
        <div className="field">
          <span className="field-label">Quantity</span>
          <div className="stepper">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase">+</button>
          </div>
        </div>
      )}
      {plan.id === 'squad' && (
        <div className="field">
          <span className="field-label">Squad members</span>
          {members.map((m, i) => (
            <div key={i} className="input-wrap">
              <input
                className={`input has-trail ${m && !/^0\d{10}$/.test(m.replace(/\s/g, '')) ? 'invalid' : ''}`}
                value={m}
                placeholder="Member phone number"
                inputMode="tel"
                maxLength={13}
                onChange={(e) => setMembers((ms) => ms.map((x, j) => (j === i ? e.target.value.replace(/[^\d\s]/g, '') : x)))}
              />
              {members.length > 1 && (
                <button type="button" className="input-trail" onClick={() => setMembers((ms) => ms.filter((_, j) => j !== i))} aria-label="Remove member">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {members.length < 7 && (
            <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setMembers((ms) => [...ms, ''])}>
              <Plus size={12} /> Add member
            </button>
          )}
        </div>
      )}
    </CheckoutModal>
  )
}
