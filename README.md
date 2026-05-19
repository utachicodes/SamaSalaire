<div align="center">

# 💰 SamaSalaire

**Modern Payroll & Leave Management System**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

*Streamline your organization's payroll processing and leave management in one place.*

</div>

---

## Overview

SamaSalaire is a full-featured HR platform that gives each role — employee, manager, HR officer, and admin — a tailored experience. From submitting leave requests to generating payslips and running payroll reports, everything is handled in a clean, fast interface.

## Features

| Module | Description |
|---|---|
| **Dashboard** | At-a-glance overview of payroll status, leave balances, and recent activity |
| **Employees** | Full employee directory with profile and contract management |
| **Payslips** | Generate, view, and download payslips per period |
| **Leave Requests** | Submit, approve, and track leave requests with balance tracking |
| **Salary Components** | Configure base pay, bonuses, deductions, and allowances |
| **Payroll Periods** | Open, process, and close payroll periods |
| **Reports** | Exportable payroll and leave analytics |
| **Users & Roles** | Role-based access control for all system users |

## Role-Based Access

```
Employee  →  Dashboard · Payslips · Leave Requests
Manager   →  Everything above
HR        →  Everything above + Employees · Salary Components · Payroll Periods · Reports
Admin     →  Full access including Leave Types and User Management
```

## Tech Stack

**Frontend**
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) — lightning-fast dev server and build tool
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [React Router v7](https://reactrouter.com)

**Data & Forms**
- [TanStack Query v5](https://tanstack.com/query) — server state management
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — form validation

**Tooling**
- ESLint + Prettier — code quality and formatting
- TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/utachicodes/SamaSalaire.git
cd SamaSalaire

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Type-check and build for production
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run format     # Format all files with Prettier
npm run typecheck  # Run TypeScript type-checking without building
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppShell, AppHeader, AppSidebar
│   ├── shared/       # Reusable UI patterns (DataTable, EmptyState, …)
│   └── ui/           # shadcn/ui primitives
├── contexts/         # Auth context
├── hooks/            # React Query data hooks
├── lib/              # API client, auth utils, error handling
├── pages/            # Feature pages (dashboard, employees, payslips, …)
├── router/           # Route definitions and guards
└── types/            # Shared TypeScript types
```

## License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with care for teams that deserve better payroll tooling.</sub>
</div>
