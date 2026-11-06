import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound, Mail, Phone, PhoneCall, CalendarDays, Copy, Check, BadgeCheck, Smartphone, Router, Cpu, Barcode, Fingerprint,
  FileText, ShieldCheck, ArrowRight, Clock, X, Headphones, ArrowUpRight,
} from 'lucide-react'
import { EmptyState, Modal } from '../components/UI'
import { useApp, useToast } from '../state/AppState'
import { DEVICES, RODIALL_DEVICES, USER } from '../data/mock'
import { POLICIES } from '../data/policies'

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
    </section>
  )
}

/* =========================================================
   Device info
   ========================================================= */
const DEVICE_FIELDS = [
  { key: 'model', label: 'Device Model', icon: Cpu },
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
          text="Complete your profiling to reserve a device. Its model, serial number and UID will appear here once it’s assigned to you."
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
            note={scenario === 'reserved' ? 'The serial number and UID are assigned when your device is activated at pickup or delivery.' : null}
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

function PolicyModal({ policy, onClose }) {
  const hid = useId()
  const bodyRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [policy?.id])

  if (!policy) return null
  const Icon = POLICY_ICONS[policy.icon] || FileText
  const onScroll = (e) => {
    const el = e.currentTarget
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 100)
  }

  return (
    <Modal open onClose={onClose} className="policy-modal" width={760} labelledBy={hid}>
      <header className="pm-head">
        <span className="policy-ic sm">
          <Icon size={18} />
        </span>
        <div className="pm-head-text">
          <h3 id={hid}>{policy.title}</h3>
          <span>Last updated {policy.updated}</span>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
        <span className="pm-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      </header>
      <div className="pm-body" ref={bodyRef} onScroll={onScroll} tabIndex={0}>
        <nav className="pm-toc" aria-label="Contents">
          <span className="pm-toc-title">Contents</span>
          {policy.sections.map(([h], i) => (
            <a
              key={h}
              href={`#${policy.id}-${i}`}
              onClick={(e) => {
                e.preventDefault()
                bodyRef.current?.querySelector(`#${policy.id}-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {h}
            </a>
          ))}
        </nav>
        <div className="pm-content">
          <p className="pm-lead">{policy.summary}</p>
          {policy.sections.map(([h, t], i) => (
            <section key={h} id={`${policy.id}-${i}`} className="pm-section">
              <h4>{h}</h4>
              <p>{t}</p>
            </section>
          ))}
        </div>
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
