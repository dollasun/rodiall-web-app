import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, Database, CreditCard, Wifi, HandCoins, ShieldCheck, Package, MessageSquareText, ClipboardCheck, ClipboardList, UserRound, Bell,
  CheckCheck, Trash2, ArrowRight, PartyPopper, CalendarClock, X,
} from 'lucide-react'
import { TopBar } from '../components/Layout'
import { EmptyState, Modal } from '../components/UI'
import { useApp, useToast } from '../state/AppState'
import { USER, fullDateTime, relativeTime } from '../data/mock'

const ICONS = {
  clock: Clock, database: Database, card: CreditCard, wifi: Wifi, coins: HandCoins, shield: ShieldCheck,
  package: Package, message: MessageSquareText, 'clipboard-check': ClipboardCheck, 'clipboard-list': ClipboardList, user: UserRound, party: PartyPopper,
}

export function NotificationItem({ n, compact, onOpen, onDelete }) {
  const Icon = ICONS[n.icon] || Bell
  return (
    <div
      className={`notif ${n.read ? '' : 'unread'} ${compact ? 'compact' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${n.title}${n.read ? '' : ', unread'}`}
      onClick={() => onOpen?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.()
        }
      }}
    >
      <span className={`notif-ic tone-${n.tone}`}>
        <Icon size={compact ? 14 : 16} />
      </span>
      <div className="notif-body">
        <div className="notif-title">
          {n.title}
          {!compact && n.cat && <span className="notif-cat">{n.cat}</span>}
        </div>
        <p className="notif-text">{n.body}</p>
        <span className="notif-time">{relativeTime(n.at)}</span>
      </div>
      {!n.read && <span className="notif-dot" aria-hidden="true" />}
      {onDelete && (
        <button
          className="icon-btn notif-del"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Delete notification"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

/** Detail view for a single notification. On phones it opens as a bottom sheet. */
export function NotificationModal({ n, onClose }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { removeNotification } = useApp()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const hid = useId()

  useEffect(() => {
    setConfirmDelete(false)
  }, [n?.id])

  if (!n) return null
  const Icon = ICONS[n.icon] || Bell
  const celebrate = n.tone === 'celebrate'

  const del = () => {
    if (!confirmDelete) return setConfirmDelete(true)
    removeNotification(n.id)
    onClose()
    toast('Notification deleted')
  }

  return (
    <Modal open onClose={onClose} className={`nm nm-${n.tone}`} width={500} labelledBy={hid}>
      <div className="nm-hero">
        {celebrate && (
          <div className="nm-confetti" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <i key={i} style={{ '--i': i }} />
            ))}
          </div>
        )}
        <span className="nm-badge">
          <Icon size={22} strokeWidth={1.9} />
        </span>
        <button className="nm-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="nm-body">
        <div className="nm-meta">
          {n.cat && <span className="nm-chip">{n.cat}</span>}
          <span className="nm-ago">{relativeTime(n.at)}</span>
        </div>
        <h3 className="nm-title" id={hid}>{n.title}</h3>
        <p className="nm-date">
          <CalendarClock size={13} /> {fullDateTime(n.at)}
        </p>
        <p className="nm-text">{n.body}</p>
      </div>

      <div className="nm-foot">
        <button className={`nm-delete ${confirmDelete ? 'armed' : ''}`} onClick={del} onBlur={() => setConfirmDelete(false)}>
          <Trash2 size={15} />
          {confirmDelete ? 'Tap again to delete' : 'Delete'}
        </button>
        <div className="nm-actions">
          {n.action ? (
            <>
              <button className="btn btn-outline btn-lg nm-secondary" onClick={onClose}>
                Close
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  onClose()
                  navigate(n.action.to)
                }}
              >
                {n.action.label} <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={onClose} style={{ minWidth: 120 }}>
              Got it
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default function Notifications() {
  const { notifications, unread, markRead, markAllRead, removeNotification } = useApp()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const list = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
  const open = notifications.find((n) => n.id === openId)

  return (
    <>
      <TopBar title={`Hello ${USER.firstName}, Welcome!`} mobileTitle="Notifications" />
      <div className="page">
        <h2 className="page-title">Notifications</h2>
        <div className="tabs-bar">
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All ({notifications.length})
          </button>
          <button className={`tab-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Unread ({unread})
          </button>
          <span className="spacer" />
          <button className="btn btn-outline btn-sm" onClick={markAllRead} disabled={!unread}>
            <CheckCheck size={14} /> Mark all as read
          </button>
        </div>
        <section className="card" style={{ padding: 8 }}>
          {list.length === 0 ? (
            <EmptyState
              compact
              icon={<Bell size={30} strokeWidth={1.6} />}
              title={filter === 'unread' ? 'You’re all caught up' : 'No notifications yet'}
              text={filter === 'unread' ? 'You have no unread notifications.' : 'Updates about your device, payments and plans will appear here.'}
            />
          ) : (
            <div className="notif-list">
              {list.map((n) => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  onOpen={() => {
                    markRead(n.id)
                    setOpenId(n.id)
                  }}
                  onDelete={() => {
                    removeNotification(n.id)
                    toast('Notification deleted')
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <NotificationModal n={open} onClose={() => setOpenId(null)} />
    </>
  )
}
