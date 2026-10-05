<h1 align="center">🚀 Employee Master – Frontend</h1>

<p align="center">
  <b>React + TypeScript frontend for centralized employee management.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  Frontend of the <b>Employee Master</b> project built using <b>React, TypeScript, Vite, Material UI, Redux Toolkit, React Hook Form and Yup</b>, deployed on <b>Vercel</b>.
</p>

> 🔗 The Spring Boot microservices backend lives in a **separate repository**: `employee-master-backend`.

---

## 📑 Table of Contents

<details open>
<summary><b>Click to expand/collapse</b></summary>

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Application Flow](#4-application-flow)
5. [Authentication Flow](#5-authentication-flow)
6. [Employee Module](#6-employee-module)
7. [Forms & Validation](#7-forms--validation)
8. [State Management](#8-state-management)
9. [API Integration](#9-api-integration)
10. [Project Structure](#10-project-structure)
11. [Local Development](#11-local-development)
12. [Environment Configuration](#12-environment-configuration)
13. [Vercel Deployment](#13-vercel-deployment)
14. [Backend Connection](#14-backend-connection)
15. [Security Notes](#15-security-notes)
16. [Related Repositories](#16-related-repositories)
17. [Conclusion](#17-conclusion)

</details>

---

## 1. Project Overview

The **Employee Master Frontend** is a React + TypeScript single-page application used to manage employees. It provides login, a dashboard, and the Employee Master module with add/update forms, filters and an activity dashboard.

> The frontend talks to the backend only through the **API Gateway**.

---

## 2. Key Features

<details>
<summary><b>🔐 Authentication</b></summary>

- Login page
- JWT-based session
- JWT attached to protected API requests

</details>

<details>
<summary><b>👤 Employee Management</b></summary>

- Add employees using an array form (multiple employees)
- Update employee form
- Employee activity dashboard (table view)
- Search, filter, sort and pagination
- Dropdowns loaded from backend master data

</details>

<details>
<summary><b>📊 Excel</b></summary>

- Download employee import template
- Upload employee Excel file
- Export employee data

</details>

<details>
<summary><b>✅ Forms & Validation</b></summary>

- React Hook Form (array form)
- Yup schema validation
- Invalid values are blocked before submit

</details>

<details>
<summary><b>🎨 UI</b></summary>

- Material UI components and theme
- Reusable components
- Responsive layout

</details>

---

## 3. Technology Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React, TypeScript, Vite |
| **UI** | Material UI (MUI), React Material Table, amCharts, ReactCharts |
| **State** | Redux Toolkit |
| **Forms** | React Hook Form, Yup |
| **API** | Axios |
| **Deployment** | Vercel, GitHub |

---

## 4. Application Flow

<pre>
User
  │
  ▼
React Frontend (Vercel)
  │
  ▼
Axios API calls
  │
  ▼
API Gateway
  │
  ├── Auth APIs ──────► Auth Service
  ├── Dropdown APIs ──► Dropdown Service
  └── Employee APIs ──► Employee Service
</pre>

---

## 5. Authentication Flow

<pre>
Login Page (login.tsx)
  │
  ▼
authApi.ts ──► API Gateway ──► Auth Service
  │
  ▼
JWT Token returned
  │
  ▼
Stored on frontend
  │
  ▼
Sent with every protected request
</pre>

---

## 6. Employee Module

Located in `src/apps/pages/employee-master/`.

| File | Purpose |
|------|---------|
| `employee-activity-dashboard.tsx` | Main employee list / activity dashboard |
| `employee-filters.tsx` | Search and filter panel |
| `add-employee-array-form.tsx` | Add one or many employees |
| `update-employee-form.tsx` | Update an employee |
| `employee-validation.ts` | Yup validation schemas |
| `employeeApi.ts` | Employee API calls |
| `employeeTypes.ts` | TypeScript types |

---

## 7. Forms & Validation

<pre>
Form input
   │
   ▼
React Hook Form
   │
   ▼
Yup validation (employee-validation.ts)
   │
   ├── Invalid ──► Error shown, submit blocked
   │
   └── Valid ────► API call
</pre>

---

## 8. State Management

**Redux Toolkit** is used for application state. Store setup is inside `src/apps/store/`.

---

## 9. API Integration

- API calls are kept in feature-wise files (`authApi.ts`, `employeeApi.ts`) and the shared `src/api/` folder.
- Axios sends requests to the Gateway (through the Vercel rewrite) and attaches the JWT for protected requests.
- All requests go through the **API Gateway**.

---

## 10. Project Structure

<pre>
employee-master-ui/
│
├── .vercel/
├── dist/
├── public/
│
├── src/
│   ├── api/
│   ├── apps/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── authApi.ts
│   │   │   │   └── login.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── main-dashboard.tsx
│   │   │   └── employee-master/
│   │   │       ├── add-employee-array-form.tsx
│   │   │       ├── employee-activity-dashboard.tsx
│   │   │       ├── employee-filters.tsx
│   │   │       ├── employee-validation.ts
│   │   │       ├── employeeApi.ts
│   │   │       ├── employeeTypes.ts
│   │   │       └── update-employee-form.tsx
│   │   ├── hooks/
│   │   └── store/
│   ├── theme/
│   ├── App.tsx
│   └── main.tsx
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
</pre>

---

## 11. Local Development

**Prerequisites:** Node.js and npm. Backend should be running (or reachable).

<pre>
npm install
npm run dev
</pre>

App runs at `http://localhost:5173`.

**Build for production:**

<pre>
npm run build
</pre>

---

## 12. Environment Configuration

- `.env.local` is created automatically by the **Vercel CLI** (`vercel env pull`) and holds a Vercel-generated token (`VERCEL_OIDC_TOKEN`). It is **not** an application setting.
- The backend API URL is **not** kept in `.env.local`. API requests go through the **Vercel rewrite** configured in `vercel.json`, which forwards them to the backend API Gateway.

> ⚠️ `.env.local` must stay in `.gitignore`. Never commit it, and never paste token values into the README or GitHub.

---

## 13. Vercel Deployment

<pre>
Browser
   │
   ▼
Vercel Frontend
   │
   ▼
Vercel API Rewrite (vercel.json)
   │
   ▼
AWS EC2 API Gateway
   │
   ▼
Backend Microservices
</pre>

- The frontend is deployed on **Vercel** straight from GitHub.
- `vercel.json` rewrites API requests to the backend API Gateway.

---

## 14. Backend Connection

Backend repository: `employee-master-backend`

| Service | Port |
|---------|-----:|
| API Gateway | 8081 |
| Auth Service | 8082 |
| Dropdown Service | 8083 |
| Employee Service | 8084 |

The frontend only calls the **API Gateway**.

---

## 15. Security Notes

- 🔒 Never commit `.env.local` or secrets.
- 🎫 JWT is sent only for protected APIs.
- 🌐 Backend services are not exposed directly to the frontend.

---

## 16. Related Repositories

| Repository | Description |
|------------|-------------|
| `employee-master-ui` | React + TypeScript frontend (this repo) |
| `employee-master-backend` | Spring Boot microservices backend |

---

## 17. Conclusion

The **Employee Master Frontend** provides:

- ⚛️ React + TypeScript + Vite
- 🎨 Material UI interface
- 🗂️ Redux Toolkit state management
- ✅ React Hook Form + Yup validation
- 🔐 JWT login via API Gateway
- ▲ Vercel deployment

---

<p align="center">
  <b>⭐ If you like this project, give it a star on GitHub! ⭐</b>
</p>