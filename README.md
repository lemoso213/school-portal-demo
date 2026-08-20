# School Portal Demo

This repository contains a minimal demo of authentication, role- and ownership-based authorization, and an audit log for grade changes.

Seeded users (passwords are simple for the demo):

- admin@school.test / adminpass (admin)
- tina@school.test / teachpass (teacher owning Algebra I)
- tom@school.test / teach2 (teacher owning History)
- sally@school.test / student (student)
- sam@school.test / student (student)

Run:

1. npm install
2. npm start

Endpoints:

- POST /api/auth/login { email, password } -> { token, user }
- GET /api/auth/me -> current user (requires Authorization: Bearer <token>)
- GET /api/grades -> list grades visible to the caller
- PATCH /api/grades/:id { score } -> update a grade (subject to permissions), creates an audit entry
- GET /api/audit-log -> admin only, newest-first

Notes:
- This project uses an in-memory store. All changes are lost on restart.
- JWT secret defaults to `dev-secret`. Set JWT_SECRET in your environment for non-demo use.
- This demo intentionally re-fetches the user on every request so role changes take effect immediately.
