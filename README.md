<p align="center">
  <img src="https://i.ibb.co.com/3YytxTLh/logo.png" alt="ScholarTrack Logo" />
</p>

<h1 align="center">ScholarTrack 🎓</h1>

<p align="center">
  <strong>A Modern, Enterprise-Grade Scholarship Management System for Universities.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

---

## 📖 Overview

ScholarTrack is a comprehensive SaaS platform designed to help universities streamline their scholarship application, management, and distribution processes. Built with a decoupled frontend (Next.js) and backend (Express) architecture, it offers a highly secure, scalable, and responsive experience for University Administrators and Students.

## ✨ Key Features

- **🔐 Secure Authentication:** Cross-domain cookie-based authentication powered by `better-auth`.
- **💳 Automated Subscriptions:** End-to-end Stripe integration with live webhook processing for Monthly and Yearly university subscription plans.
- **🏛️ University Admin Portal:** A dedicated dashboard for universities to manage their profile, view payment history, and oversee scholarship programs.
- **⚡ Real-time UI:** Optimistic UI updates and cache management using Next.js Server Actions and TanStack Query.
- **🎨 Modern Design:** Fully responsive, accessible, and beautifully styled components using Shadcn UI and Tailwind CSS.
- **🗄️ Relational Database:** Robust data modeling and type-safe queries using Prisma ORM.

---

## 🔗 Important Links

| Resource | URL |
| :--- | :--- |
| **🚀 Live Frontend** | [https://frontend-scholar-track.vercel.app](https://frontend-scholar-track.vercel.app) |
| **⚙️ Live Backend** | [https://backend-scholar-track.vercel.app](https://backend-scholar-track.vercel.app) |
| **📂 Frontend Repo** | [https://github.com/Rishad1404/frontend-scholar-track](https://github.com/Rishad1404/frontend-scholar-track) |
| **🗄️ Backend Repo** | [https://github.com/Rishad1404/backend-scholar-track](https://github.com/Rishad1404/backend-scholar-track) |

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn UI
- **State Management & Fetching:** TanStack Query
- **Icons:** Lucide React

### Backend (Server-Side)
- **Framework:** Express.js (Node.js)
- **Language:** TypeScript
- **ORM:** Prisma
- **Authentication:** better-auth
- **Payments:** Stripe API & Webhooks

---

## 🚀 Getting Started

Because this application uses a decoupled architecture, you will need to run both the backend server and the frontend client simultaneously. Follow these steps to get a local development environment up and running.

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A PostgreSQL Database (e.g., local PostgreSQL, Supabase, Neon)
- A [Stripe Developer Account](https://stripe.com/)

---

### 1. Backend Setup

First, open your terminal to set up the Express API and connect it to your database.

**Step 1: Clone the repository and install dependencies**
```bash
git clone [https://github.com/Rishad1404/backend-scholar-track.git](https://github.com/Rishad1404/backend-scholar-track.git)
cd backend-scholar-track
npm install
```

**Step 2: Set up environment variables** Create a `.env` file in the root of the `backend-scholar-track` directory and add your credentials:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/scholartrack"
FRONTEND_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
BETTER_AUTH_SECRET="your_secure_random_string"
```

**Step 3: Initialize the database and start the server**
```bash
# Push the Prisma schema to your PostgreSQL database
npx prisma db push

# Generate the Prisma Client
npx prisma generate

# Start the backend development server
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

---

### 2. Frontend Setup

Open a **new terminal window** to set up the Next.js client while keeping the backend running.

**Step 1: Clone the repository and install dependencies**
```bash
git clone [https://github.com/Rishad1404/frontend-scholar-track.git](https://github.com/Rishad1404/frontend-scholar-track.git)
cd frontend-scholar-track
npm install
```

**Step 2: Set up environment variables** Create a `.env.local` file in the root of the `frontend-scholar-track` directory and add your credentials:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Step 3: Start the frontend application**
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:3000`.*

🎉 **You're all set!** Open `http://localhost:3000` in your browser to view and interact with the full-stack application.

---

## 👨‍💻 Author

**Md. Rishad Islam**
- 🌐 [Portfolio](https://rishad-islam.vercel.app)
- 💼 [LinkedIn](https://linkedin.com/in/rishad-islam14)
- 🐙 [GitHub](https://github.com/Rishad1404)
