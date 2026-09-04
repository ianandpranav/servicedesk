import { useEffect, useState } from 'react'
import { USER_ROLES, USER_STATUSES, toLabel } from '../utils/constants'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  department: '',
  role: 'EMPLOYEE',
  status: 'ACTIVE',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function UserForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        email: initial.email || '',
        phone: initial.phone || '',
        department: initial.department || '',
        role: initial.role || 'EMPLOYEE',
        status: initial.status || 'ACTIVE',
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
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      role: form.role,
      status: form.status,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className={`form-field${errors.name ? ' error' : ''}`}>
          <label htmlFor="name">Full Name</label>
          <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className={`form-field${errors.email ? ' error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="department">Department</label>
          <input id="department" value={form.department} onChange={(e) => update('department', e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="role">Role</label>
          <select id="role" value={form.role} onChange={(e) => update('role', e.target.value)}>
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>{toLabel(r)}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)}>
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>{toLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  )
}
