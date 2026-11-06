import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalHeader, SuccessBadge } from './UI'
import { useApp } from '../state/AppState'
import { USER } from '../data/mock'

function CardGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="1" width="9" height="14" rx="1.5" fill="#3b82f6" />
      <rect x="5" y="4" width="9" height="2.5" rx="1" fill="#93c5fd" />
      <rect x="5" y="8" width="7" height="2" rx="1" fill="#bfdbfe" />
    </svg>
  )
}
function MomoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#004f71" />
      <rect x="4" y="4" width="8" height="8" rx="2" fill="#f7ce46" />
    </svg>
  )
}

/**
 * Generic purchase / subscription flow:
 * form (details + optional custom content + payment method) -> processing -> success
 */
export function CheckoutModal({
  open,
  onClose,
  title = 'New Subscription Package',
  detailsLabel = 'Subscription Details',
  details = [],
  children,
  canContinue = true,
  continueLabel = 'Continue',
  onComplete,
  successTitle = 'Success!',
  successText = 'Your subscription has been activated.',
  successCta = 'Go to Dashboard',
  onSuccessCta,
  showPayment = true,
}) {
  const navigate = useNavigate()
  const { cards } = useApp()
  const [method, setMethod] = useState('card')
  const [stage, setStage] = useState('form')
  const hid = useId()
  const defaultCard = cards.find((c) => c.isDefault) || cards[0]

  useEffect(() => {
    if (open) {
      setStage('form')
      setMethod('card')
    }
  }, [open])

  const submit = () => {
    setStage('processing')
    setTimeout(() => {
      onComplete?.(method)
      setStage('success')
    }, method === 'momo' ? 1800 : 1200)
  }

  if (!open) return null

  if (stage === 'success') {
    return (
      <Modal open onClose={onClose} className="success-modal" width={420}>
        <SuccessBadge />
        <h3>{successTitle}</h3>
        <p>{successText}</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            onClose()
            if (onSuccessCta) onSuccessCta()
            else navigate('/dashboard')
          }}
        >
          {successCta}
        </button>
      </Modal>
    )
  }

  const busy = stage === 'processing'
  return (
    <Modal open onClose={busy ? undefined : onClose} width={460} labelledBy={hid} dismissable={!busy}>
      <ModalHeader title={title} onClose={busy ? undefined : onClose} id={hid} />
      <div className="modal-body">
        {details.length > 0 && (
          <div>
            <div className="modal-section-label">{detailsLabel}</div>
            <div className="detail-box">
              {details.map(([k, v]) => (
                <div className="detail-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {children}
        {showPayment && (
          <div>
            <div className="modal-section-label">Payment Method</div>
            <div className="pay-options" role="radiogroup" aria-label="Payment method">
              <button type="button" role="radio" aria-checked={method === 'card'} className={`pay-option ${method === 'card' ? 'selected' : ''}`} onClick={() => setMethod('card')} disabled={busy}>
                <CardGlyph />
                <span className="po-label">Card</span>
                <span className={`radio ${method === 'card' ? 'on' : ''}`} />
              </button>
              <button type="button" role="radio" aria-checked={method === 'momo'} className={`pay-option ${method === 'momo' ? 'selected' : ''}`} onClick={() => setMethod('momo')} disabled={busy}>
                <MomoGlyph />
                <span className="po-label">MoMo from MTN</span>
                <span className={`radio ${method === 'momo' ? 'on' : ''}`} />
              </button>
            </div>
            <p className="pay-hint">
              {method === 'card'
                ? defaultCard
                  ? `Your default card •••• ${defaultCard.last4} will be charged.`
                  : 'Add a card in Settings › My Cards to pay by card.'
                : `You will receive a MoMo prompt on ${USER.primaryPhone} to approve this payment.`}
            </p>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost btn-lg" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary btn-lg" onClick={submit} disabled={busy || !canContinue || (showPayment && method === 'card' && !defaultCard)}>
            {busy ? (
              <>
                <span className="spinner" /> {method === 'momo' ? 'Awaiting approval…' : 'Processing…'}
              </>
            ) : (
              continueLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function DetailsModal({ open, onClose, title, rows, footer }) {
  const hid = useId()
  return (
    <Modal open={open} onClose={onClose} width={440} labelledBy={hid}>
      <ModalHeader title={title} onClose={onClose} id={hid} />
      <div className="modal-body">
        <div className="detail-box">
          {rows.map(([k, v]) => (
            <div className="detail-row" key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>
        {footer}
      </div>
    </Modal>
  )
}
