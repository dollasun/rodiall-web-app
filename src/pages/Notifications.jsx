import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Database, CreditCard, Wifi, HandCoins, ShieldCheck, Package, MessageSquareText, Sparkles, UserRound, Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react'
import { TopBar } from '../components/Layout'
import { EmptyState } from '../components/UI'
import { useApp } from '../state/AppState'
import { USER } from '../data/mock'

const ICONS = { clock: Clock, database: Database, card: CreditCard, wifi: Wifi, coins: HandCoins, shield: ShieldCheck, package: Package, message: MessageSquareText, sparkles: Sparkles, user: UserRound }

export function NotificationItem({ n, compact, onOpen, onDelete }) {
  const navigate = useNavigate()
  const Icon = ICONS[n.icon] || Bell
  return (
    <div
      className={`notif ${n.read ? '' : 'unread'} ${compact ? 'compact' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen?.()}
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
        {!compact && n.action === 'profiling' && (
          <button
            className="link-btn"
            style={{ marginTop: 8 }}
            onClick={(e) => {
              e.stopPropagation()
              onOpen?.()
              navigate('/get-started')
            }}
          >
            Complete profiling <ArrowRight size={12} />
          </button>
        )}
        <span className="notif-time">{n.time}</span>
      </div>
      {!n.read && <span className="notif-dot" aria-label="Unread" />}
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

export default function Notifications() {
  const { notifications, unread, markRead, markAllRead, removeNotification } = useApp()
  const [filter, setFilter] = useState('all')
  const list = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
  return (
    <>
      <TopBar title={`Hello ${USER.firstName}, Welcome!`} />
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
                <NotificationItem key={n.id} n={n} onOpen={() => markRead(n.id)} onDelete={() => removeNotification(n.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
