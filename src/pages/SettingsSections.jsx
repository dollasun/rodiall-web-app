import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound, Mail, Phone, PhoneCall, CalendarDays, Copy, Check, BadgeCheck, Smartphone, Router, Cpu, Barcode, Fingerprint,
  FileText, ShieldCheck, IdCard, ArrowRight, Clock, X, Headphones, ArrowUpRight, KeyRound, Landmark, CircleCheck, Lock, Info, Globe, ChevronDown,
} from 'lucide-react'
import { EmptyState, Modal } from '../components/UI'
import { useApp, useToast } from '../state/AppState'
import { DEVICES, RODIALL_DEVICES, USER } from '../data/mock'
import { POLICIES, POLICY_TAGS, policyContent, policyLanguages } from '../data/policies'

/* ---------- shared bits ---------- */
function useCopy() {
  const toast = useToast()
  const [copied, setCopied] = useState(null)
  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600)
      toast('Copied to clipboard', { msg: value })
    } catch {
      toast('Could not copy', { type: 'error', msg: value })
    }
  }
  return { copied, copy }
}

function InfoTile({ icon: Icon, label, value, mono, copyKey, copyState, muted }) {
  return (
    <div className="info-tile">
      <span className="info-ic">
        <Icon size={17} />
      </span>
      <div className="info-main">
        <span className="info-label">{label}</span>
        <span className={`info-value ${mono ? 'mono' : ''} ${muted ? 'muted' : ''}`}>
          {typeof value === 'string' && value.includes('@') ? (
            <>
              {value.split('@')[0]}@<wbr />
              {value.split('@')[1]}
            </>
          ) : (
            value
          )}
        </span>
      </div>
      {copyKey && !muted && (
        <button
          className={`icon-btn info-copy ${copyState.copied === copyKey ? 'done' : ''}`}
          onClick={() => copyState.copy(copyKey, value)}
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
        >
          {copyState.copied === copyKey ? <Check size={15} /> : <Copy size={15} />}
        </button>
      )}
    </div>
  )
}

function SectionHead({ title, sub, action }) {
  return (
    <div className="card-head sec-head">
      <div>
        <h3 className="card-title">{title}</h3>
        {sub && <p className="card-sub">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

const longDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/* =========================================================
   Profile
   ========================================================= */
const PROFILE_FIELDS = [
  { key: 'firstName', label: 'First Name', icon: UserRound },
  { key: 'lastName', label: 'Last Name', icon: UserRound },
  { key: 'email', label: 'Email Address', icon: Mail, copy: true },
  { key: 'primaryPhone', label: 'Primary Phone Number', icon: Phone, copy: true },
  { key: 'secondaryPhone', label: 'Secondary Phone Number', icon: PhoneCall, copy: true },
  { key: 'createdAt', label: 'Account Created', icon: CalendarDays, format: longDate },
]

export function Profile() {
  const { scenario } = useApp()
  const copyState = useCopy()
  const status = scenario === 'active' ? 'Device active' : scenario === 'reserved' ? 'Device reserved' : 'Profiling pending'
  return (
    <section className="card">
      <SectionHead title="Profile" sub="Your personal details and how we reach you." />
      <div className="profile-grid">
        <aside className="subcard profile-hero">
          <span className="profile-banner" aria-hidden="true" />
          <span className="profile-avatar">{USER.initials}</span>
          <h4 className="ph-name">{USER.fullName}</h4>
          <p className="ph-email">{USER.email}</p>
          <div className="profile-chips">
            <span className="p-chip verified">
              <BadgeCheck size={13} /> Verified
            </span>
            <span className="p-chip">{status}</span>
          </div>
          <div className="ph-meta">
            <div>
              <span>Member since</span>
              <b>{new Date(USER.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</b>
            </div>
            <div>
              <span>Customer ID</span>
              <b>{USER.deviceId}</b>
            </div>
          </div>
        </aside>
        <div className="info-grid">
          {PROFILE_FIELDS.map((f) => {
            const raw = USER[f.key]
            const value = raw ? (f.format ? f.format(raw) : raw) : 'Not added'
            return <InfoTile key={f.key} icon={f.icon} label={f.label} value={value} muted={!raw} copyKey={f.copy ? f.key : null} copyState={copyState} />
          })}
        </div>
      </div>
      <Eligibility />
    </section>
  )
}

/* =========================================================
   Eligibility profiling (inside Profile)
   Add a programme by adding an entry to PROGRAMMES.
   ========================================================= */
const FLEX_COMPLETED_AT = '2025-01-12T10:24:00'

const PROGRAMMES = [
  {
    id: 'flex',
    title: 'Flex Ownership',
    icon: KeyRound,
    tone: 'purple',
    desc: 'Get a device now and get plugged into the digital economy',
    available: true,
  },
  {
    id: 'financing',
    title: 'Rodiall Financing',
    icon: Landmark,
    tone: 'blue',
    desc: 'Finance a premium device with fixed monthly instalments through Rodiall.',
    available: false, // not yet open to customers; set true to enable profiling
  },
]

function Eligibility() {
  const { scenario, financing } = useApp()
  const navigate = useNavigate()

  const status = {
    flex: scenario === 'new' ? null : { completedAt: FLEX_COMPLETED_AT },
    financing,
  }
  const done = PROGRAMMES.filter((p) => status[p.id]).length

  const start = (id) => {
    if (id === 'flex') navigate('/get-started')
  }

  return (
    <div className="elig">
      <div className="elig-head">
        <div>
          <h4 className="elig-title">Eligibility Profiling</h4>
          <p className="card-sub">Plans you can use to get a Rodiall device.</p>
        </div>
        <span className="elig-count" aria-label={`${done} of ${PROGRAMMES.length} completed`}>
          <b>{done}</b>/{PROGRAMMES.length} completed
        </span>
      </div>
      <div className="elig-grid">
        {PROGRAMMES.map((p) => {
          const st = status[p.id]
          const Icon = p.icon
          return (
            <article key={p.id} className={`subcard elig-card ${st ? 'is-done' : 'is-pending'} ${!st && !p.available ? 'is-unavailable' : ''}`} aria-disabled={!st && !p.available ? true : undefined}>
              <div className="elig-top">
                <span className={`elig-ic t-${p.tone}`}>
                  <Icon size={20} />
                </span>
                {st ? (
                  <span className="elig-badge done">
                    <CircleCheck size={13} /> Completed
                  </span>
                ) : (
                  <span className="elig-badge pending">
                    <Clock size={13} /> Pending
                  </span>
                )}
              </div>
              <h5 className="elig-name">{p.title}</h5>
              <p className="elig-desc">{p.desc}</p>
              <div className="elig-foot">
                {st ? (
                  <>
                    <span className="elig-meta">
                      <CalendarDays size={13} /> Completed {longDate(st.completedAt)}
                    </span>
                  </>
                ) : (
                  p.available ? (
                    <>
                      <span className="elig-meta">
                        <Clock size={13} /> Takes about 2 minutes
                      </span>
                      <button className="btn btn-primary elig-cta" onClick={() => start(p.id)}>
                        Start profiling <ArrowRight size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="elig-meta">
                        <Info size={13} /> Not yet open to customers
                      </span>
                      <button className="btn elig-cta elig-cta-locked" disabled aria-disabled="true" title="Rodiall Financing profiling is not available yet">
                        <Lock size={14} /> Not yet available
                      </button>
                    </>
                  )
                )}
              </div>
            </article>
          )
        })}
      </div>

    </div>
  )
}

/* =========================================================
   Device info
   ========================================================= */
const DEVICE_FIELDS = [
  { key: 'model', label: 'Device Model', icon: Cpu },
  { key: 'deviceId', label: 'Device ID', icon: IdCard, mono: true, copy: true },
  { key: 'serial', label: 'Device Serial Number', icon: Barcode, mono: true, copy: true },
  { key: 'uid', label: 'Device UID', icon: Fingerprint, mono: true, copy: true },
]

function DeviceCard({ device, status = 'active', note }) {
  const copyState = useCopy()
  const Icon = device.kind === 'mifi' ? Router : Smartphone
  const pending = status === 'reserved'
  return (
    <article className="subcard device-card">
      <header className="device-card-head">
        <span className={`device-ic ${device.kind}`}>
          <Icon size={22} />
        </span>
        <div className="device-card-title">
          <h4>{device.label}</h4>
          <span>{device.kind === 'mifi' ? 'Portable MiFi' : 'Smartphone'}</span>
        </div>
        {pending ? (
          <span className="pill-pending">
            <Clock size={12} /> Awaiting activation
          </span>
        ) : (
          <span className="pill-active">
            <span className="dot" /> Active
          </span>
        )}
      </header>
      <div className="device-fields">
        {DEVICE_FIELDS.map((f) => (
          <InfoTile
            key={f.key}
            icon={f.icon}
            label={f.label}
            value={device[f.key] || 'Assigned at activation'}
            muted={!device[f.key]}
            mono={f.mono && !!device[f.key]}
            copyKey={f.copy ? `${device.id}-${f.key}` : null}
            copyState={copyState}
          />
        ))}
      </div>
      {note && <p className="device-note">{note}</p>}
    </article>
  )
}

export function DeviceInfo() {
  const { scenario, reservation } = useApp()
  const navigate = useNavigate()

  if (scenario === 'new') {
    return (
      <section className="card">
        <SectionHead title="Device Info" sub="Details of the devices linked to your account." />
        <EmptyState
          compact
          icon={<Smartphone size={30} strokeWidth={1.6} />}
          title="No device linked yet"
          text="Complete your profiling to reserve a device. Its model, device ID, serial number and UID will appear here once it’s assigned to you."
          action={
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/get-started')}>
              Complete Profiling <ArrowRight size={15} />
            </button>
          }
        />
      </section>
    )
  }

  const devices =
    scenario === 'active'
      ? DEVICES
      : [
          {
            id: 'reserved',
            kind: 'phone',
            label: (RODIALL_DEVICES.find((d) => d.id === reservation?.deviceId) || RODIALL_DEVICES[0]).name,
            model: (RODIALL_DEVICES.find((d) => d.id === reservation?.deviceId) || RODIALL_DEVICES[0]).name,
          },
        ]

  return (
    <section className="card">
      <SectionHead
        title="Device Info"
        sub={`${devices.length} device${devices.length > 1 ? 's' : ''} linked to your account.`}
      />
      <div className="device-list">
        {devices.map((d) => (
          <DeviceCard
            key={d.id}
            device={d}
            status={scenario === 'active' ? 'active' : 'reserved'}
            note={scenario === 'reserved' ? 'The device ID, serial number and UID are assigned when your device is activated at pickup or delivery.' : null}
          />
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   Policies
   ========================================================= */
const POLICY_ICONS = { terms: FileText, privacy: ShieldCheck }

export function Policies() {
  const [openId, setOpenId] = useState(null)
  const open = POLICIES.find((p) => p.id === openId)
  return (
    <section className="card">
      <SectionHead title="Policies" sub="The terms that govern your Rodiall account and how we handle your data." />
      <div className="policy-grid">
        {POLICIES.map((p) => {
          const Icon = POLICY_ICONS[p.icon] || FileText
          const mins = Math.max(1, Math.round(p.sections.reduce((n, [, t]) => n + t.split(' ').length, 0) / 200))
          return (
            <button key={p.id} className={`subcard policy-card pc-${p.icon}`} onClick={() => setOpenId(p.id)}>
              <span className="policy-ic">
                <Icon size={22} />
              </span>
              <h4>{p.title}</h4>
              <p>{p.summary}</p>
              <div className="policy-meta">
                <span>
                  <CalendarDays size={13} /> Updated {p.updated}
                </span>
                <span>
                  <Clock size={13} /> {mins} min read
                </span>
              </div>
              <span className="policy-cta">
                Read policy <ArrowUpRight size={15} />
              </span>
            </button>
          )
        })}
      </div>
      <PolicyModal policy={open} onClose={() => setOpenId(null)} />
    </section>
  )
}

/** Accessible language dropdown (button + listbox). Escape closes the list without closing the modal. */
function LanguageSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const listRef = useRef(null)
  const uid = useId()
  const current = options.find((o) => o.code === value) || options[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.code === current.code)))
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) btnRef.current?.focus()
  }
  const choose = (code) => {
    onChange(code)
    close()
  }
  const onListKey = (e) => {
    const n = options.length
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation() // closes only the list; the modal stays open
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + n) % n)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(n - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(options[active].code)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="lang-select" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className={`lang-btn ${open ? 'open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            openList()
          }
        }}
      >
        <Globe size={15} aria-hidden="true" />
        <span className="lang-current">{current.label}</span>
        <ChevronDown size={16} className="lang-chev" aria-hidden="true" />
      </button>
      {open && (
        <ul ref={listRef} className="lang-list" role="listbox" aria-label="Language" tabIndex={-1} aria-activedescendant={`${uid}-${active}`} onKeyDown={onListKey}>
          {options.map((o, i) => (
            <li
              key={o.code}
              id={`${uid}-${i}`}
              role="option"
              aria-selected={o.code === current.code}
              className={`lang-opt ${i === active ? 'active' : ''} ${o.code === current.code ? 'selected' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o.code)}
            >
              {o.label}
              {o.code === current.code && <Check size={15} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PolicyModal({ policy, onClose }) {
  const hid = useId()
  const scrollRef = useRef(null)
  const { language, set } = useApp()
  const options = policy ? policyLanguages(policy) : []
  const lang = options.some((o) => o.code === language) ? language : 'en'
  const content = policy ? policyContent(policy, lang) : null

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [policy?.id, lang])

  if (!policy) return null
  const tag = POLICY_TAGS[policy.tag] || POLICY_TAGS.flex

  return (
    <Modal open onClose={onClose} className="policy-modal" width={760} labelledBy={hid}>
      <header className={`pr-head ${options.length > 1 ? '' : 'no-lang'}`}>
        <h3 className="pr-title" id={hid} lang={content.lang}>
          {content.title}
        </h3>
        {options.length > 1 && <LanguageSelect value={lang} options={options} onChange={(code) => set({ language: code })} />}
        <button className="modal-close pr-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </header>
      <div className="pr-scroll" ref={scrollRef} tabIndex={0}>
        <p className="pr-intro" lang={content.lang}>
          {content.summary}
        </p>
        <article key={lang} className="pr-card fade-in" lang={content.lang} aria-labelledby={hid}>
          <div className="pr-card-head">
            <span className={`pr-tag ${tag.tone}`}>{tag.label}</span>
            <span className="pr-updated">
              <CalendarDays size={13} /> Last updated {policy.updated}
            </span>
          </div>
          <div className="pr-card-body">
            {content.sections.map(([h, t]) => (
              <section key={h} className="pr-sec">
                <h4>{h}</h4>
                <p>{t}</p>
              </section>
            ))}
          </div>
        </article>
      </div>
      <footer className="pm-foot">
        <span className="pm-foot-note">
          <Headphones size={14} /> Questions? Reach us via Settings › Support.
        </span>
        <button className="btn btn-primary btn-lg" onClick={onClose}>
          Done
        </button>
      </footer>
    </Modal>
  )
}
