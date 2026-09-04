import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { userService } from '../services/userService'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import { Modal, ConfirmDialog } from '../components/Modal'
import { TicketForm } from '../components/TicketForm'
import { LoadingBlock, ErrorBanner } from '../components/StateBlock'
import { Icon } from '../components/icons'
import { TICKET_STATUSES, TICKET_PRIORITIES, toLabel } from '../utils/constants'
import { formatDateTime } from '../utils/formatters'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [users, setUsers] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    setError('')
    ticketService
      .getById(id)
      .then(setTicket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  useEffect(() => {
    userService.getAll().then(setUsers).catch(() => {})
    userService.getAgents().then(setAgents).catch(() => {})
  }, [])

  async function quickUpdate(field, value) {
    setUpdating(true)
    try {
      const payload = {
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: field === 'priority' ? value : ticket.priority,
        status: field === 'status' ? value : ticket.status,
        requesterId: ticket.requesterId,
        assignedAgentId: ticket.assignedAgentId,
      }
      const updated = await ticketService.update(ticket.id, payload)
      setTicket(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  async function handleEditSubmit(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      const updated = await ticketService.update(ticket.id, payload)
      setTicket(updated)
      setEditOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await ticketService.remove(ticket.id)
      navigate('/tickets')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return <div className="page-content"><LoadingBlock label="Loading ticket…" /></div>
  if (error && !ticket) return <div className="page-content"><ErrorBanner message={error} /></div>
  if (!ticket) return null

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <Link to="/tickets" className="cell-muted" style={{ fontSize: 12.5 }}>&larr; Back to Tickets</Link>
          <h1 style={{ marginTop: 6 }}>{ticket.title}</h1>
          <p>Ticket #{ticket.id} · Opened {formatDateTime(ticket.createdAt)}</p>
        </div>
        <div className="row-actions">
          <button className="btn btn-secondary" onClick={() => { setFormError(''); setEditOpen(true) }}>
            <Icon.Edit width={14} height={14} /> Edit
          </button>
          <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
            <Icon.Trash width={14} height={14} /> Delete
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />

      <div className="detail-grid">
        <div className="card">
          <div className="card-header"><h2>Description</h2></div>
          <div className="card-body">
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{ticket.description}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Ticket Info</h2></div>
          <div className="card-body">
            <div className="detail-field">
              <div className="k">Status</div>
              <select
                className="pill-select"
                value={ticket.status}
                disabled={updating}
                onChange={(e) => quickUpdate('status', e.target.value)}
              >
                {TICKET_STATUSES.map((s) => <option key={s} value={s}>{toLabel(s)}</option>)}
              </select>
            </div>
            <div className="detail-field">
              <div className="k">Priority</div>
              <select
                className="pill-select"
                value={ticket.priority}
                disabled={updating}
                onChange={(e) => quickUpdate('priority', e.target.value)}
              >
                {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{toLabel(p)}</option>)}
              </select>
            </div>
            <div className="detail-field">
              <div className="k">Category</div>
              <div className="v">{toLabel(ticket.category)}</div>
            </div>
            <div className="detail-field">
              <div className="k">Requester</div>
              <div className="v">{ticket.requesterName}</div>
            </div>
            <div className="detail-field">
              <div className="k">Assigned Agent</div>
              <div className="v">{ticket.assignedAgentName || 'Unassigned'}</div>
            </div>
            <div className="detail-field">
              <div className="k">Last Updated</div>
              <div className="v">{formatDateTime(ticket.updatedAt)}</div>
            </div>
            {ticket.resolvedAt && (
              <div className="detail-field">
                <div className="k">Resolved</div>
                <div className="v">{formatDateTime(ticket.resolvedAt)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <StatusBadge status={ticket.status} /> <PriorityBadge priority={ticket.priority} />
      </div>

      {editOpen && (
        <Modal title={`Edit Ticket #${ticket.id}`} onClose={() => setEditOpen(false)} wide>
          <ErrorBanner message={formError} />
          <TicketForm
            initial={ticket}
            users={users}
            agents={agents}
            submitting={submitting}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditOpen(false)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Ticket"
          message={`Are you sure you want to delete "${ticket.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          busy={deleting}
        />
      )}
    </div>
  )
}
