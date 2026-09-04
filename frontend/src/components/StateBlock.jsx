import { Icon } from './icons'

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="state-block">
      <div className="spinner" />
      <p style={{ marginTop: 10 }}>{label}</p>
    </div>
  )
}

export function EmptyBlock({ title = 'Nothing here yet', message, icon: IconCmp = Icon.Inbox }) {
  return (
    <div className="state-block">
      <IconCmp width={30} height={30} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return <div className="banner-error">{message}</div>
}
