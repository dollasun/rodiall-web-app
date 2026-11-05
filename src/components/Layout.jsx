import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { ChartLine, ChartColumn, Tag, Database, Bell, Settings, Power, Menu, X, RotateCw, ChevronDown, LogOut, UserRound } from 'lucide-react'
import { MtnLogo } from './Brand'
import { Modal, Popover, useToggle } from './UI'
import { useApp } from '../state/AppState'
import { USER } from '../data/mock'
import { NotificationItem } from '../pages/Notifications'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartLine },
  { to: '/repay-plus', label: 'Repay+ Plus', icon: ChartColumn },
  { to: '/purchase-history', label: 'Purchase History', icon: Tag },
  { to: '/storage', label: 'Storage', icon: Database },
  { to: '/notifications', label: 'Notification', icon: Bell, dot: true },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={() => setLogoutOpen(true)} />
      <div className={`sidebar-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <main className="main">
        <Outlet context={{ openMenu: () => setMenuOpen(true), openLogout: () => setLogoutOpen(true) }} />
      </main>
      <BottomNav />
      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  )
}

function Sidebar({ open, onClose, onLogout }) {
  const { unread, scenario } = useApp()
  const sub = scenario === 'active' ? `Device id: ${USER.deviceId}` : scenario === 'reserved' ? 'Device: Reserved' : 'Device: Not assigned'
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-logo">
        <NavLink to="/dashboard" aria-label="Go to dashboard">
          <MtnLogo />
        </NavLink>
      </div>
      <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">
        <X size={18} />
      </button>
      <nav className="sidebar-nav">
        {NAV.map(({ to, label, icon: Icon, dot }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">
              <Icon size={17} strokeWidth={1.7} />
              {dot && unread > 0 && <span className="nav-dot" />}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-user">
        <span className="avatar-sq">{USER.initials}</span>
        <div style={{ minWidth: 0 }}>
          <div className="sidebar-user-name">{USER.fullName}</div>
          <div className="sidebar-user-sub">{sub}</div>
        </div>
      </div>
      <button className="nav-item sidebar-logout" onClick={onLogout} style={{ width: 'calc(100% - 44px)' }}>
        <Power size={16} strokeWidth={1.7} />
        Logout
      </button>
    </aside>
  )
}

/** Native-style bottom tab bar (phones only, via CSS) */
const TABS = [
  { to: '/dashboard', label: 'Home', icon: ChartLine },
  { to: '/repay-plus', label: 'Repay+', icon: ChartColumn },
  { to: '/purchase-history', label: 'History', icon: Tag },
  { to: '/storage', label: 'Storage', icon: Database },
  { to: '/settings', label: 'Settings', icon: Settings },
]
function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
          <span className="bn-icon">
            <Icon size={20} strokeWidth={1.8} />
          </span>
          <span className="bn-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/**
 * Variant A: title + "Last Login" (Dashboard, Purchase History, Settings, Notifications)
 * Variant B: title + bell + profile (Repay+ Plus, Storage)
 * On phones every variant shows `mobileTitle` with bell + avatar, like a native app bar.
 */
export function TopBar({ title, mobileTitle, variant = 'login' }) {
  const { openMenu } = useOutletContext() || {}
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn topbar-menu" onClick={openMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="topbar-logo">
          <MtnLogo width={46} />
        </span>
        <h1 className="topbar-title">
          <span className="t-desk">{title}</span>
          <span className="t-mob">{mobileTitle || title}</span>
        </h1>
      </div>
      {variant === 'login' ? (
        <>
          <LastLogin />
          <div className="mob-only">
            <ProfileCluster />
          </div>
        </>
      ) : (
        <ProfileCluster />
      )}
    </header>
  )
}

function LastLogin() {
  return (
    <div className="last-login desk-only">
      <span className="ll-icon">
        <RotateCw size={10} strokeWidth={2.4} />
      </span>
      <span className="ll-text">Last Login : {USER.lastLogin}</span>
    </div>
  )
}

/** Variant B: bell + profile chip (Repay+ Plus, Storage) */
function ProfileCluster() {
  const { unread, notifications, markRead, markAllRead } = useApp()
  const { openLogout } = useOutletContext() || {}
  const navigate = useNavigate()
  const bellRef = useRef(null)
  const profRef = useRef(null)
  const [bellOpen, toggleBell, closeBell] = useToggle()
  const [profOpen, toggleProf, closeProf] = useToggle()
  return (
    <div className="topbar-right">
      <button ref={bellRef} className="bell-btn" onClick={toggleBell} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
        <Bell size={14} />
        {unread > 0 && <span className="nav-dot" />}
      </button>
      <Popover anchorRef={bellRef} open={bellOpen} onClose={closeBell} className="notif-pop">
        <div className="notif-pop-head">
          <strong style={{ fontSize: 13 }}>Notifications</strong>
          {unread > 0 && (
            <button className="link-btn" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div className="notif-pop-list">
          {notifications.slice(0, 4).map((n) => (
            <NotificationItem key={n.id} n={n} compact onOpen={() => markRead(n.id)} />
          ))}
          {notifications.length === 0 && <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>You're all caught up</div>}
        </div>
        <div className="notif-pop-foot">
          <button
            className="btn btn-outline btn-sm btn-block"
            onClick={() => {
              closeBell()
              navigate('/notifications')
            }}
          >
            View all notifications
          </button>
        </div>
      </Popover>
      <button ref={profRef} className="profile-chip" onClick={toggleProf} aria-haspopup="menu" aria-expanded={profOpen}>
        <span className="avatar-round">{USER.initials}</span>
        <span className="profile-meta">
          <span className="profile-name" style={{ display: 'block' }}>{USER.firstName}</span>
          <span className="profile-role">Customer</span>
        </span>
        <ChevronDown size={16} style={{ marginLeft: 18, color: 'var(--text-2)' }} />
      </button>
      <Popover anchorRef={profRef} open={profOpen} onClose={closeProf}>
        <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{USER.fullName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Device id: {USER.deviceId}</div>
        </div>
        <button className="menu-item" onClick={() => { closeProf(); navigate('/settings') }}>
          <UserRound size={14} /> Account settings
        </button>
        <button className="menu-item" onClick={() => { closeProf(); navigate('/notifications') }}>
          <Bell size={14} /> Notifications
        </button>
        <div className="menu-sep" />
        <button className="menu-item danger" onClick={() => { closeProf(); openLogout?.() }}>
          <LogOut size={14} /> Logout
        </button>
      </Popover>
    </div>
  )
}

function LogoutModal({ open, onClose }) {
  const navigate = useNavigate()
  return (
    <Modal open={open} onClose={onClose} width={380}>
      <div style={{ padding: '28px 26px 24px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
          <Power size={22} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Log out of your account?</h3>
        <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 6 }}>You'll need to sign in again to access your dashboard.</p>
        <div className="modal-actions" style={{ marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose()
              navigate('/logged-out')
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  )
}
