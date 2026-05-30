# Hospital ADR Reporting System

A full-stack web app for reporting and tracking Adverse Drug Reactions in hospital settings.

## Tech Stack
- **Frontend:** React, React Router, Axios, Tailwind CSS
- **Backend:** Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- **Database:** SQLite | **Auth:** JWT | **External API:** OpenFDA

## Setup

### Backend
```bash
cd backend
pipenv install
pipenv shell
python seed.py
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Pharmacist | pharmacist@hospital.com | pharma123 |
| Nurse | nurse@hospital.com | nurse123 |

## Features
- JWT Authentication with role-based access (Admin, Pharmacist, Nurse)
- Full CRUD on ADR Reports, Patients, Drugs, Symptoms
- OpenFDA external drug search and save to database
- Analytics dashboard (Admin only)
- Protected routes on frontend and backend
- One-to-Many and Many-to-Many database relationships