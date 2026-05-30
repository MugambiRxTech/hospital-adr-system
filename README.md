Hospital ADR Reporting System
README — Setup & Project Documentation
React  |  Flask  |  SQLite  |  JWT  |  OpenFDA API
Project Overview
The Hospital ADR Reporting System is a full-stack web application that enables hospital staff (pharmacists, doctors, nurses) to digitally report, track, and analyze adverse drug reactions. It replaces paper-based workflows with a structured, role-controlled platform built with React (frontend) and Flask (backend).

Tech Stack

Layer	Technology
Frontend	React, React Router, Axios, Tailwind CSS
Backend	Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt
Database	SQLite
Authentication	JWT (JSON Web Tokens)
External API	OpenFDA Drug API
Environment	python-dotenv

Features
•	JWT Authentication — Register, Login, Logout
•	Role-based access control — Admin, Pharmacist, Nurse
•	Full CRUD on ADR Reports, Patients, Drugs, Symptoms
•	OpenFDA drug search and save to database
•	Analytics dashboard (Admin only)
•	Protected routes on both frontend and backend
•	One-to-Many and Many-to-Many database relationships

Project Structure

Path	Description
backend/app.py	Flask application entry point
backend/config.py	App configuration and environment variable loading
backend/extensions.py	SQLAlchemy, JWT, Bcrypt instances
backend/seed.py	Database seed file with sample data
backend/.env	Environment variables (not committed to Git)
backend/models/	SQLAlchemy models: User, Patient, Drug, ADRReport, Symptom
backend/routes/	Flask Blueprints: auth, patients, drugs, reports, symptoms
frontend/src/pages/	React page components (15 pages)
frontend/src/components/	Reusable UI components (Navbar, ProtectedRoute, SeverityBadge)
frontend/src/context/	AuthContext for global authentication state
frontend/src/services/	Axios API service with JWT interceptor

Setup Instructions
1. Clone the Repository
git clone https://github.com/MugambiRxTech/hospital-adr-system.git
cd hospital-adr-system

2. Backend Setup
Navigate to the backend folder and install dependencies:
cd backend
pipenv install
pipenv shell

Create a .env file in the backend folder with the following:
SECRET_KEY=supersecretkey123
JWT_SECRET_KEY=jwtsecretkey456
DATABASE_URL=sqlite:///adr.db

Seed the database with sample data:
python seed.py

Run the Flask server:
python app.py
Backend runs on: http://127.0.0.1:5000

3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173

Default Login Credentials

Role	Email	Password
Admin	admin@hospital.com	admin123
Pharmacist	pharmacist@hospital.com	pharma123
Nurse	nurse@hospital.com	nurse123

API Endpoints

Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login, returns JWT	Public
POST	/api/auth/logout	Logout	Protected
GET	/api/auth/me	Get current user	Protected
GET	/api/patients/	Get all patients	Protected
POST	/api/patients/	Add patient	Protected
GET	/api/patients/:id	Get patient detail	Protected
PUT	/api/patients/:id	Update patient	Protected
DELETE	/api/patients/:id	Delete patient	Protected
GET	/api/drugs/	Get all drugs	Protected
POST	/api/drugs/	Add drug	Protected
GET	/api/drugs/:id	Get drug detail	Protected
PUT	/api/drugs/:id	Update drug	Protected
DELETE	/api/drugs/:id	Delete drug	Protected
GET	/api/drugs/search-fda	Search OpenFDA API	Protected
POST	/api/drugs/save-fda	Save FDA drug to DB	Protected
GET	/api/reports/	Get all reports	Protected
POST	/api/reports/	Submit ADR report	Protected
GET	/api/reports/:id	Get report detail	Protected
PUT	/api/reports/:id	Update report	Protected
DELETE	/api/reports/:id	Delete report	Admin
GET	/api/reports/my-reports	Get my reports	Protected
GET	/api/reports/analytics/summary	Analytics summary	Admin
GET	/api/symptoms/	Get all symptoms	Protected
POST	/api/symptoms/	Add symptom	Admin

Database Relationships

Type	Relationship	Description
One-to-Many	User -> ADRReport	One user can submit many ADR reports
One-to-Many	Patient -> ADRReport	One patient can have many ADR reports
One-to-Many	Drug -> ADRReport	One drug can appear in many ADR reports
Many-to-Many	ADRReport <-> Symptom	One report can have many symptoms; one symptom can appear in many reports. Managed via ReportSymptom junction table.

User Roles

Role	Permissions
Admin	Full access: manage users, view all reports, access analytics, delete records
Pharmacist	Submit and edit ADR reports, manage drugs and patients, view all reports
Nurse / Doctor	Submit ADR reports, view own submissions, view patients and drugs

Git Workflow
•	main — stable production branch
•	backend — all Flask backend development
•	frontend — all React frontend development
•	Branches merged into main via pull requests
•	Feature branches deleted after merging

