import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { userService } from '../services/userService'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import { Modal, ConfirmDialog } from '../components/Modal'
import { TicketForm } from '../components/TicketForm'
import { LoadingBlock, EmptyBlock, ErrorBanner } from '../components/StateBlock'
import { Icon } from '../components/icons'
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES, toLabel } from '../utils/constants'
import { formatDate } from '../utils/formatters'
import { useDebounce } from '../hooks/useDebounce'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [agentId, setAgentId] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadTickets = useCallback(() => {
    setLoading(true)
    setError('')
    ticketService
      .getAll({ search: debouncedSearch, status, priority, category, agentId })
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [debouncedSearch, status, priority, category, agentId])

  useEffect(() => { loadTickets() }, [loadTickets])

  useEffect(() => {
    userService.getAll().then(setUsers).catch(() => {})
    userService.getAgents().then(setAgents).catch(() => {})
  }, [])

  function openCreate() {
    setEditing(null)
    setFormError('')
    setFormOpen(true)
  }

  function openEdit(ticket) {
    setEditing(ticket)
    setFormError('')
    setFormOpen(true)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      if (editing) {
        await ticketService.update(editing.id, payload)
      } else {
        await ticketService.create(payload)
      }
      setFormOpen(false)
      loadTickets()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await ticketService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadTickets()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p>Manage IT support tickets across the organization</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Icon.Plus width={15} height={15} /> New Ticket
        </button>
      </div>

      <ErrorBanner message={error} />

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Icon.Search />
          <input
            placeholder="Search by title, description, or requester…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {TICKET_STATUSES.map((s) => <option key={s} value={s}>{toLabel(s)}</option>)}
        </select>
        <select className="select-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{toLabel(p)}</option>)}
        </select>
        <select className="select-field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {TICKET_CATEGORIES.map((c) => <option key={c} value={c}>{toLabel(c)}</option>)}
        </select>
        <select className="select-field" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
          <option value="">All Agents</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <LoadingBlock label="Loading tickets…" />
        ) : tickets.length === 0 ? (
          <EmptyBlock
            icon={Icon.Ticket}
            title="No tickets found"
            message="Try adjusting your search or filters, or create a new ticket."
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Requester</th>
                  <th>Agent</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/tickets/${t.id}`} className="cell-title">{t.title}</Link>
                      <div className="cell-muted">#{t.id}</div>
                    </td>
                    <td>{t.requesterName}</td>
                    <td className="cell-muted">{t.assignedAgentName || 'Unassigned'}</td>
                    <td className="cell-muted">{toLabel(t.category)}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td className="cell-muted">{formatDate(t.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/tickets/${t.id}`} className="icon-btn" aria-label="View">
                          <Icon.Eye width={14} height={14} />
                        </Link>
                        <button className="icon-btn" aria-label="Edit" onClick={() => openEdit(t)}>
                          <Icon.Edit width={14} height={14} />
                        </button>
                        <button className="icon-btn danger" aria-label="Delete" onClick={() => setDeleteTarget(t)}>
                          <Icon.Trash width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? `Edit Ticket #${editing.id}` : 'New Ticket'} onClose={() => setFormOpen(false)} wide>
          <ErrorBanner message={formError} />
          <TicketForm
            initial={editing}
            users={users}
            agents={agents}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Ticket"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={deleting}
        />
      )}
    </div>
  )
}
