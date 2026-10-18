# 🌱 ReuseHub — Sustainable Campus Resource Sharing Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ReuseHub** connects students, campus community members, and registered NGOs to share, request, and donate academic and everyday resources. By diverting reusable items—such as textbooks, laptops, lab components, and study equipment—from landfills, ReuseHub fosters a measurable culture of circular sustainability on campus.

🔗 **GitHub Repository:** [https://github.com/Lijashree/Resource_sharing_platform.git](https://github.com/Lijashree/Resource_sharing_platform.git)

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Key Features & Modules](#-key-features--modules)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Environment Variables](#-environment-variables)
7. [Installation & Setup](#-installation--setup)
8. [Database Setup & Seeding](#-database-setup--seeding)
9. [Running the Application](#-running-the-application)
10. [Testing & Quality Assurance](#-testing--quality-assurance)
11. [User Roles & Demo Credentials](#-user-roles--demo-credentials)
12. [Security & Data Integrity](#-security--data-integrity)
13. [License](#-license)

---

## 🏛️ Architecture Overview

ReuseHub is architected as a decoupled, professional full-stack application structured into dedicated `frontend/` and `backend/` workspaces:

```
[ Frontend: React 18 + Vite + TailwindCSS v4 ]
                     │
          HTTP REST / JSON / JWT
                     ▼
[ Backend: Node.js + Express + TypeScript ]
                     │
          Mongoose ODM Schemas
                     ▼
[ Database: MongoDB Atlas / Local MongoDB Server ]
```

- **Frontend:** Single Page Application (SPA) with React 18, React Router 7, Framer Motion for smooth micro-animations, Recharts for dynamic analytics, and Sonner for feedback toasts.
- **Backend:** Express.js REST API with TypeScript, centralized error handling, and strict input validation.
- **Database:** MongoDB with Mongoose schemas, compound indexes for full-text search, and atomic inventory mutations.
- **Authentication:** Stateless JSON Web Token (JWT) authorization with password hashing via `bcryptjs`.

---

## ✨ Key Features & Modules

### 1. 📊 Interactive Dashboard
- Real-time statistics on total items, active users, items shared, and NGO donations queried live from MongoDB.
- Quick browse cards displaying available resources with quantity selectors and "Get this Item" actions.
- Terms & Conditions acceptance modal before finalizing any resource request.

### 2. 🔍 Browse Resources
- Search resources in real-time by keyword across title, description, and subcategories.
- Filter by Category (Laptops, Books, Aptitude Books, Project Components) and Type (Share vs. Donate).
- Live stock badges and empty state guidance when no items match filters.

### 3. ➕ Add Resource / Share Item
- Form validation for resource title, category, subcategory, quantity, pickup location, and preferred time slot.
- Image upload preview support for listing visuals.
- Multi-tier workflow: submissions by standard users are queued as `pending` for administrator approval, ensuring quality control and safe campus exchanges.

### 4. 📬 Resource Request Management
- Concurrent inventory protection ensuring requested quantities never exceed available stock.
- Two-way request management tabs:
  - **Received Requests:** Resource owners can review, accept, or reject incoming requests. Approving a request atomically decrements inventory.
  - **Sent Requests:** Requesters can track request status (`pending`, `approved`, `rejected`) and view verified pickup details (contact phone, location, pickup hours).

### 5. 🤝 NGO Bulk Donations
- Dedicated portal for charity and non-profit partner coordination.
- Allows donors to select multiple donated items and schedule bulk pickup appointments with partner organizations.

### 6. 📈 Verifiable Sustainability & Impact
- Dynamic data visualizations using Recharts (monthly activity trends and waste diversion by category).
- Transparent, scientifically grounded metrics calculation:
  - **Waste Diverted:** Calculated from unit count multiplied by material category mass.
  - **CO₂ Avoidance:** Calculated using a 2.4 kg CO₂e lifecycle emission avoidance factor.
  - **Beneficiaries Supported:** Tracked from completed resource exchange agreements.

### 7. 👤 User Profile Management
- Direct profile inspection and editing for name, phone, and campus department.
- Secure in-place password modification with confirmation checks and validation.

### 8. 🛡️ Administrator Panel & Database Inspector
- **Admin Dashboard:** Review pending listings, approve or reject items with 1-click controls, and inspect registered users.
- **Database Inspector:** Live view of all MongoDB collections (`users`, `items`, `requests`, `donationpickups`) with real document counts and JSON export capability.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18.3.1, TypeScript 5.7, Vite 6.4 |
| **Styling & Design** | TailwindCSS v4, Lucide React Icons, Framer Motion, Radix UI Primitives |
| **Data Visualization** | Recharts 2.15 |
| **Routing & State** | React Router 7.13, Context API, LocalStorage persistence |
| **HTTP Client** | Axios 1.7 with JWT bearer interceptors |
| **Backend Runtime** | Node.js 22.x, Express 4.21, TypeScript 5.7 |
| **Database & ODM** | MongoDB 7.0 / MongoDB Atlas, Mongoose 8.9 |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS middleware |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert/strict`), TSX |

---

## 📁 Project Structure

```
ReuseHub-Resource-sharing-platform-GIT UPLOAD/
├── backend/                        # Express + TypeScript + MongoDB Backend
│   ├── src/
│   │   ├── config/                 # Environment and MongoDB connection setup
│   │   ├── controllers/            # Business logic (auth, items, requests, etc.)
│   │   ├── middleware/             # JWT auth, role validation, centralized errors
│   │   ├── models/                 # Mongoose schemas (User, Item, Request, Pickup)
│   │   ├── routes/                 # Express REST endpoint declarations
│   │   ├── scripts/                # Database seed utility
│   │   ├── app.ts                  # Express application configuration
│   │   └── server.ts               # HTTP server & connection listener
│   ├── tests/                      # Automated API integration tests
│   ├── .env.example                # Safe backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # Vite + React + TailwindCSS Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Pages, layouts, modals, and UI primitives
│   │   │   ├── utils/              # Centralized Axios API client and helpers
│   │   │   ├── App.tsx             # Root React component
│   │   │   └── routes.tsx          # Client route definitions
│   │   ├── imports/                # Resource sample images
│   │   ├── styles/                 # Theme tokens, fonts, and Tailwind styles
│   │   └── main.tsx                # Client entrypoint
│   ├── .env.example                # Safe frontend environment template
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .env.example                    # Root environment variables guide
├── .gitignore                      # Git ignore excluding node_modules, .env, dist
├── package.json                    # Root workspace orchestrator
└── README.md                       # Complete documentation
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reusehub
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **Note for MongoDB Atlas users:** Replace `MONGODB_URI` with your connection string:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/reusehub?retryWrites=true&w=majority`

### Frontend Configuration (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lijashree/Resource_sharing_platform.git
   cd Resource_sharing_platform
   ```

2. **Install all dependencies (Root, Backend, and Frontend):**
   ```bash
   npm run install:all
   ```

3. **Verify MongoDB Service:**
   Ensure MongoDB is running locally (`mongodb://localhost:27017`) or configure your MongoDB Atlas connection string in `backend/.env`.

---

## 🗄️ Database Setup & Seeding

ReuseHub comes with a pre-configured database seeder that populates demo accounts, approved campus items (Laptops, Chargers, Sensors, Books), and requests:

```bash
# Seed or reset the MongoDB database:
npm run seed
```

---

## 💻 Running the Application

### Option 1: Run Both Simultaneously (Recommended)
From the project root:
```bash
npm run dev
```
- Backend starts at: `http://localhost:5000`
- Frontend starts at: `http://localhost:5173`

### Option 2: Run Separately
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

---

## 🧪 Testing & Quality Assurance

The backend includes an integration test suite validating:
- Health check status
- User signup and JWT generation
- Duplicate email prevention (409 Conflict)
- Invalid credential rejection (401 Unauthorized)
- Profile retrieval via protected routes
- Item creation and ownership association
- Item listing and search filtering
- Verifiable impact metrics calculation

Run the automated test suite:
```bash
npm test
```

### Production Build Verification
To verify production bundles for both frontend and backend:
```bash
npm run build
```

---

## 👥 User Roles & Demo Credentials

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `lijashree@college.edu` | `admin123` | Full access: approve/reject items, view registered users, inspect live MongoDB database |
| **Student** | `krishnapriya@college.edu` | `user123` | Post items, browse resources, request items, manage received requests |
| **Student** | `mithuna@college.edu` | `user123` | Post items, browse resources, request items, manage received requests |

*(Quick demo buttons are also embedded directly on the login page for convenience during evaluation).*

---

## 🔒 Security & Data Integrity

- **Server-Side Truth:** Authorization and ownership are enforced at the API layer; requests cannot be altered by forging client-side parameters.
- **Password Protection:** All passwords are salted and hashed using `bcryptjs` before persistence; raw passwords are never returned in queries.
- **Inventory Concurrency:** When a resource owner approves a request, stock quantity is deducted atomically on MongoDB to prevent double-allocation.
- **Environment Isolation:** Secrets and database connection strings are stored strictly in `.env` files and excluded from Git via `.gitignore`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Built with 💚 for campus circular sustainability.
