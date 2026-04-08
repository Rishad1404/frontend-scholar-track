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

Follow these instructions to set up the project locally.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL Database (e.g., Supabase, Neon)
- A [Stripe Developer Account](https://stripe.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Rishad1404/frontend-scholar-track.git
cd scholartrack
