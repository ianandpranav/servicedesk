export default function Settings() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>System information</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>About ServiceDesk</h2></div>
        <div className="card-body">
          <div className="detail-field">
            <div className="k">Application</div>
            <div className="v">ServiceDesk — IT Support Management System</div>
          </div>
          <div className="detail-field">
            <div className="k">Version</div>
            <div className="v">1.0.0</div>
          </div>
          <div className="detail-field">
            <div className="k">Backend</div>
            <div className="v">Java · Spring Boot · Spring Data JPA / Hibernate</div>
          </div>
          <div className="detail-field">
            <div className="k">Database</div>
            <div className="v">MySQL</div>
          </div>
          <div className="detail-field">
            <div className="k">Frontend</div>
            <div className="v">React.js · Vite · JavaScript · HTML5 · CSS3</div>
          </div>
        </div>
      </div>
    </div>
  )
}
