import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import { LoadingBlock, ErrorBanner, EmptyBlock } from '../components/StateBlock'
import { toLabel } from '../utils/constants'
import { formatDateTime } from '../utils/formatters'

function BarList({ data }) {
  const entries = Object.entries(data || {})
  if (entries.length === 0) {
    return <p className="cell-muted">No data yet.</p>
  }
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="bar-list">
      {entries.map(([key, value]) => (
        <div className="bar-row" key={key}>
          <span className="bar-label">{toLabel(key)}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(value / max) * 100}%` }} />
          </div>
          <span className="bar-value">{value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    dashboardService
      .getStats()
      .then((data) => { if (active) setStats(data) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Live overview of support ticket activity</p>
        </div>
        <Link to="/tickets" className="btn btn-primary">View All Tickets</Link>
      </div>

      <ErrorBanner message={error} />

      {loading && <LoadingBlock label="Loading dashboard…" />}

      {!loading && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card accent-total">
              <div className="stat-label">Total Tickets</div>
              <div className="stat-value">{stats.totalTickets}</div>
            </div>
            <div className="stat-card accent-open">
              <div className="stat-label">Open</div>
              <div className="stat-value">{stats.openTickets}</div>
            </div>
            <div className="stat-card accent-progress">
              <div className="stat-label">In Progress</div>
              <div className="stat-value">{stats.inProgressTickets}</div>
            </div>
            <div className="stat-card accent-pending">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pendingTickets}</div>
            </div>
            <div className="stat-card accent-resolved">
              <div className="stat-label">Resolved</div>
              <div className="stat-value">{stats.resolvedTickets}</div>
            </div>
            <div className="stat-card accent-closed">
              <div className="stat-label">Closed</div>
              <div className="stat-value">{stats.closedTickets}</div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header"><h2>Recent Tickets</h2></div>
              <div className="card-body" style={{ padding: 0 }}>
                {stats.recentTickets.length === 0 ? (
                  <div style={{ padding: 18 }}><EmptyBlock title="No tickets yet" message="Tickets will show up here as they're created." /></div>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Ticket</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentTickets.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <Link to={`/tickets/${t.id}`} className="cell-title">{t.title}</Link>
                              <div className="cell-muted">#{t.id} · {t.requesterName}</div>
                            </td>
                            <td><StatusBadge status={t.status} /></td>
                            <td><PriorityBadge priority={t.priority} /></td>
                            <td className="cell-muted">{formatDateTime(t.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Tickets by Status</h2></div>
              <div className="card-body"><BarList data={stats.ticketsByStatus} /></div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Tickets by Priority</h2></div>
              <div className="card-body"><BarList data={stats.ticketsByPriority} /></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Tickets by Category</h2></div>
            <div className="card-body"><BarList data={stats.ticketsByCategory} /></div>
          </div>
        </>
      )}
    </div>
  )
}
