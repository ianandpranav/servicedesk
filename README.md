# ServiceDesk — IT Support Management System

A full-stack IT helpdesk application.

- **Backend:** Java, Spring Boot, REST API, Spring Data JPA / Hibernate
- **Database:** MySQL
- **Frontend:** React.js (Vite), JavaScript, HTML5, CSS3

## Features

- Ticket management (create, view, update, delete) with title, description, category,
  priority, status, requester, assigned agent, created/updated/resolved timestamps
- User management (create, view, update, delete) with name, email, phone, department, role, status
- Ticket status tracking: Open, In Progress, Pending, Resolved, Closed
- Ticket priority tracking: Low, Medium, High, Critical
- Search (title, description, requester) and filtering (status, priority, category, agent, date range)
- Dashboard with live statistics and breakdowns calculated from the database (nothing hard-coded)
- Reports section with tickets-by-status/priority/category/agent, plus CSV export
- Validation and error handling on both the backend (Bean Validation) and frontend
- Responsive layout (desktop, tablet, mobile)

## Project Structure

```
servicedesk/
  backend/    Spring Boot REST API (Maven project)
  frontend/   React + Vite single-page app
```

Backend package layout: `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`.
Frontend layout: `components`, `pages`, `services`, `hooks`, `utils`.

## Prerequisites

- JDK 17+
- Maven 3.9+ (or use an IDE like IntelliJ that bundles it)
- MySQL 8+ running locally
- Node.js 18+ and npm

## 1. Database setup

Create the database (or let it auto-create — see below):

```sql
CREATE DATABASE servicedesk_db;
```

The backend uses `createDatabaseIfNotExist=true`, so a manual `CREATE DATABASE` isn't
strictly required if the MySQL user has permission to create databases.

Edit `backend/src/main/resources/application.properties` if your MySQL
username/password differ from the defaults (`root` / `root`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/servicedesk_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run, Hibernate creates the
`users` and `tickets` tables (`ddl-auto=update`), and `data.sql` seeds a small set of
demo users and tickets (it only inserts rows that don't already exist, so it's safe to
restart repeatedly).

Key endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/api/tickets` | List (with `search`, `status`, `priority`, `category`, `agentId`, `from`, `to` query params) / create tickets |
| GET/PUT/DELETE | `/api/tickets/{id}` | Get, update, delete a ticket |
| GET/POST | `/api/users` | List (with `search`) / create users |
| GET/PUT/DELETE | `/api/users/{id}` | Get, update, delete a user |
| GET | `/api/users/agents` | List users with the `SUPPORT_AGENT` role |
| GET | `/api/dashboard/stats` | Aggregated dashboard statistics |
| GET | `/api/reports` | Aggregated report data |
| GET | `/api/reports/export` | Download the report as CSV |

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173**. Vite's dev server proxies any request to
`/api/*` to `http://localhost:8080`, so the two run independently — no CORS
configuration needed beyond what's already set up in `WebConfig.java`.

## 4. Build for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, which can be served by any static host
or copied into the Spring Boot app's `src/main/resources/static` folder for a
single-deployable jar.

```bash
cd backend
mvn clean package
java -jar target/servicedesk-backend.jar
```

## Notes

- There is no authentication/login system — this was intentionally left out of scope
  and the app runs as a single internal admin view, as specified.
- All dashboard and report numbers are computed live from MySQL through the Spring
  Boot REST API; nothing is hard-coded on the frontend.
