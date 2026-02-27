# FUTURE_FS_02

A modern Full-Stack CRM (Customer Relationship Management) application built with the **MERN Stack** (MongoDB, Express, React, Node.js).

## 🚀 Features

- **Authentication** – Secure Login/Register with JWT and role-based access (Admin/Agent).
- **Dashboard** – Visual analytics with charts for lead status, conversion rates, and team performance.
- **Lead Management**
  - Create, Read, Update, Delete leads.
  - **Kanban Board** – Drag-and-drop leads to change status.
  - **List View** – Sortable table view.
  - CSV Import/Export for bulk lead operations.
- **Team Management** – Manage team members, assign leads, and track performance.
- **Team Chat** – Real-time team communication.
- **Leaderboard** – Track top-performing agents.
- **Calendar** – Schedule and manage tasks and follow-ups.
- **Customer Portal** – Public-facing lead submission form.
- **Global Search** – Search across leads, tasks, and contacts.
- **Quote Generator** – Generate and manage quotes.
- **Dark Mode** – Fully supported dark/light theme toggle.
- **Responsive** – Mobile-friendly design.

## 🛠 Tech Stack

| Layer      | Technologies                                                                 |
|------------|-----------------------------------------------------------------------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Router, Axios, Chart.js, Recharts, Framer Motion, React Beautiful DND, Leaflet Maps |
| **Backend**  | Node.js, Express 5, MongoDB (Mongoose), JWT, Bcrypt                        |
| **Database** | MongoDB Atlas (with In-Memory fallback)                                    |

## 📦 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### 1. Clone the Repository

```bash
git clone https://github.com/24SankeerthM/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the server:
```bash
npm start
```
Server runs on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

## 📁 Project Structure

```
FUTURE_FS_02/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios API configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App with routing
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js Backend (Express)
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/           # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── server.js            # Entry point
│   └── package.json
├── .gitignore
└── README.md
```

## 🔐 Default Credentials

- Register a new user to get started. By default, new users are **Agents**.
- Change the role in the database to `admin` to access admin features.

## 📜 License

This project is for educational purposes as part of the Future Intern Full-Stack Development program.
