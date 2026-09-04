import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { userService } from '../services/userService'
import { ticketService } from '../services/ticketService'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import { Modal, ConfirmDialog } from '../components/Modal'
import { UserForm } from '../components/UserForm'
import { LoadingBlock, ErrorBanner, EmptyBlock } from '../components/StateBlock'
import { Icon } from '../components/icons'
import { toLabel } from '../utils/constants'
import { formatDate, initials } from '../utils/formatters'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    setError('')
    Promise.all([userService.getById(id), ticketService.getAll({})])
      .then(([u, allTickets]) => {
        setUser(u)
        setTickets(allTickets.filter((t) => t.requesterId === Number(id) || t.assignedAgentId === Number(id)))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  async function handleEditSubmit(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      const updated = await userService.update(user.id, payload)
      setUser(updated)
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
      await userService.remove(user.id)
      navigate('/users')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return <div className="page-content"><LoadingBlock label="Loading user…" /></div>
  if (error && !user) return <div className="page-content"><ErrorBanner message={error} /></div>
  if (!user) return null

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <Link to="/users" className="cell-muted" style={{ fontSize: 12.5 }}>&larr; Back to Users</Link>
          <h1 style={{ marginTop: 6 }}>{user.name}</h1>
          <p>{toLabel(user.role)} · {user.department || 'No department set'}</p>
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
          <div className="card-header"><h2>Related Tickets</h2></div>
          <div className="card-body" style={{ padding: 0 }}>
            {tickets.length === 0 ? (
              <div style={{ padding: 18 }}>
                <EmptyBlock icon={Icon.Ticket} title="No related tickets" message="This user has not raised or been assigned any tickets." />
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <Link to={`/tickets/${t.id}`} className="cell-title">{t.title}</Link>
                          <div className="cell-muted">#{t.id}</div>
                        </td>
                        <td className="cell-muted">
                          {t.requesterId === Number(id) ? 'Requester' : 'Agent'}
                        </td>
                        <td><StatusBadge status={t.status} /></td>
                        <td><PriorityBadge priority={t.priority} /></td>
                        <td className="cell-muted">{formatDate(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Profile</h2></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="topbar-avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{initials(user.name)}</div>
              <div>
                <div className="cell-title">{user.name}</div>
                <div className="cell-muted">{user.email}</div>
              </div>
            </div>
            <div className="detail-field">
              <div className="k">Phone</div>
              <div className="v">{user.phone || '—'}</div>
            </div>
            <div className="detail-field">
              <div className="k">Department</div>
              <div className="v">{user.department || '—'}</div>
            </div>
            <div className="detail-field">
              <div className="k">Role</div>
              <div className="v">{toLabel(user.role)}</div>
            </div>
            <div className="detail-field">
              <div className="k">Status</div>
              <div className="v">
                <span className={`badge ${user.status === 'ACTIVE' ? 'badge-resolved' : 'badge-closed'}`}>
                  <span className="badge-dot" />{toLabel(user.status)}
                </span>
              </div>
            </div>
            <div className="detail-field">
              <div className="k">Joined</div>
              <div className="v">{formatDate(user.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <Modal title={`Edit ${user.name}`} onClose={() => setEditOpen(false)}>
          <ErrorBanner message={formError} />
          <UserForm
            initial={user}
            submitting={submitting}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditOpen(false)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete "${user.name}"? Tickets referencing this user may be affected.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          busy={deleting}
        />
      )}
    </div>
  )
}
