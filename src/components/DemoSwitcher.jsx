import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlaskConical, RotateCcw } from 'lucide-react'
import { Popover, useToggle } from './UI'
import { useApp, useToast } from '../state/AppState'

export const SCENARIOS = [
  { id: 'active', label: 'Active user', color: '#17b26a', desc: 'Onboarding complete, device assigned & activated — full dashboard.' },
  { id: 'reserved', label: 'Device reserved', color: '#f7ce46', desc: 'Profiling done, device reserved but not yet activated or assigned.' },
  { id: 'new', label: 'New user', color: '#98a2b3', desc: 'Account created, profiling not yet completed.' },
]

/** Floating control to preview the three customer scenarios. */
export default function DemoSwitcher() {
  const { scenario, setScenario, reset } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ref = useRef(null)
  const [open, toggle, close] = useToggle()
  const current = SCENARIOS.find((s) => s.id === scenario)
  if (pathname === '/logged-out') return null
  return (
    <div className="demo">
      <button ref={ref} className="demo-pill" onClick={toggle} aria-expanded={open} aria-label="Switch preview scenario">
        <FlaskConical size={14} />
        <span className="d-dot" style={{ background: current.color }} />
        <span className="d-label">{current.label}</span>
      </button>
      <Popover anchorRef={ref} open={open} onClose={close} align="left" className="demo-panel">
        <div className="demo-head">
          <strong>Preview scenario</strong>
          Switch between customer states to preview each experience.
        </div>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`demo-opt ${s.id === scenario ? 'on' : ''}`}
            onClick={() => {
              setScenario(s.id)
              close()
              toast(`Previewing: ${s.label}`, { type: 'info' })
              if (pathname.startsWith('/get-started') || pathname === '/about') navigate('/dashboard')
            }}
          >
            <span className="d-dot" style={{ background: s.color }} />
            <span>
              <b>{s.label}</b>
              <small>{s.desc}</small>
            </span>
          </button>
        ))}
        <div className="menu-sep" />
        <button
          className="menu-item"
          onClick={() => {
            reset()
            close()
            navigate('/dashboard')
            toast('Demo data reset', { type: 'info' })
          }}
        >
          <RotateCcw size={14} /> Reset demo data
        </button>
      </Popover>
    </div>
  )
}
