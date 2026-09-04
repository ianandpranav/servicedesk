import { useEffect, useState } from 'react'
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES, toLabel } from '../utils/constants'

const emptyForm = {
  title: '',
  description: '',
  category: 'SOFTWARE',
  priority: 'MEDIUM',
  status: 'OPEN',
  requesterId: '',
  assignedAgentId: '',
}

export function TicketForm({ initial, users, agents, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        category: initial.category || 'SOFTWARE',
        priority: initial.priority || 'MEDIUM',
        status: initial.status || 'OPEN',
        requesterId: initial.requesterId ? String(initial.requesterId) : '',
        assignedAgentId: initial.assignedAgentId ? String(initial.assignedAgentId) : '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [initial])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.description.trim()) next.description = 'Description is required'
    if (!form.requesterId) next.requesterId = 'Requester is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      status: form.status,
      requesterId: Number(form.requesterId),
      assignedAgentId: form.assignedAgentId ? Number(form.assignedAgentId) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className={`form-field full${errors.title ? ' error' : ''}`}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Short summary of the issue"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className={`form-field full${errors.description ? ' error' : ''}`}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the issue in detail"
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {TICKET_CATEGORIES.map((c) => (
              <option key={c} value={c}>{toLabel(c)}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            {TICKET_PRIORITIES.map((p) => (
              <option key={p} value={p}>{toLabel(p)}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)}>
            {TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>{toLabel(s)}</option>
            ))}
          </select>
        </div>

        <div className={`form-field${errors.requesterId ? ' error' : ''}`}>
          <label htmlFor="requester">Requester</label>
          <select id="requester" value={form.requesterId} onChange={(e) => update('requesterId', e.target.value)}>
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          {errors.requesterId && <span className="field-error">{errors.requesterId}</span>}
        </div>

        <div className="form-field full">
          <label htmlFor="agent">Assigned Support Agent</label>
          <select id="agent" value={form.assignedAgentId} onChange={(e) => update('assignedAgentId', e.target.value)}>
            <option value="">Unassigned</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Create Ticket'}
        </button>
      </div>
    </form>
  )
}
