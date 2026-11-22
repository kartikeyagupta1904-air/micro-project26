# Granthalaya backend (Express + SQLite)

This folder contains a REST API and SQLite database for the Granthalaya Library Management System. It supports login, role-based access, books, students, issuing/returning books, fines, dashboard totals, and reports.

## Requirements
- Node.js 20 or newer
- npm

## Run locally
1. Extract this folder.
2. Open a terminal in `granthalaya-backend`.
3. Run `npm install`.
4. A ready-to-use `.env` is included with new credentials. (Starting from `.env.example` instead? Copy it to `.env` and fill in every value.)
5. Before real use, replace `JWT_SECRET` with your own long random secret and change the librarian password after your first login.
6. Run `npm start`.
7. Visit `http://localhost:3000/api/health`; expected response: `{"ok":true,"service":"Granthalaya API"}`.

The database `granthalaya.db` is created automatically and seeded with sample book records. The first librarian account is created from `ADMIN_ROLL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` in `.env`. If you change the admin password after the database has already been created, update the user password through the change-password endpoint or delete the local database only if you are happy to reset all local data.

## Login details
The first librarian account is created from `.env`: ID `ADMIN_ROLL` (default `LIB2026`) and password `ADMIN_PASSWORD`. The server refuses to start with the example JWT secret, and will not create an admin account without a password of at least 8 characters. Never commit `.env` (it is already in `.gitignore`).

Security built in: bcrypt password hashing, 8-hour JWT sessions, and login rate limiting (5 failed attempts pauses that IP for 5 minutes). New passwords need 8+ characters with letters and numbers.

## API overview
All routes except health and login require `Authorization: Bearer <token>` where marked.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Check server |
| POST | `/api/auth/login` | Public | Login with `{ "roll": "1000", "password": "..." }` |
| GET | `/api/auth/me` | Logged in | Current account |
| POST | `/api/auth/change-password` | Logged in | Change password |
| GET | `/api/dashboard` | Logged in | Dashboard counters |
| GET | `/api/books?q=term` | Logged in | Search books |
| POST | `/api/books` | Librarian | Add book `{title, author, total}` |
| PATCH | `/api/books/:id` | Librarian | Edit book |
| DELETE | `/api/books/:id` | Librarian | Delete a book with no loan history |
| GET | `/api/students?q=term` | Librarian | Search students |
| POST | `/api/students` | Librarian | Add student `{roll, name, department, password}` |
| PATCH | `/api/students/:id` | Librarian | Edit student name/department |
| GET | `/api/loans` | Logged in | Loan history (students see their own) |
| POST | `/api/loans` | Librarian | Issue book `{bookId, roll}` |
| POST | `/api/loans/:id/return` | Librarian | Return a book; late fine is ₹2/day |
| GET | `/api/reports/summary` | Librarian | Loan/fine summary and popular books |

Loan period is 14 days and students can hold up to 3 active books. Passwords are hashed with bcrypt; authentication uses short-lived JWTs.

## Important: connect the existing HTML frontend
The current HTML file is a standalone prototype that stores records in the browser (`localStorage`) and checks login in client-side JavaScript. This backend runs separately; the HTML does **not** automatically use it yet. To make the site use the database, its login and data functions must be updated to call these `/api/...` endpoints and include the returned bearer token. Set `CORS_ORIGIN` to the exact origin used to serve the HTML (for example `http://localhost:5500`). Avoid opening the HTML as a `file://` URL for API use; serve it through a local web server.

This is a starter project for local/student use. Before public deployment, extend the built-in login rate limiting (use a shared store if you run more than one server), set stricter production CORS, account-management/reset flows, HTTPS, backups, and appropriate privacy/security review.
