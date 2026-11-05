import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download, Link2, CirclePlay, MessageSquare, MapPin, Store, House, Smartphone, Check, X, Bell } from 'lucide-react'
import { AppTile, FlyingBox, PhoneMockup, RodiallLogo } from '../components/Brand'
import { Modal, Popover, useToggle } from '../components/UI'
import { ReservationModal } from './ReservationModal'
import { RODIALL_DEVICES, STORES, deliveryAvailable, makeReservationCode, nearestStore, ugx } from '../data/mock'
import { useApp, useToast } from '../state/AppState'

const APPS = [
  ['whatsapp', 'WhatsApp'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'],
  ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['snapchat', 'Snapchat'],
  ['netflix', 'Netflix'], ['boomplay', 'Boomplay'], ['banking', 'Banking'],
]
const USAGE = [
  { id: 'download', title: 'Download to my phone', sub: 'Watch and listen offline', icon: Download },
  { id: 'mix', title: 'A mix of both', sub: 'Some downloads, some streaming', icon: Link2 },
  { id: 'stream', title: 'Stream online', sub: 'Watch and listen with data or wifi', icon: CirclePlay },
  { id: 'rarely', title: 'I rarely do', sub: 'Mostly calls, chats and browsing', icon: MessageSquare },
]

export function SiteHeader() {
  return (
    <header className="rd-header">
      <div className="rd-container rd-header-inner">
        <Link to="/dashboard" aria-label="Rodiall dashboard">
          <RodiallLogo height={30} />
        </Link>
        <nav className="rd-nav">
          <NavLink to="/get-started" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
        </nav>
      </div>
    </header>
  )
}

function Radio({ on }) {
  return <span className={`rd-radio ${on ? 'on' : ''}`} aria-hidden="true" />
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { setScenario } = useApp()
  const [apps, setApps] = useState(() => new Set())
  const [usage, setUsage] = useState(null)
  const [deviceIdx, setDeviceIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [reservation, setReservation] = useState(null)

  useEffect(() => {
    document.title = 'Rodiall | Get your phone'
    return () => {
      document.title = 'Rodiall | Customer Dashboard'
    }
  }, [])

  const complete = apps.size > 0 && !!usage
  const device = RODIALL_DEVICES[deviceIdx]

  const toggleApp = (id) =>
    setApps((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const chooseUsage = (id) => {
    setUsage(id)
    // light-touch recommendation: heavy streamers get the 5G model
    setDeviceIdx(id === 'stream' ? 1 : 0)
  }

  const stepTwo = modalOpen || !!reservation

  return (
    <div className="rd-site force-light">
      <SiteHeader />
      <main className="rd-container rd-main">
        <section className="rd-left">
          <div className="rd-step">
            <span>{stepTwo ? 'Step 2 of 2' : 'Step 1 of 2'}</span>
            <div className="rd-progress">
              <i className="on" />
              <i className={stepTwo ? 'on' : ''} />
            </div>
          </div>
          <h1 className="rd-title">Two quick questions, one great phone</h1>
          <hr className="rd-hr" />

          <h2 className="rd-q">Which apps do you use the most?</h2>
          <div className="rd-apps" role="group" aria-label="Which apps do you use the most?">
            {APPS.map(([id, label]) => (
              <button key={id} className={`rd-opt ${apps.has(id) ? 'selected' : ''}`} onClick={() => toggleApp(id)} aria-pressed={apps.has(id)}>
                <AppTile app={id} />
                <span className="rd-opt-label">{label}</span>
                <Radio on={apps.has(id)} />
              </button>
            ))}
          </div>

          <h2 className="rd-q">How will you watch movies and listen to music?</h2>
          <div className="rd-usage" role="radiogroup" aria-label="How will you watch movies and listen to music?">
            {USAGE.map(({ id, title, sub, icon: Icon }) => (
              <button key={id} role="radio" aria-checked={usage === id} className={`rd-opt rd-opt-lg ${usage === id ? 'selected' : ''}`} onClick={() => chooseUsage(id)}>
                <span className="rd-usage-ic">
                  <Icon size={13} />
                </span>
                <span className="rd-opt-label">
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </span>
                <Radio on={usage === id} />
              </button>
            ))}
          </div>

          <button className="rd-btn rd-btn-primary rd-proceed" disabled={!complete} onClick={() => setModalOpen(true)}>
            <span className="t-desk">Proceed</span>
            <span className="t-mob">See my device</span>
          </button>
          <p className="rd-caption">{complete ? 'Great — tap proceed to see your device' : 'Answer both questions to proceed to your device'}</p>
        </section>

        <aside className="rd-right">
          <div className="rd-phone-stage">
            <button className="rd-arrow" onClick={() => setDeviceIdx((i) => (i - 1 + RODIALL_DEVICES.length) % RODIALL_DEVICES.length)} aria-label="Previous device">
              <ChevronLeft size={16} />
            </button>
            <div key={device.id} className="fade-in">
              <PhoneMockup height={252} wallpaper={deviceIdx === 0 ? 'lilac' : 'ocean'} />
            </div>
            <button className="rd-arrow" onClick={() => setDeviceIdx((i) => (i + 1) % RODIALL_DEVICES.length)} aria-label="Next device">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="rd-device-info">
            <div className="rd-device-head">
              <h3>{device.short}</h3>
              <div className="rd-price">
                <strong>{ugx(device.price)}</strong>
                <span>Pay at device activation</span>
              </div>
            </div>
            <div className="rd-specs">
              {device.specs.flat().map((s, i) => (
                <span key={i} className={i % 2 ? 'r' : ''}>{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <DeviceModal
        open={modalOpen && !reservation}
        device={device}
        deviceIdx={deviceIdx}
        onClose={() => setModalOpen(false)}
        onReserved={(r) => setReservation(r)}
      />
      <ReservationModal
        open={!!reservation}
        reservation={reservation}
        onClose={() => {}}
        onDone={() => {
          setScenario('reserved', reservation)
          navigate('/dashboard')
        }}
      />
    </div>
  )
}

/* ---------------- Device details + fulfilment modal ---------------- */
const SLIDES = [
  { view: 'front', wallpaper: 'lilac' },
  { view: 'back' },
  { view: 'front', wallpaper: 'ocean' },
  { view: 'back' },
  { view: 'front', wallpaper: 'sunset' },
]

function DeviceModal({ open, device, deviceIdx, onClose, onReserved }) {
  const toast = useToast()
  const [slide, setSlide] = useState(0)
  const [address, setAddress] = useState('')
  const [debounced, setDebounced] = useState('')
  const [method, setMethod] = useState('pickup')
  const [storeId, setStoreId] = useState(null)
  const [agree, setAgree] = useState(false)
  const [soonOpen, setSoonOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const changeRef = useRef(null)
  const [storeMenu, toggleStoreMenu, closeStoreMenu] = useToggle()

  useEffect(() => {
    if (open) {
      setSlide(deviceIdx === 1 ? 2 : 0)
      setSubmitting(false)
    }
  }, [open, deviceIdx])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(address), 650)
    return () => clearTimeout(t)
  }, [address])

  const hasAddress = debounced.trim().length >= 4
  const locating = address.trim().length >= 4 && address !== debounced
  const deliveryOK = !hasAddress || deliveryAvailable(debounced)
  const autoStore = useMemo(() => nearestStore(debounced), [debounced])
  const store = STORES.find((s) => s.id === storeId) || autoStore

  useEffect(() => {
    setStoreId(null)
  }, [autoStore.id])

  useEffect(() => {
    if (method === 'delivery' && !deliveryOK) {
      setMethod('pickup')
      setSoonOpen(true)
    }
  }, [deliveryOK, method])

  const canSubmit = hasAddress && !locating && agree && (method === 'pickup' || deliveryOK) && !submitting

  const submit = () => {
    setSubmitting(true)
    setTimeout(() => {
      onReserved({
        deviceId: device.id,
        method,
        code: makeReservationCode(),
        address: debounced.trim().replace(/\.$/, ''),
        storeId: store.id,
        createdAt: new Date().toISOString(),
      })
    }, 900)
  }

  if (!open) return null
  const s = SLIDES[slide]

  return (
    <>
      <Modal open onClose={submitting ? undefined : onClose} className="rd-modal rd-device force-light" width={860} dismissable={!submitting}>
        <button className="rd-modal-x" onClick={onClose} aria-label="Close" disabled={submitting}>
          <X size={16} />
        </button>
        <div className="rd-device-grid">
          <div className="rd-gallery">
            <button className="rd-arrow" onClick={() => setSlide((i) => (i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous image">
              <ChevronLeft size={16} />
            </button>
            <div key={slide} className="fade-in rd-gallery-img">
              <PhoneMockup height={350} view={s.view} wallpaper={s.wallpaper} />
            </div>
            <button className="rd-arrow" onClick={() => setSlide((i) => (i + 1) % SLIDES.length)} aria-label="Next image">
              <ChevronRight size={16} />
            </button>
            <div className="rd-dots">
              {SLIDES.map((_, i) => (
                <button key={i} className={i === slide ? 'on' : ''} onClick={() => setSlide(i)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </div>

          <div className="rd-form">
            <h2 className="rd-dev-name">{device.name}</h2>
            <div className="rd-dev-price">
              <strong>{ugx(device.price)}</strong>
              <span>Pay at device activation</span>
            </div>
            <div className="rd-chips">
              {device.chips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>

            <label className="rd-label" htmlFor="rd-address">Where do you live? <span className="rd-req">*</span></label>
            <div className="rd-input">
              <MapPin size={14} />
              <input id="rd-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter home address, eg: 14, Ntinda Road, Kampala" autoComplete="street-address" />
            </div>

            <p className="rd-label" id="rd-method-label">How do you hope to get device? <span className="rd-req">*</span></p>
            <div className={`rd-methods m-${method}`}>
              <button role="radio" aria-checked={method === 'pickup'} className={`rd-method pick ${method === 'pickup' ? 'selected' : ''}`} onClick={() => setMethod('pickup')}>
                <strong>
                  <Store size={14} /> Pick up at store
                </strong>
                <span>We assign the nearest store to you for device pick up</span>
              </button>
              <button
                role="radio"
                aria-checked={method === 'delivery'}
                aria-disabled={!deliveryOK}
                className={`rd-method deliv ${method === 'delivery' ? 'selected' : ''} ${!deliveryOK ? 'disabled' : ''}`}
                onClick={() => (deliveryOK ? setMethod('delivery') : setSoonOpen(true))}
              >
                <strong>
                  <House size={14} /> Deliver to my home
                  {!deliveryOK && <em className="rd-soon-tag">Coming soon</em>}
                </strong>
                <span>An agent delivers device and activates it.</span>
              </button>


            {method === 'pickup' && (hasAddress || locating) && (
              <div className="rd-store fade-in">
                {locating ? (
                  <div className="rd-locating">
                    <span className="spinner" /> Finding the nearest store to you…
                  </div>
                ) : (
                  <>
                    <p className="rd-store-head">Nearest store to you ({store.left} devices left)</p>
                    <div className="rd-store-row">
                      <span className="rd-store-ic">
                        <Store size={16} />
                      </span>
                      <div className="rd-store-info">
                        <strong>{store.name}</strong>
                        <span>{store.address}</span>
                        <span className="rd-store-hours">Open: {store.hours}</span>
                      </div>
                      <button ref={changeRef} className="rd-change" onClick={toggleStoreMenu}>
                        Change
                      </button>
                      <Popover anchorRef={changeRef} open={storeMenu} onClose={closeStoreMenu} className="force-light rd-store-menu">
                        <div className="popover-title" style={{ padding: '4px 8px 0' }}>Choose a pickup store</div>
                        {STORES.map((st) => (
                          <button
                            key={st.id}
                            className={`menu-item ${st.id === store.id ? 'highlight' : ''}`}
                            onClick={() => {
                              setStoreId(st.id)
                              closeStoreMenu()
                            }}
                          >
                            <Store size={14} />
                            <span style={{ flex: 1 }}>
                              <b style={{ display: 'block', fontWeight: 600, color: 'var(--text)' }}>{st.name}</b>
                              <small style={{ color: 'var(--text-3)' }}>{st.left} devices left · {st.hours}</small>
                            </span>
                            {st.id === store.id && <Check size={14} />}
                          </button>
                        ))}
                      </Popover>
                    </div>
                  </>
                )}
              </div>
            )}

            {method === 'delivery' && (
              <div className="rd-agent fade-in">
                <span className="rd-store-ic">
                  <Smartphone size={16} />
                </span>
                <div>
                  <strong>An activation agent will call you within 24 hours</strong>
                  <span>They’ll schedule a time to deliver and activate your {device.name.replace('RodiallPro', 'Pro')} at your address.</span>
                </div>
              </div>
            )}
            </div>

            <label className="rd-check">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="rd-box" aria-hidden="true">
                <Check size={11} strokeWidth={3} />
              </span>
              I agree to Flex Ownership{' '}
              <button type="button" className="rd-link" onClick={() => setTermsOpen(true)}>
                terms and conditions
              </button>
            </label>

            <button className="rd-btn rd-btn-primary rd-submit" disabled={!canSubmit} onClick={submit}>
              {submitting ? <span className="spinner" /> : method === 'pickup' ? 'Confirm Pickup' : 'Request Home Delivery'}
            </button>
            <p className="rd-caption">
              {!hasAddress && !locating ? 'Enter your address to continue. ' : !agree ? 'Accept the terms to continue. ' : ''}Pay at Device Activation.
            </p>
          </div>
        </div>
      </Modal>

      <ComingSoonModal
        open={soonOpen}
        onClose={() => setSoonOpen(false)}
        onNotify={() => toast("You're on the list", { msg: 'We’ll notify you when home delivery reaches your area.' })}
      />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} onAccept={() => { setAgree(true); setTermsOpen(false) }} />
    </>
  )
}

function ComingSoonModal({ open, onClose, onNotify }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (open) setOn(false)
  }, [open])
  return (
    <Modal open={open} onClose={onClose} className="rd-modal rd-soon force-light" width={456}>
      <div className="rd-soon-inner">
        <button className="rd-modal-x" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div className="rd-soon-art">
          <FlyingBox width={190} />
        </div>
        <h2>
          Deliver to my Home
          <br />
          Coming Soon
        </h2>
        <p>This feature will be available in the coming days</p>
        <button
          className={`rd-notify ${on ? 'on' : ''}`}
          onClick={() => {
            if (!on) onNotify()
            setOn(true)
          }}
          aria-pressed={on}
        >
          <span className="knob">{on && <Bell size={10} />}</span>
          <span className="lbl">{on ? 'We’ll notify you' : 'Notify me'}</span>
        </button>
      </div>
    </Modal>
  )
}

function TermsModal({ open, onClose, onAccept }) {
  return (
    <Modal open={open} onClose={onClose} className="rd-modal force-light" width={520}>
      <div className="rd-terms">
        <button className="rd-modal-x" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <h2>Flex Ownership terms and conditions</h2>
        <ol>
          <li>Your device is reserved for you and is paid for at device activation, either at the store or on delivery.</li>
          <li>Activation requires a valid government-issued ID and the phone number used during sign up.</li>
          <li>Reservations are held until the collection date shown on your confirmation. Unclaimed devices are released to other customers.</li>
          <li>Repayments, storage and data plans are managed from your Rodiall dashboard once your device is activated.</li>
          <li>The device remains under Flex Ownership until all repayments are complete, after which full ownership transfers to you.</li>
        </ol>
        <div className="rds-actions">
          <button className="rd-btn rd-btn-outline" onClick={onClose}>Close</button>
          <button className="rd-btn rd-btn-primary" onClick={onAccept}>I agree</button>
        </div>
      </div>
    </Modal>
  )
}

/* ---------------- About + logged out ---------------- */
export function About() {
  return (
    <div className="rd-site force-light">
      <SiteHeader />
      <main className="rd-container rd-about fade-in">
        <span className="rd-eyebrow">About Rodiall</span>
        <h1>Great phones, owned on your terms.</h1>
        <p>
          Rodiall makes quality smartphones accessible through Flex Ownership. Answer two quick questions, we match you with the right
          device, and you pay at activation — then manage repayments, storage and data from one simple dashboard.
        </p>
        <div className="rd-about-grid">
          {[
            ['Matched to you', 'We recommend a device based on the apps you use and how you watch and listen.'],
            ['Pick up or delivery', 'Collect from your nearest Rodiall Agent Hub or have an agent deliver and activate it at home.'],
            ['Grow as you go', 'Add fractional storage and data bundles any time with Repay+ Plus.'],
          ].map(([t, d]) => (
            <div key={t} className="rd-about-card">
              <strong>{t}</strong>
              <span>{d}</span>
            </div>
          ))}
        </div>
        <Link to="/get-started" className="rd-btn rd-btn-primary" style={{ width: 220, marginTop: 28 }}>
          Find my phone
        </Link>
      </main>
    </div>
  )
}

export function LoggedOut() {
  return (
    <div className="rd-site force-light">
      <main className="rd-loggedout fade-in">
        <div className="rd-lo-card">
          <RodiallLogo height={34} />
          <h1>You’ve been logged out</h1>
          <p>Thanks for using Rodiall. Sign back in to manage your device, repayments and plans.</p>
          <Link to="/dashboard" className="rd-btn rd-btn-primary" style={{ width: '100%' }}>
            Log in again
          </Link>
        </div>
      </main>
    </div>
  )
}
