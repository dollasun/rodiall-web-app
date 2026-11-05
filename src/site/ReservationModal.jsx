import { MessageCircle, Smartphone, UserCheck, CreditCard } from 'lucide-react'
import { Modal, SuccessBadge } from '../components/UI'
import { RODIALL_DEVICES, STORES, USER, agentCallLabel, collectByLabel, ugx } from '../data/mock'

/** "You're All Set!" (pickup) / "Delivery Requested!" (home delivery) */
export function ReservationModal({ open, onClose, reservation, onDone }) {
  if (!open || !reservation) return null
  const device = RODIALL_DEVICES.find((d) => d.id === reservation.deviceId) || RODIALL_DEVICES[0]
  const store = STORES.find((s) => s.id === reservation.storeId) || STORES[0]
  const pickup = reservation.method === 'pickup'
  const price = ugx(device.price)

  const tiles = pickup
    ? [
        ['Reservation code', reservation.code],
        ['Pickup store', store.name],
        ['Collect by', collectByLabel(reservation.createdAt)],
        ['Opening hours', store.hours.replace('09AM', '9AM').replace('06PM', '6PM')],
        ['Pickup Address', store.address.replace(/\.$/, '').replace('Nakawa Division', 'Nakawa, Division')],
        ['Amount payable at the store', price],
      ]
    : [
        ['Reservation code', reservation.code],
        ['Device', device.name],
        ['Deliver to', reservation.address],
        ['Agent call by', agentCallLabel(reservation.createdAt)],
        ['Agent calls', USER.phone],
        ['Pay on delivery', price],
      ]

  const directions = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, '_blank', 'noopener')
  }

  return (
    <Modal open onClose={onClose} className="rd-modal rd-success force-light" width={480}>
      <div className="rds-head">
        <SuccessBadge size={88} confetti />
        <h2>{pickup ? 'You’re All Set!' : 'Delivery Requested!'}</h2>
        {pickup ? (
          <p>
            Your {device.name} is reserved. Pick it up at
            <br />
            the store below.
          </p>
        ) : (
          <>
            <p>Your {device.name} is reserved for home delivery.</p>
            <p>
              An activation agent will reach out within 24 hours. They’ll call {USER.phone} to schedule delivery and activation at your
              home.
            </p>
          </>
        )}
      </div>
      <div className="rds-sms">
        <MessageCircle size={12} />
        SMS sent to {USER.phone} with your {pickup ? 'store location and activation details' : 'delivery request details'}
      </div>
      <div className="rds-grid">
        {tiles.map(([k, v]) => (
          <div className="rds-tile" key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <div className="rds-bring">
        <h4>{pickup ? 'What to bring to store' : 'What to have ready'}</h4>
        <ul>
          <li>
            <Smartphone size={12} /> This phone ({USER.phone}) to receive activation code
          </li>
          <li>
            <UserCheck size={12} /> Valid government-issued ID
          </li>
          <li>
            <CreditCard size={12} /> {price} by cash, card or bank transfer
          </li>
        </ul>
      </div>
      <div className="rds-divider" />
      <div className={`rds-actions ${pickup ? '' : 'single'}`}>
        {pickup && (
          <button className="rd-btn rd-btn-outline" onClick={directions}>
            Get Directions
          </button>
        )}
        <button className="rd-btn rd-btn-primary" onClick={onDone || onClose}>
          Done
        </button>
      </div>
    </Modal>
  )
}
