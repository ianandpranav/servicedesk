import { NavLink } from 'react-router-dom'
import { Icon } from './icons'

const links = [
  { to: '/', label: 'Dashboard', icon: Icon.Dashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Icon.Ticket },
  { to: '/users', label: 'Users', icon: Icon.Users },
  { to: '/reports', label: 'Reports', icon: Icon.Reports },
  { to: '/settings', label: 'Settings', icon: Icon.Settings },
]

export function Sidebar({ open, onNavigate }) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onNavigate} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">SD</div>
          <div>
            <div className="sidebar-brand-text">ServiceDesk</div>
            <div className="sidebar-brand-sub">IT Support</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: IconCmp, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <IconCmp className="sidebar-icon" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">ServiceDesk v1.0</div>
      </aside>
    </>
  )
}
