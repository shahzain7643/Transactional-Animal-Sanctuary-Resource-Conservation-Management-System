# 🐾 Animal Sanctuary Management System

## 📌 Project Overview

The **Animal Sanctuary Management System** is a full-stack web application designed to manage animal rescue operations, including animal tracking, medical treatments, adoption workflows, and financial transactions.

The system ensures:

* Secure authentication using JWT
* Role-based access control (RBAC)
* ACID-compliant transaction handling
* Efficient querying using indexing and filtering

---

## 👥 Team Information

**Group Members:**

* Qazi Muhammad Shahzain
* Abdullah Atif
* Zain ul Abideen

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Axios (with interceptor for JWT)
* React Router DOM

### 🔹 Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt (password hashing)

### 🔹 Database

* PostgreSQL
* Raw SQL (no ORM)
* Triggers, Views, Indexes

---

## 🧠 System Architecture

Frontend (React) → Backend (Express API) → PostgreSQL Database

* Frontend sends API requests via Axios
* Backend processes requests and enforces RBAC
* PostgreSQL ensures data integrity via constraints and triggers

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Token stored in localStorage
* Axios interceptor automatically attaches token
* Role-Based Access Control enforced via middleware

### 👥 Roles & Permissions

| Role         | Permissions                                  |
| ------------ | -------------------------------------------- |
| Admin        | Full access (CRUD animals, approve adoption) |
| Veterinarian | View animals, approve adoption               |
| Adopter      | View animals                                 |
| Volunteer    | Limited access                               |

---

## 🖥️ UI Overview

### 🔹 Login Page

* User logs in with email & password
* JWT token stored in browser

### 🔹 Dashboard

* Role-based UI
* Admin: Manage animals + approvals
* Vet: Medical view
* Adopter: View animals
* Volunteer: Limited UI

### 🔹 Animals Page (CRUD Interface)

* Add animals
* Update animals
* Delete animals
* View all animals

---

## ✨ Features (Phase 3 Requirements)

### ✅ CRUD Interface

* Full Create, Read, Update, Delete for animals
* Connected to backend APIs

### ✅ Role-Based Dashboards

* UI changes based on user role
* Protected routes implemented

### ✅ Transaction Demonstration

* Adoption approval system:

  * Updates application status
  * Inserts adoption record
  * Updates animal status
  * Rolls back on failure

### ✅ Advanced Features (REQUIRED)

#### 🔍 1. Search

* Search animals by name
* Implemented using:

  * Frontend filtering
  * Backend SQL (`ILIKE`)

#### 🔽 2. Filter

* Filter animals by adoption status
* Uses indexed columns for performance

### 📊 3. Analytics (Bonus)

* Displays total number of animals dynamically

---

## ⚙️ Setup & Installation

### 🔹 Prerequisites

* Node.js (v18+)
* PostgreSQL
* npm

---

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=animal_sanctuary_management
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Database Setup

```sql
CREATE DATABASE animal_sanctuary_management;
```

Run:

```bash
psql -U postgres -d animal_sanctuary_management -f schema.sql
psql -U postgres -d animal_sanctuary_management -f seed.sql
```

---

## 👤 Test Credentials

| Role    | Email                                         | Password |
| ------- | --------------------------------------------- | -------- |
| Admin   | [ali@example.com](mailto:ali@example.com)     | 123      |
| Vet     | [sara@example.com](mailto:sara@example.com)   | 123      |
| Adopter | [bilal@example.com](mailto:bilal@example.com) | 123      |

---

## 🔄 Transaction Scenarios

### 🐶 Adoption Approval

Triggered when admin approves adoption:

1. Update application status
2. Insert into adoptions
3. Update animal status
4. Insert financial record

✔ Uses BEGIN / COMMIT / ROLLBACK
✔ Ensures atomic operations

---

## 🔐 ACID Compliance

| Property    | Implementation                     |
| ----------- | ---------------------------------- |
| Atomicity   | Transactions ensure all-or-nothing |
| Consistency | Constraints + triggers             |
| Isolation   | PostgreSQL isolation               |
| Durability  | WAL logging                        |

---

## ⚡ Indexing & Performance

Indexes implemented on:

* animal name (search optimization)
* adoption status (filtering)
* adopter ID
* financial transaction type

Performance tested using `EXPLAIN ANALYZE`.

---

## 📡 API Reference (Summary)

| Method | Endpoint                  | Auth    | Purpose          |
| ------ | ------------------------- | ------- | ---------------- |
| POST   | /api/v1/auth/login        | ❌       | Login            |
| GET    | /api/v1/animals           | ✅       | Get animals      |
| POST   | /api/v1/animals           | ✅ Admin | Add animal       |
| PUT    | /api/v1/animals/:id       | ✅ Admin | Update animal    |
| DELETE | /api/v1/animals/:id       | ✅ Admin | Delete animal    |
| POST   | /api/v1/adoptions/approve | ✅ Admin | Approve adoption |

---

## 🧪 Error Handling & Feedback

* Loading indicators implemented
* Error alerts shown on failures
* Backend validation prevents invalid operations

---

## ⚠️ Known Issues & Limitations

* Basic UI (no advanced styling)
* No pagination
* No real-time updates

---

## 📁 Project Structure

```
frontend/
backend/
database/
docs/
media/
README.md
```

---

## 📸 UI Screenshots (Required)

Include screenshots of:

* Dashboard (role-based)
* Animals page (CRUD + search + filter)
* Adoption approval (transaction)

---

## 📌 Conclusion

This project demonstrates a **complete full-stack system** with:

* Secure authentication
* Role-based access control
* Transaction-safe operations
* ACID-compliant database design
* Advanced search and filtering

It ensures **data integrity, scalability, and usability** for managing an animal sanctuary.

---
