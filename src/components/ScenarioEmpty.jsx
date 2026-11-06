import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, Clock, UserRoundPen, Receipt, Database, Ticket, CalendarClock, MapPin, ArrowRight } from 'lucide-react'
import { EmptyState, Steps } from './UI'
import { ReservationModal } from '../site/ReservationModal'
import { useApp } from '../state/AppState'
import { RODIALL_DEVICES, STORES, agentCallLabel, collectByLabel } from '../data/mock'

const COPY = {
  reserved: {
    dashboard: {
      title: 'No device assigned to you yet',
      text: (d) =>
        `Your ${d.device} has been reserved ${d.pickup ? `for pickup at ${d.store}` : 'for home delivery'}. Complete device activation to unlock your full dashboard.`,
      icon: <Smartphone size={30} strokeWidth={1.6} />,
    },
    history: {
      title: 'No purchase history yet',
      text: () => 'No device has been assigned to you yet. Your subscriptions and payments will appear here once your device is activated.',
      icon: <Receipt size={30} strokeWidth={1.6} />,
    },
    storage: {
      title: 'Storage is not available yet',
      text: () => 'No device has been assigned to you yet. Fractional storage becomes available as soon as your reserved device is activated.',
      icon: <Database size={30} strokeWidth={1.6} />,
    },
  },
  new: {
    dashboard: {
      title: 'Your dashboard is empty',
      text: () => 'Complete your profiling to see devices matched to how you use your phone, then reserve your device. It only takes two quick questions.',
      icon: <UserRoundPen size={30} strokeWidth={1.6} />,
    },
    history: {
      title: 'No purchase history yet',
      text: () => 'You haven’t made any purchases yet. Your subscriptions and payments will appear here.',
      icon: <Receipt size={30} strokeWidth={1.6} />,
    },
    storage: {
      title: 'Complete your profiling',
      text: () => 'Complete your profiling to see devices and reserve one. Fractional storage becomes available once your device is activated.',
      icon: <Database size={30} strokeWidth={1.6} />,
    },
  },
}

export function ScenarioEmpty({ area, compact }) {
  const { scenario, reservation } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const copy = COPY[scenario]?.[area]
  if (!copy) return null

  if (scenario === 'reserved') {
    const r = reservation
    const device = RODIALL_DEVICES.find((d) => d.id === r?.deviceId) || RODIALL_DEVICES[0]
    const store = STORES.find((s) => s.id === r?.storeId) || STORES[0]
    const pickup = r?.method !== 'delivery'
    return (
      <>
        <EmptyState
          compact={compact}
          icon={copy.icon}
          mini={<Clock size={14} />}
          title={copy.title}
          text={copy.text({ device: device.name, store: store.name, pickup })}
          action={
            <button className="btn btn-primary btn-lg" onClick={() => setOpen(true)}>
              Go for Device Activation <ArrowRight size={15} />
            </button>
          }
        >
          {area === 'dashboard' && (
            <>
              <div className="empty-meta">
                <span className="empty-chip">
                  <Ticket size={14} /> Reservation code <b>{r?.code}</b>
                </span>
                <span className="empty-chip">
                  {pickup ? <MapPin size={14} /> : <CalendarClock size={14} />}
                  {pickup ? 'Collect by' : 'Agent call by'} <b>{pickup ? collectByLabel(r?.createdAt) : agentCallLabel(r?.createdAt)}</b>
                </span>
              </div>
              <Steps steps={['Account created', 'Profiling', 'Device reserved', 'Activation']} current={3} />
            </>
          )}
        </EmptyState>
        <ReservationModal open={open} reservation={r} onClose={() => setOpen(false)} onDone={() => setOpen(false)} />
      </>
    )
  }

  // new user (profiling not completed)
  const showCta = area !== 'history'
  return (
    <EmptyState
      compact={compact}
      icon={copy.icon}
      title={copy.title}
      text={copy.text()}
      action={
        showCta ? (
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/get-started')}>
            Complete Profiling <ArrowRight size={15} />
          </button>
        ) : null
      }
    >
      {area === 'dashboard' && <Steps steps={['Account created', 'Profiling', 'Reserve device', 'Activation']} current={1} />}
    </EmptyState>
  )
}
