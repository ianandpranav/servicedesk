import { useEffect, useState } from 'react'
import { reportService } from '../services/reportService'
import { LoadingBlock, ErrorBanner } from '../components/StateBlock'
import { Icon } from '../components/icons'
import { toLabel } from '../utils/constants'

function ReportTable({ title, data }) {
  const entries = Object.entries(data || {})
  return (
    <div className="card">
      <div className="card-header"><h2>{title}</h2></div>
      <div className="card-body" style={{ padding: 0 }}>
        {entries.length === 0 ? (
          <p className="cell-muted" style={{ padding: 18 }}>No data yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <tbody>
                {entries.map(([key, value]) => (
                  <tr key={key}>
                    <td className="cell-title">{toLabel(key)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Reports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    reportService
      .getReport()
      .then((data) => { if (active) setReport(data) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Aggregated ticket data pulled directly from the database</p>
        </div>
        <a className="btn btn-secondary" href={reportService.exportCsvUrl()}>
          <Icon.Download width={15} height={15} /> Export CSV
        </a>
      </div>

      <ErrorBanner message={error} />

      {loading && <LoadingBlock label="Building report…" />}

      {!loading && report && (
        <>
          <div className="stats-grid">
            <div className="stat-card accent-total">
              <div className="stat-label">Total Tickets</div>
              <div className="stat-value">{report.totalTickets}</div>
            </div>
          </div>

          <div className="dashboard-grid">
            <ReportTable title="Tickets by Status" data={report.ticketsByStatus} />
            <ReportTable title="Tickets by Priority" data={report.ticketsByPriority} />
            <ReportTable title="Tickets by Category" data={report.ticketsByCategory} />
          </div>

          <ReportTable title="Tickets by Support Agent" data={report.ticketsByAgent} />
        </>
      )}
    </div>
  )
}
