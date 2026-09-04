import { toLabel } from '../utils/constants'

export function StatusBadge({ status }) {
  if (!status) return null
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      <span className="badge-dot" />
      {toLabel(status)}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  if (!priority) return null
  return (
    <span className={`badge badge-${priority.toLowerCase()}`}>
      {toLabel(priority)}
    </span>
  )
}
