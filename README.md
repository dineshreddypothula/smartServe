# Smart Serve 🍽️

**Smart Serve** is a QR-based restaurant management platform that connects customers, restaurant owners, and staff through one web application. Customers can scan a table QR code to browse the menu and place orders, while restaurant teams manage orders, tables, menus, and day-to-day service from role-specific screens.

🌐 **Live Demo:** https://smart-serve-app.netlify.app/  
📦 **Repository:** https://github.com/dineshreddypothula/smartServe

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Application Routes](#application-routes)
- [API Overview](#api-overview)
- [Real-Time Updates](#real-time-updates)
- [Security](#security)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Smart Serve aims to simplify dine-in service by replacing manual ordering and scattered communication with a digital workflow. Each restaurant can manage its information, menu, tables, and staff. Customers access a restaurant's table-specific ordering page using a QR code, and order/status changes can be communicated to connected screens in real time.

The repository is organized as two applications:

- **Frontend:** Next.js and React web application.
- **Backend:** Node.js and Express API, backed by MongoDB and Socket.IO.

## Features

### Customer experience

- Browse restaurants and view restaurant details.
- Open a table-specific menu from a QR-code URL.
- Browse menu items, add items to a cart, and place orders.
- Track active orders and receive status updates.
- Request service or the bill from the table interface.
- Submit restaurant ratings and reviews.
- Book tables and manage bookings through the account flow.

### Restaurant and staff workflows

- Owner registration/login, including Google OAuth support.
- Create and manage restaurant information and settings.
- Manage menu items, availability, and pricing.
- Manage restaurant tables and staff members.
- View active orders and order history.
- Update order statuses and handle table completion/payment state.
- Access restaurant and staff analytics where supported.
- Separate owner, manager, waiter, and kitchen experiences.

### Application experience

- Responsive user interface.
- Light/dark theme support.
- Role-aware screens and protected API routes.
- Real-time communication powered by Socket.IO.
- Demo screens for exploring customer, waiter, and kitchen workflows.

> **Note:** The repository includes demo pages that use mock/sample data. Features on a demo page should not be assumed to persist to the backend. Use the main application routes to explore integrated flows.

## User Roles

| Role | Purpose |
|---|---|
| Customer | Discover restaurants, browse menus, place orders, track orders, and manage bookings. |
| Owner | Set up a restaurant, manage menus and staff, and view restaurant information and analytics. |
| Manager | Support restaurant operations and manage permitted service workflows. |
| Waiter | Monitor tables and orders, respond to service/bill requests, and update order/table state. |
| Kitchen | View incoming orders and progress orders through preparation. |

Access is controlled by role-aware frontend flows and backend authorization middleware. Available actions depend on the route and the role assigned to the user.

## Technology Stack

### Frontend

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- JavaScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Zustand](https://zustand.docs.pmnd.rs/) for client state
- [Axios](https://axios-http.com/) for HTTP requests
- [Socket.IO Client](https://socket.io/) for live updates
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) for QR code rendering

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) 5
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/) for real-time events
- JSON Web Tokens (JWT) for authentication
- [Passport.js](https://www.passportjs.org/) with Google OAuth 2.0
- bcryptjs for password hashing
- Helmet, CORS, rate limiting, and request validation middleware

## Application Architecture

```text
Customer / Owner / Waiter / Kitchen
                 |
                 v
      Next.js + React Frontend
                 |
       HTTP (Axios) / Socket.IO
                 |
                 v
       Node.js + Express Backend
          |                 |
          v                 v
      MongoDB          Socket.IO Events
```

- The frontend is located in `frontend/`.
- The API and Socket.IO server are located in `backend/`.
- MongoDB stores application data such as users, restaurants, bookings, and orders.
- REST endpoints handle regular data operations; Socket.IO supports live operational updates.

## Project Structure

```text
smartServe/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── business/       # Restaurant-facing entry and workflows
│   │   │   ├── dine/           # QR/table-based customer ordering
│   │   │   ├── restaurants/    # Restaurant discovery/details
│   │   │   ├── login/          # Customer login
│   │   │   ├── signup/         # Customer registration
│   │   │   ├── restro-login/   # Restaurant login
│   │   │   ├── restro-signup/  # Restaurant registration
│   │   │   ├── customer-demo/  # Sample customer interface
│   │   │   ├── waiter-demo/    # Sample waiter interface
│   │   │   └── kitchen-demo/   # Sample kitchen interface
│   │   ├── components/         # Shared UI and role-specific components
│   │   ├── hooks/              # Reusable React hooks
│   │   ├── services/           # Socket.IO client service
│   │   ├── store/              # Zustand stores
│   │   └── ...
│   ├── package.json
│   └── next.config.mjs
│
└── backend/
    ├── src/
    │   ├── controllers/        # Request handling and business logic
    │   ├── middleware/         # Authentication, validation, errors
    │   ├── models/             # Mongoose data models
    │   ├── routers/            # REST API routes
    │   ├── socket/             # Socket.IO server/events
    │   ├── utils/              # Passport, logging, helpers
    │   ├── app.js              # Express application and server
    │   └── db.js               # MongoDB connection
    └── package.json
```

## Getting Started

### Prerequisites

Install or arrange access to:

- Node.js (use a current LTS release compatible with the installed Next.js version)
- npm
- A MongoDB database, local or hosted
- Google OAuth credentials if you want to use Google sign-in
- A terminal and Git

### 1. Clone the repository

```bash
git clone https://github.com/dineshreddypothula/smartServe.git
cd smartServe
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and set the required values described in [Environment Variables](#environment-variables).

Start the backend:

```bash
npm run dev
```

The backend defaults to port `5000`. When it starts successfully, the health check is available at:

```text
http://localhost:5000/health
```

Expected response shape:

```json
{
  "status": "UP",
  "timestamp": "..."
}
```

### 3. Configure the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` and configure the API URL:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Keep the backend and frontend running in separate terminals during local development.

## Environment Variables

The following variables are referenced by the application. Set secrets only in local environment files or your hosting provider's secret manager. **Do not commit real credentials to Git.**

### Backend — `backend/.env`

```dotenv
PORT=5000
NODE_ENV=development

# MongoDB connection string
MONGO_DB_URL=mongodb://127.0.0.1:27017/smartserve

# Frontend origin allowed by the backend CORS configuration
FRONTEND_URL=http://localhost:3000

# Google OAuth credentials (required for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Use a MongoDB connection string appropriate for your own database. The local connection above is an example; it does not create or configure MongoDB for you.

Configure the Google OAuth authorized redirect URI to match the deployed backend's callback route:

```text
/api/auth/google/callback
```

The exact full callback URL depends on the backend's public origin and the OAuth provider configuration.

### Frontend — `frontend/.env.local`

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`NEXT_PUBLIC_API_URL` must point to the **backend origin**, without an additional `/api` suffix. The frontend constructs API paths using `/api`.

After changing environment variables, restart the relevant development server. For production, set the frontend and backend variables in their respective deployment environments.

## Running the Application

From the repository root, run these commands in two separate terminals.

**Terminal 1 — Backend**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

Useful scripts:

| Directory | Command | Description |
|---|---|---|
| `frontend/` | `npm run dev` | Run Next.js in development mode. |
| `frontend/` | `npm run build` | Build the frontend for production. |
| `frontend/` | `npm run start` | Serve a previously built frontend. |
| `frontend/` | `npm run lint` | Run ESLint. |
| `backend/` | `npm run dev` | Run the API with nodemon. |
| `backend/` | `npm start` | Run the API with Node.js. |

The backend package currently defines a placeholder test script, so `npm test` is not yet a working automated test suite.

## Application Routes

Common frontend routes include:

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/restaurants` | Restaurant discovery |
| `/restaurants/[id]` | Restaurant details |
| `/dine/[restroId]/[tableId]` | Table-specific dine-in experience |
| `/business` | Restaurant/business entry point |
| `/login` and `/signup` | Customer authentication |
| `/restro-login` and `/restro-signup` | Restaurant authentication |
| `/customer-demo` | Demo customer flow |
| `/waiter-demo` | Demo waiter workflow |
| `/kitchen-demo` | Demo kitchen display |

The exact pages available may evolve as the application is developed.

## API Overview

The Express application exposes these API groups:

| Base path | Purpose |
|---|---|
| `/api/auth` | Registration, login, logout, current-user lookup, Google OAuth |
| `/api/restaurants` | Restaurant discovery/details, owner management, tables, staff, menu, analytics, reviews |
| `/api/orders` | Order placement, active orders, order status, table payment/freeing, order history |
| `/api/bookings` | Booking creation, retrieval, cancellation, table locks |

A simple health check is available at `GET /health`.

Example request to check whether the backend is responding:

```bash
curl http://localhost:5000/health
```

For route details, parameters, request payloads, and authorization requirements, refer to the router and controller files in `backend/src/`.

## Real-Time Updates

The frontend uses a shared Socket.IO client service in `frontend/src/services/socketService.js`. It connects to the backend using `NEXT_PUBLIC_API_URL` and joins the appropriate restaurant, table, or staff rooms.

Real-time events in the code cover workflows such as:

- New orders and order status changes
- Table availability, locks, and service requests
- Staff updates
- Menu stock/availability changes
- Restaurant status updates
- Booking and review events

Real-time features require the backend to be running and reachable at the configured API URL. In a deployed environment, configure the hosting platform, proxy, and CORS settings to support the Socket.IO connection.

## Security

The backend includes several security-related measures:

- JWT-based authentication and protected routes
- Role-based authorization for staff and owner operations
- Password hashing with bcryptjs
- Request validation
- Helmet security headers
- CORS configuration
- API rate limiting
- MongoDB input sanitization middleware
- Centralized error-handling middleware

These measures are part of the current implementation, but they do not by themselves constitute a complete security audit. Review configuration, authorization rules, logging, dependency updates, and production settings before using the application with real customer data.

## Deployment Notes

The repository contains a frontend deployment configuration and the project has a public demo URL. To deploy your own instance:

1. Provision a MongoDB database.
2. Deploy the backend to a Node.js-compatible host.
3. Set the backend environment variables, including `MONGO_DB_URL`, `FRONTEND_URL`, and OAuth credentials where applicable.
4. Deploy the frontend to a Next.js-compatible host.
5. Set `NEXT_PUBLIC_API_URL` to the backend's public origin.
6. Ensure the backend CORS allowlist includes the frontend's real origin.
7. Configure Google OAuth callback URLs for the deployed backend.
8. Verify API and Socket.IO connectivity, authentication, table ordering, and order-status updates.

Do not assume the live demo uses your local configuration or database. Production environment variables and service credentials must be configured on the hosting providers.

## Troubleshooting

**Frontend cannot connect to the API**

- Confirm the backend is running.
- Check `frontend/.env.local` and make sure `NEXT_PUBLIC_API_URL` contains the backend origin only.
- Restart the frontend after editing environment variables.

**MongoDB connection fails**

- Verify `MONGO_DB_URL`.
- Confirm the database is available and that network access/credentials are configured correctly.
- If using a hosted cluster, check its network access rules.

**Google sign-in fails**

- Confirm `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- Check the OAuth authorized redirect URI.
- Verify the public backend callback URL and frontend/backend URLs are configured consistently.

**Socket.IO updates do not appear**

- Confirm the backend is reachable.
- Check the browser console and backend logs for connection errors.
- Verify production CORS and proxy settings permit the Socket.IO handshake and transport.

**A demo action does not save data**

- Demo pages may rely on mock data for demonstration. Check the integrated route for the backend-connected workflow.

## Future Improvements

Potential areas to extend the project include:

- Automated unit and integration tests for frontend and backend workflows.
- API documentation with request/response examples.
- A repeatable local development setup using Docker Compose.
- Payment gateway integration and payment-state reconciliation.
- More comprehensive accessibility and end-to-end testing.
- CI checks for linting, builds, and security/dependency updates.

These are suggested improvements, not a claim that they are currently implemented.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes with a descriptive message.
4. Push the branch and open a pull request.

For significant changes, explain the problem being solved and include steps to test the change.

## License

No repository-level license file was identified when this README was prepared. Unless a license is added to the repository, reuse and redistribution are not automatically granted. Add a license file if you intend to make the project open source under specific terms.
