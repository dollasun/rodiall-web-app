import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CircleCheck, CircleX, Info, X } from 'lucide-react'
import { DEFAULT_CARDS, DEFAULT_RESERVATION, seedNotifications } from '../data/mock'

/**
 * scenario:
 *  - 'active'   : onboarding complete, device assigned & activated (full dashboard)
 *  - 'reserved' : profiling complete, device reserved but not yet activated / assigned
 *  - 'new'      : account created, profiling not yet done
 */
const KEY = 'rodiall-app-state-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function initial() {
  const saved = load()
  const base = {
    scenario: 'active',
    reservation: null,
    theme: 'light',
    cards: DEFAULT_CARDS,
    notifications: seedNotifications('active'),
    purchasedStorage: 0,
    passwordModified: '45 days ago',
  }
  return saved ? { ...base, ...saved } : base
}

const AppCtx = createContext(null)
const ToastCtx = createContext(null)

export function AppStateProvider({ children }) {
  const [state, setState] = useState(initial)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const api = useMemo(() => {
    const set = (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
    return {
      set,
      setScenario: (scenario, reservation) =>
        set((s) => ({
          scenario,
          reservation:
            scenario === 'new' ? null : reservation || s.reservation || { ...DEFAULT_RESERVATION, createdAt: new Date().toISOString() },
          notifications: seedNotifications(scenario),
        })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      addNotification: (n) =>
        set((s) => ({ notifications: [{ id: `x${Date.now()}`, time: 'Just now', read: false, ...n }, ...s.notifications] })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      reset: () => {
        try {
          localStorage.removeItem(KEY)
        } catch {
          /* ignore */
        }
        setState({
          scenario: 'active',
          reservation: null,
          theme: 'light',
          cards: DEFAULT_CARDS,
          notifications: seedNotifications('active'),
          purchasedStorage: 0,
          passwordModified: '45 days ago',
        })
      },
    }
  }, [])

  const value = useMemo(() => ({ ...state, ...api, unread: state.notifications.filter((n) => !n.read).length }), [state, api])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = () => useContext(AppCtx)

// ---------- Toasts ----------
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (title, opts = {}) => {
      const id = ++idRef.current
      setToasts((t) => [...t, { id, title, type: opts.type || 'success', msg: opts.msg }])
      setTimeout(() => dismiss(id), opts.duration || 3200)
    },
    [dismiss],
  )
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toasts force-light-if-site" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="t-ic">
              {t.type === 'success' ? <CircleCheck size={14} /> : t.type === 'error' ? <CircleX size={14} /> : <Info size={14} />}
            </span>
            <div style={{ flex: 1 }}>
              <div className="t-title">{t.title}</div>
              {t.msg && <div className="t-msg">{t.msg}</div>}
            </div>
            <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)
