# GharKaZaiqa — Full Stack MERN Homemade Food Marketplace

Responsive React + Tailwind CSS frontend, Express/Node backend, MongoDB models, JWT auth, Socket.IO chat, chef food management and order APIs. Payment is scaffolded for a future provider integration; no live payment is enabled by default.

## Requirements
- Node.js 20+
- MongoDB local or Atlas connection string

## Run backend
```bash
cd server
cp .env.example .env
npm install
npm run seed  # optional: insert sample dishes
npm run dev
```
Edit `server/.env` and set `MONGO_URI` and `JWT_SECRET`.

## Run frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Frontend: http://localhost:5173  Backend: http://localhost:5000

## Demo accounts
Register using the UI/API. For chef role, select `chef` at registration. The optional seed command inserts sample dishes and creates a local demo chef account `demo.chef@gharkazaiqa.local` / `DemoChefPassword123!` for assignment testing only. Change or remove it before deployment. Admin role must be assigned manually in the database; never allow public admin registration in production.

## Included
- Mobile-first React UI with Tailwind CSS
- Food search, categories, dish cards, cart drawer, checkout/order creation
- JWT register/login and role-aware API middleware
- Food CRUD for chef accounts
- Orders with status tracking
- Socket.IO chat events and message persistence model
- Payment intent placeholder endpoint returning `not_configured` until a supported provider is added

## Before production
Add request validation, rate limiting, email verification, password reset, image upload service, audit logs, payment provider webhook/signature verification, delivery workflow, moderation, food safety checks, privacy policy, terms, backups and deployment secrets. Never store card details yourself.
