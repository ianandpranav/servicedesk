# ServiceDesk — IT Support Management System

A full-stack IT support management application for managing support tickets, users, assignments, priorities, statuses, and reports through a centralized web interface.

## Live Demo

https://servicedesk-anand.netlify.app/

## Source Code

https://github.com/ianandpranav/servicedesk

## Overview

ServiceDesk is a full-stack web application built around common IT support and help-desk workflows.

The application provides ticket management, user management, ticket assignment, search and filtering, dashboard statistics, reporting, CSV export, validation, and error handling.

The project uses a React frontend, Java Spring Boot REST API, and MySQL database.

## Features

### Ticket Management

- Create, view, update, and delete support tickets
- Manage ticket title, description, category, and priority
- Assign tickets to support agents
- Track requester and ticket timestamps
- Manage ticket status

### User Management

- Create, view, update, and delete users
- Manage user name, email, phone, and department
- Manage user role and status
- Identify and assign support agents

### Search & Filtering

- Search tickets by title, description, or requester
- Filter by status, priority, category, and assigned agent
- Filter tickets by date range

### Dashboard & Reports

- Database-driven dashboard statistics
- Ticket breakdown by status, priority, category, and agent
- Reporting through REST APIs
- CSV export

### Validation & Error Handling

- Backend request validation using Bean Validation
- Frontend validation and error handling
- REST API communication between frontend and backend

### Responsive Interface

- Responsive layout for desktop, tablet, and mobile devices

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database

- MySQL

### Deployment

- Netlify
- Render

## Project Structure

```text
servicedesk/
├── backend/       # Spring Boot REST API
├── frontend/      # React + Vite frontend
├── README.md
└── netlify.toml


Backend
backend/
└── src/main/java/
    └── ...
        ├── controller/
        ├── service/
        ├── repository/
        ├── entity/
        ├── dto/
        ├── exception/
        └── config/


Frontend
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── services/
    ├── hooks/
    └── utils/


REST API
The frontend communicates with the Spring Boot backend through REST APIs.


Tickets
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/{id}
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}


Users
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/agents


Dashboard
GET /api/dashboard/stats


Reports
GET /api/reports
GET /api/reports/export


Getting Started

Prerequisites
JDK 17+
Maven 3.9+
MySQL 8+
Node.js 18+
npm


Clone the Repository
git clone https://github.com/ianandpranav/servicedesk.git
cd servicedesk


Database Setup
Create the MySQL database:
CREATE DATABASE servicedesk_db;

Update the database credentials in:
backend/src/main/resources/application.properties


Run the Backend
cd backend
mvn spring-boot:run

The backend runs on:
http://localhost:8080


Run the Frontend
Open another terminal:
cd frontend
npm install
npm run dev

The frontend runs on:
http://localhost:5173


Project Scope
Authentication and login functionality are currently outside the scope of this project. The application is designed as an internal administrative IT support interface.
Dashboard and reporting data are calculated from database data through the Spring Boot REST API rather than being hard-coded in the frontend.


Author
Anand Pranav
Portfolio: https://anandpranav.netlify.app/⁠�
LinkedIn: https://www.linkedin.com/in/anand-pranav-5441821ba⁠�


License
This project is available for learning, demonstration, and portfolio purposes.
