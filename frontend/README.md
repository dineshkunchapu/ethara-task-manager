# Ethara Task Manager

A full-stack Project & Task Management application built with React.js, FastAPI, and SQLite.

![Dashboard](screenshots/dashboard.png)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + React Router + Recharts |
| Backend | FastAPI (Python) |
| Database | SQLite (via SQLAlchemy) |
| Authentication | JWT Tokens + bcrypt |

---

## ✨ Features

### Authentication & User Flow
- Register with name, email, password and role
- Login with JWT token-based authentication
- Protected routes — redirect to login if not authenticated
- Role-based access — Admin vs User

### Project Management
- Create, edit, delete projects
- Project status — Active, Completed, Archived
- Each project owned by the creator

### Task Management
- Create, edit, delete tasks
- Task status — To Do, In Progress, Done
- Task priority — High, Medium, Low
- Due date assignment
- Quick status update inline from table
- Filter by status and priority
- Assign tasks to users (Admin only)

### Dashboard
- Summary stats — Total projects, tasks, completed, users
- Task status pie chart
- Task priority bar chart
- Tasks per project bar chart

### Role-Based Access Control
- **Admin** — View all projects, tasks, users. Assign tasks. Delete users.
- **User** — View own projects and assigned tasks only

---

## 📸 Screenshots

### Login
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Projects
![Projects](screenshots/projects.png)

### Tasks
![Tasks](screenshots/tasks.png)

### Users (Admin Only)
![Users](screenshots/users.png)

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0
```

Backend runs at: **http://localhost:8000**  
API docs: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login and get token | Public |
| GET | `/auth/me` | Get current user | User |
| GET | `/users` | Get all users | Admin |
| DELETE | `/users/{id}` | Delete user | Admin |
| GET | `/projects` | Get projects | User |
| POST | `/projects` | Create project | User |
| PUT | `/projects/{id}` | Update project | Owner/Admin |
| DELETE | `/projects/{id}` | Delete project | Owner/Admin |
| GET | `/tasks` | Get tasks | User |
| POST | `/tasks` | Create task | User |
| PUT | `/tasks/{id}` | Update task | User |
| DELETE | `/tasks/{id}` | Delete task | User |
| GET | `/dashboard` | Dashboard stats | User |

---

## 🗄️ Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | Integer PK | Auto increment |
| full_name | String | User's full name |
| email | String | Unique email |
| hashed_password | String | bcrypt hashed |
| role | String | admin or user |
| is_active | Boolean | Account status |
| created_at | DateTime | Registration time |

### Projects
| Column | Type | Description |
|--------|------|-------------|
| id | Integer PK | Auto increment |
| title | String | Project title |
| description | Text | Optional description |
| status | String | active/completed/archived |
| owner_id | FK → users | Project owner |
| created_at | DateTime | Creation time |

### Tasks
| Column | Type | Description |
|--------|------|-------------|
| id | Integer PK | Auto increment |
| title | String | Task title |
| description | Text | Optional description |
| status | String | todo/in_progress/done |
| priority | String | low/medium/high |
| project_id | FK → projects | Parent project |
| assignee_id | FK → users | Assigned user |
| due_date | String | Optional due date |
| created_at | DateTime | Creation time |

---

## 🧗 Challenges Faced

- **CORS configuration** — Required specific middleware setup in FastAPI to allow React dev server requests
- **bcrypt compatibility** — Resolved version conflict by downgrading to bcrypt 4.0.1
- **JWT token flow** — Implemented interceptor in axios to attach token to every request automatically
- **Role-based UI** — Admin-only routes and conditionally rendered components based on user role stored in localStorage
- **SQLite relationships** — Cascade delete on project-task relationship to clean up tasks when project is deleted

---

## 👤 Submitted By

**Name:** Kunchapu Dinesh Kullai Swamy
**Email:** chinnudinesh10@gmail.com
**College:** Srinivasa Ramanujan Institute of Technology, Anantapur
**Branch:** Computer Science & Data Science
**Year of Passing:** 2026