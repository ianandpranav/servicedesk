import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/userService'
import { Modal, ConfirmDialog } from '../components/Modal'
import { UserForm } from '../components/UserForm'
import { LoadingBlock, EmptyBlock, ErrorBanner } from '../components/StateBlock'
import { Icon } from '../components/icons'
import { toLabel } from '../utils/constants'
import { initials } from '../utils/formatters'
import { useDebounce } from '../hooks/useDebounce'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadUsers = useCallback(() => {
    setLoading(true)
    setError('')
    userService
      .getAll(debouncedSearch)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [debouncedSearch])

  useEffect(() => { loadUsers() }, [loadUsers])

  function openCreate() {
    setEditing(null)
    setFormError('')
    setFormOpen(true)
  }

  function openEdit(user) {
    setEditing(user)
    setFormError('')
    setFormOpen(true)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      if (editing) {
        await userService.update(editing.id, payload)
      } else {
        await userService.create(payload)
      }
      setFormOpen(false)
      loadUsers()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await userService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadUsers()
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
          <h1>Users</h1>
          <p>Manage employees, support agents, and administrators</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Icon.Plus width={15} height={15} /> New User
        </button>
      </div>

      <ErrorBanner message={error} />

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Icon.Search />
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <LoadingBlock label="Loading users…" />
        ) : users.length === 0 ? (
          <EmptyBlock icon={Icon.Users} title="No users found" message="Try a different search, or add a new user." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="topbar-avatar">{initials(u.name)}</div>
                        <div>
                          <Link to={`/users/${u.id}`} className="cell-title">{u.name}</Link>
                          <div className="cell-muted">#{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-muted">{u.email}</td>
                    <td className="cell-muted">{u.department || '—'}</td>
                    <td>{toLabel(u.role)}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-resolved' : 'badge-closed'}`}>
                        <span className="badge-dot" />{toLabel(u.status)}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/users/${u.id}`} className="icon-btn" aria-label="View">
                          <Icon.Eye width={14} height={14} />
                        </Link>
                        <button className="icon-btn" aria-label="Edit" onClick={() => openEdit(u)}>
                          <Icon.Edit width={14} height={14} />
                        </button>
                        <button className="icon-btn danger" aria-label="Delete" onClick={() => setDeleteTarget(u)}>
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
        <Modal title={editing ? `Edit ${editing.name}` : 'New User'} onClose={() => setFormOpen(false)}>
          <ErrorBanner message={formError} />
          <UserForm
            initial={editing}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete "${deleteTarget.name}"? Tickets referencing this user may be affected.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={deleting}
        />
      )}
    </div>
  )
}
