import { Icon } from './icons'
import { initials } from '../utils/formatters'

export function Topbar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Toggle navigation">
          <Icon.Menu width={20} height={20} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          <span>IT Administration</span>
        </div>
        <div className="topbar-avatar">{initials('IT Admin')}</div>
      </div>
    </header>
  )
}
