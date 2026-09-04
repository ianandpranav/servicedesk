import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const TITLES = {
  '/': 'Dashboard',
  '/tickets': 'Tickets',
  '/users': 'Users',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function pageTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/tickets/')) return 'Ticket Details'
  if (pathname.startsWith('/users/')) return 'User Details'
  return 'ServiceDesk'
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="main-area">
        <Topbar title={pageTitle(location.pathname)} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}
