export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']

export const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const TICKET_CATEGORIES = [
  'HARDWARE',
  'SOFTWARE',
  'NETWORK',
  'ACCOUNT_ACCESS',
  'EMAIL',
  'PRINTER',
  'SECURITY',
  'OTHER',
]

export const USER_ROLES = ['ADMIN', 'SUPPORT_AGENT', 'EMPLOYEE']

export const USER_STATUSES = ['ACTIVE', 'INACTIVE']

export function toLabel(value) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
