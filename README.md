<div align="center">

# SamaSalaire

**Modern Payroll & Leave Management System**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

*Streamline payroll processing and leave management for your entire organization.*

</div>

---

## Overview

SamaSalaire is a role-aware HR platform built for speed and clarity. Employees, managers, HR officers, and administrators each get a tailored experience — from submitting leave requests and viewing payslips to processing payroll periods and running organization-wide reports.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | At-a-glance summary of payroll status, leave balances, and recent activity |
| **Employees** | Full employee directory with profile and contract management |
| **Payslips** | Generate, view, and download payslips per payroll period |
| **Leave Requests** | Submit, approve, and track leave with real-time balance updates |
| **Salary Components** | Configure base pay, bonuses, allowances, and deductions |
| **Payroll Periods** | Open, process, and close payroll periods |
| **Reports** | Payroll and leave analytics with export support |
| **Users & Roles** | Role-based access control across all system features |

---

## Role-Based Access

```
Employee   ->  Dashboard, Payslips, Leave Requests
Manager    ->  Everything above
HR         ->  Everything above + Employees, Salary Components, Payroll Periods, Reports
Admin      ->  Full access including Leave Types and User Management
```

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) — fast dev server and optimized builds
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [React Router v7](https://reactrouter.com)

**Data & Forms**
- [TanStack Query v5](https://tanstack.com/query) — server state and caching
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — validated forms

**Tooling**
- ESLint + Prettier for code quality
- TypeScript strict mode throughout

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/utachicodes/SamaSalaire.git
cd SamaSalaire
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run typecheck` | Run TypeScript type-checking without building |

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppShell, AppHeader, AppSidebar
│   ├── shared/       # Reusable patterns (DataTable, EmptyState, ConfirmDialog)
│   └── ui/           # shadcn/ui primitives
├── contexts/         # Auth context
├── hooks/            # React Query data hooks per feature
├── lib/              # API client, auth utilities, error handling
├── pages/            # Feature pages (dashboard, employees, payslips, ...)
├── router/           # Route definitions, ProtectedRoute, RoleGuard
└── types/            # Shared TypeScript types
```

---

## License

Distributed under the [MIT License](LICENSE).
