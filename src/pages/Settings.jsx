import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Plus, Ellipsis, Copy, CircleCheck, CircleX, Star, Trash2 } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { ActionMenu, Modal, ModalHeader, PaymentCardVisual, ThemeSwitch } from '../components/UI'
import { useApp, useToast } from '../state/AppState'
import { USER } from '../data/mock'
import { DeviceInfo, Policies, Profile } from './SettingsSections'

// Order matters: this is the tab order shown to customers. Add a section by adding a row.
const TABS = [
  { key: 'profile', label: 'Profile', Component: Profile },
  { key: 'device', label: 'Device Info', Component: DeviceInfo },
  { key: 'security', label: 'Security', Component: Security },
  { key: 'cards', label: 'My Cards', Component: Cards },
  { key: 'support', label: 'Support', Component: Support },
  { key: 'policies', label: 'Policies', Component: Policies },
]
const DEFAULT_TAB = TABS[0].key

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const current = TABS.find((t) => t.key === params.get('tab')) || TABS[0]
  const scrollRef = useRef(null)
  const focusAfterNav = useRef(false)

  // keep the active tab visible when the tab strip scrolls (phones / narrow screens)
  useEffect(() => {
    const el = scrollRef.current?.querySelector('.tab-btn.active')
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    if (focusAfterNav.current) {
      el?.focus()
      focusAfterNav.current = false
    }
  }, [current.key])

  const select = (key) => setParams(key === DEFAULT_TAB ? {} : { tab: key }, { replace: true })
  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.key === current.key)
    const next = e.key === 'ArrowRight' ? TABS[(i + 1) % TABS.length] : e.key === 'ArrowLeft' ? TABS[(i - 1 + TABS.length) % TABS.length] : null
    if (next) {
      e.preventDefault()
      focusAfterNav.current = true
      select(next.key)
    }
  }
  const { Component } = current

  return (
    <>
      <TopBar title={`Hello ${USER.firstName}, Welcome!`} mobileTitle="Settings" />
      <div className="page">
        <h2 className="page-title">Settings</h2>
        <div className="tabs-bar settings-tabs">
          <div className="tabs-scroll" ref={scrollRef} role="tablist" aria-label="Settings sections" onKeyDown={onKeyDown}>
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={current.key === t.key}
                aria-controls="settings-panel"
                tabIndex={current.key === t.key ? 0 : -1}
                className={`tab-btn ${current.key === t.key ? 'active' : ''}`}
                onClick={() => select(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ThemeSwitch />
        </div>
        <div key={current.key} className="fade-in" role="tabpanel" id="settings-panel" aria-labelledby={`tab-${current.key}`}>
          <Component />
        </div>
      </div>
    </>
  )
}

/* ---------------- Account & Security ---------------- */
function PasswordField({ id, label, value, onChange, placeholder, invalid, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} type={show ? 'text' : 'password'} className={`input has-trail ${invalid ? 'invalid' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} />
        <button type="button" className="input-trail" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>
    </div>
  )
}

const RULES = [
  ['len', 'At least 8 characters', (p) => p.length >= 8],
  ['upper', 'One uppercase character', (p) => /[A-Z]/.test(p)],
  ['special', 'One special character', (p) => /[^A-Za-z0-9]/.test(p)],
  ['lower', 'One lowercase character', (p) => /[a-z]/.test(p)],
]

function Security() {
  const toast = useToast()
  const { passwordModified, set } = useApp()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const results = useMemo(() => RULES.map(([k, l, fn]) => ({ k, l, ok: fn(next) })), [next])
  const strong = results.every((r) => r.ok)
  const mismatch = confirm.length > 0 && confirm !== next
  const sameAsOld = next && cur && next === cur
  const matches = confirm.length > 0 && confirm === next
  // Button only becomes active once every requirement is met
  const canSubmit = cur.length > 0 && strong && matches && !sameAsOld
  const hint = !cur
    ? 'Enter your current password'
    : !next
      ? 'Enter a new password'
      : !strong
        ? 'New password must meet all requirements'
        : sameAsOld
          ? 'New password must differ from your current one'
          : !matches
            ? 'Confirm your new password'
            : ''

  const submit = (e) => {
    e.preventDefault()
    if (!canSubmit || saving) return
    setSubmitted(true)
    if (!cur) return toast('Enter your current password', { type: 'error' })
    if (!strong) return toast('Password is too weak', { type: 'error', msg: 'Meet all the password requirements.' })
    if (sameAsOld) return toast('Choose a new password', { type: 'error', msg: 'Your new password must differ from the current one.' })
    if (next !== confirm) return toast('Passwords do not match', { type: 'error' })
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setCur('')
      setNext('')
      setConfirm('')
      setSubmitted(false)
      set({ passwordModified: 'Just now' })
      toast('Password updated', { msg: 'Your password was changed successfully.' })
    }, 900)
  }

  return (
    <section className="card">
      <h3 className="card-title" style={{ marginBottom: 16 }}>Account &amp; Security Credentials</h3>
      <div className="sec-grid">
        <form className="subcard pw-card" onSubmit={submit} noValidate>
          <h4 className="pw-title">Change Password</h4>
          <p className="pw-sub">
            Last modified: <b>{passwordModified}</b>
          </p>
          <div className="pw-fields">
            <PasswordField id="pw-cur" label="Current Password" value={cur} onChange={setCur} placeholder="Enter current password" invalid={submitted && !cur} autoComplete="current-password" />
            <PasswordField id="pw-new" label="New Password" value={next} onChange={setNext} placeholder="Enter new password" invalid={(submitted && !strong) || sameAsOld} autoComplete="new-password" />
            <PasswordField id="pw-confirm" label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Retype new password" invalid={mismatch} autoComplete="new-password" />
            {mismatch && <span className="field-error" style={{ marginTop: -8 }}>Passwords do not match</span>}
            {matches && strong && <span className="field-ok fade-in" style={{ marginTop: -8 }}><CircleCheck size={13} /> Passwords match</span>}
            {sameAsOld && <span className="field-error" style={{ marginTop: -8 }}>New password must differ from your current password</span>}
          </div>
          {next.length > 0 && !strong && (
            <div className="pw-rules fade-in" aria-live="polite">
              <p className="pw-weak">Weak Password. Your password must contain:</p>
              <ul>
                {results.map((r) => (
                  <li key={r.k} className={r.ok ? 'ok' : 'bad'}>
                    {r.ok ? <CircleCheck size={11} fill="currentColor" stroke="#fff" /> : <CircleX size={11} fill="currentColor" stroke="#fff" />}
                    {r.l}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {next.length > 0 && strong && (
            <div className="pw-strong fade-in">
              <CircleCheck size={13} /> Strong password
            </div>
          )}
          <div className="pw-actions">
            {hint && <span className="pw-hint" id="pw-hint">{hint}</span>}
            <button className="btn btn-primary btn-lg" type="submit" disabled={!canSubmit || saving} aria-describedby={hint ? 'pw-hint' : undefined} style={{ minWidth: 172 }}>
              {saving ? <span className="spinner" /> : 'Update Password'}
            </button>
          </div>
        </form>

        <div className="sec-side">
          <div className="subcard">
            <span className="shield-ic">
              <ShieldCheck size={16} />
            </span>
            <h4 className="side-title">Two-Factor Authentication</h4>
            <p className="side-text">Your account is protected with Google Authenticator hardware-backed TOTP security.</p>
            <div className="status-strip">
              <span className="dot" /> Status: <b>Active</b>
            </div>
          </div>
          <div className="subcard">
            <h4 className="side-title" style={{ marginTop: 6 }}>Active Admin Session</h4>
            <div className="session-rows">
              <div>
                <span>Device:</span>
                <b>Chrome Desktop (macOS)</b>
              </div>
              <div>
                <span>IP Address:</span>
                <b>123.456.789.01</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- My Cards ---------------- */
function Cards() {
  const { cards, set } = useApp()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState(null)

  const makeDefault = (id) => {
    set((s) => ({ cards: s.cards.map((c) => ({ ...c, isDefault: c.id === id })) }))
    toast('Default card updated')
  }
  const remove = (id) => {
    set((s) => {
      const left = s.cards.filter((c) => c.id !== id)
      if (left.length && !left.some((c) => c.isDefault)) left[0] = { ...left[0], isDefault: true }
      return { cards: left }
    })
    setRemoving(null)
    toast('Card removed')
  }

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">My Payment Cards</h3>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={15} /> Add New Card
        </button>
      </div>
      {cards.length === 0 ? (
        <div className="cards-empty">No payment cards yet. Add a card to pay for plans and repayments.</div>
      ) : (
        <div className="cards-grid">
          {cards.map((c) => (
            <div key={c.id} className="card-slot fade-in">
              <PaymentCardVisual card={c} />
              <div className="card-slot-foot">
                <span className={`card-tag ${c.isDefault ? 'def' : 'alt'}`}>
                  <i /> {c.isDefault ? 'Default' : 'Alternate'}
                </span>
                <ActionMenu
                  label={`Actions for card ending ${c.last4}`}
                  trigger={<Ellipsis size={16} />}
                  items={[
                    ...(c.isDefault ? [] : [{ label: 'Set as Default', icon: <Star size={14} />, onClick: () => makeDefault(c.id) }]),
                    { label: 'Remove Card', icon: <Trash2 size={14} />, danger: true, onClick: () => setRemoving(c) },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pci-note">
        <span className="shield-ic sm">
          <ShieldCheck size={13} />
        </span>
        <p>
          <b>PCI-DSS Level 1 Encrypted Storage:</b> Full card numbers and security cryptograms are processed using zero-knowledge client tokenization. Only the masked digits and card type token are stored locally.
        </p>
      </div>
      <AddCardModal open={adding} onClose={() => setAdding(false)} />
      <Modal open={!!removing} onClose={() => setRemoving(null)} width={380}>
        <div style={{ padding: '26px 24px 22px', textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
            <Trash2 size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Remove this card?</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 6 }}>
            Card ending •••• {removing?.last4} will be removed from your account{removing?.isDefault ? ' and another card will become your default' : ''}.
          </p>
          <div className="modal-actions" style={{ marginTop: 22 }}>
            <button className="btn btn-ghost" onClick={() => setRemoving(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => remove(removing.id)}>Remove Card</button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

function luhn(num) {
  let sum = 0
  let dbl = false
  for (let i = num.length - 1; i >= 0; i--) {
    let d = +num[i]
    if (dbl) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    dbl = !dbl
  }
  return sum % 10 === 0
}

function AddCardModal({ open, onClose }) {
  const { cards, set } = useApp()
  const toast = useToast()
  const hid = useId()
  const [num, setNum] = useState('')
  const [name, setName] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const [makeDef, setMakeDef] = useState(false)
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const digits = num.replace(/\D/g, '')
  const [mm, yy] = exp.split('/')
  const now = new Date()
  const expOk = /^\d{2}\/\d{2}$/.test(exp) && +mm >= 1 && +mm <= 12 && new Date(2000 + +yy, +mm, 0) >= new Date(now.getFullYear(), now.getMonth(), 1)
  const errors = {
    num: digits.length < 16 || !luhn(digits) ? 'Enter a valid 16-digit card number' : '',
    name: name.trim().length < 2 ? 'Enter the name on the card' : '',
    exp: !expOk ? 'Enter a valid expiry date (MM/YY)' : '',
    cvv: !/^\d{3,4}$/.test(cvv) ? 'Enter a valid CVV' : '',
  }
  const valid = !Object.values(errors).some(Boolean)

  const reset = () => {
    setNum('')
    setName('')
    setExp('')
    setCvv('')
    setMakeDef(false)
    setTouched(false)
    setSaving(false)
  }
  const close = () => {
    reset()
    onClose()
  }
  const save = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    setSaving(true)
    setTimeout(() => {
      const card = { id: `c${Date.now()}`, first4: digits.slice(0, 4), last4: digits.slice(-4), name: name.trim(), brand: 'Mastercard', isDefault: makeDef || cards.length === 0 }
      set((s) => ({ cards: [...s.cards.map((c) => (card.isDefault ? { ...c, isDefault: false } : c)), card] }))
      toast('Card added', { msg: `Card ending •••• ${card.last4} saved securely.` })
      close()
    }, 900)
  }

  const preview = { first4: digits.slice(0, 4).padEnd(4, '•'), last4: digits.length > 12 ? digits.slice(12, 16).padEnd(4, '•') : '••••', name: name || 'CARD HOLDER', brand: 'Mastercard' }

  return (
    <Modal open={open} onClose={close} width={460} labelledBy={hid}>
      <ModalHeader title="Add New Card" onClose={close} id={hid} />
      <form className="modal-body" onSubmit={save} noValidate>
        <div style={{ maxWidth: 300, margin: '0 auto', width: '100%' }}>
          <PaymentCardVisual card={preview} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cc-num">Card Number</label>
          <input
            id="cc-num"
            className={`input ${touched && errors.num ? 'invalid' : ''}`}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={num}
            onChange={(e) => setNum(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
          />
          {touched && errors.num && <span className="field-error">{errors.num}</span>}
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cc-name">Name on Card</label>
          <input id="cc-name" className={`input ${touched && errors.name ? 'invalid' : ''}`} autoComplete="cc-name" placeholder="e.g. AR Jonson" value={name} onChange={(e) => setName(e.target.value.slice(0, 26))} />
          {touched && errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" htmlFor="cc-exp">Expiry Date</label>
            <input
              id="cc-exp"
              className={`input ${touched && errors.exp ? 'invalid' : ''}`}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={exp}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
              }}
            />
            {touched && errors.exp && <span className="field-error">{errors.exp}</span>}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="cc-cvv">CVV</label>
            <input id="cc-cvv" type="password" className={`input ${touched && errors.cvv ? 'invalid' : ''}`} inputMode="numeric" autoComplete="cc-csc" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} />
            {touched && errors.cvv && <span className="field-error">{errors.cvv}</span>}
          </div>
        </div>
        <label className="check-row">
          <input type="checkbox" checked={makeDef} onChange={(e) => setMakeDef(e.target.checked)} />
          Set as default payment card
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost btn-lg" onClick={close}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? <span className="spinner" /> : 'Save Card'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------------- Support ---------------- */
const SUPPORT = [
  { title: 'Call Support', desc: 'Speak directly with an experienced support agent', label: '24 Hours Call Line:', value: '+234 800 000 0000', href: 'tel:+2348000000000' },
  { title: 'WhatsApp Support', desc: 'Chat live with an agent via WhatsApp', label: '24 Hours WhatsApp Chat:', value: '+234 800 000 0000', href: 'https://wa.me/2348000000000' },
  { title: 'Email Support', desc: 'Submit in-depth technical inquiries', label: 'Email:', value: 'user.support@email.com', href: 'mailto:user.support@email.com' },
]

function Support() {
  const toast = useToast()
  const copy = async (v) => {
    try {
      await navigator.clipboard.writeText(v)
      toast('Copied to clipboard', { msg: v })
    } catch {
      toast('Could not copy', { type: 'error', msg: v })
    }
  }
  return (
    <section className="card">
      <h3 className="card-title" style={{ marginBottom: 16 }}>Contact Support</h3>
      <div className="support-grid">
        {SUPPORT.map((s) => (
          <div key={s.title} className="subcard support-card">
            <span className="shield-ic">
              <ShieldCheck size={16} />
            </span>
            <h4 className="side-title">{s.title}</h4>
            <p className="side-text">{s.desc}</p>
            <div className="support-box">
              <div style={{ minWidth: 0 }}>
                <span>{s.label}</span>
                <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {s.value}
                </a>
              </div>
              <button className="icon-btn" onClick={() => copy(s.value)} aria-label={`Copy ${s.value}`} style={{ width: 26, height: 26 }}>
                <Copy size={13} />
              </button>
            </div>
            <p className="sla">
              <b>SLA Guarantee:</b> Response in 3 Minutes
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
