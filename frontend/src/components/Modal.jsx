import { Icon } from './icons'

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel" style={wide ? { maxWidth: 760 } : undefined}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <Icon.X width={18} height={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy = false }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal-panel confirm-panel">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close">
            <Icon.X width={18} height={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="confirm-text">{message}</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
              {busy ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
