import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { RoleGuard } from "./RoleGuard"
import { AppShell } from "../components/layout/AppShell"
import { AuthProvider } from "../contexts/auth-context"
import { LoginPage } from "../pages/login/LoginPage"
import { DashboardPage } from "../pages/dashboard/DashboardPage"
import { LeaveRequestsPage } from "../pages/leave-requests/LeaveRequestsPage"
import { PayslipsPage } from "../pages/payslips/PayslipsPage"
import { EmployeesPage } from "../pages/employees/EmployeesPage"
import { SalaryComponentsPage } from "../pages/salary-components/SalaryComponentsPage"
import { PayrollPeriodsPage } from "../pages/payroll-periods/PayrollPeriodsPage"
import { ReportsPage } from "../pages/reports/ReportsPage"
import { LeaveTypesPage } from "../pages/leave-types/LeaveTypesPage"
import { UsersPage } from "../pages/users/UsersPage"

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                path: "/",
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
              {
                path: "/leave-requests",
                element: <LeaveRequestsPage />,
              },
              {
                path: "/payslips",
                element: <PayslipsPage />,
              },
              {
                element: <RoleGuard roles={["hr", "admin"]} />,
                children: [
                  {
                    path: "/employees",
                    element: <EmployeesPage />,
                  },
                  {
                    path: "/salary-components",
                    element: <SalaryComponentsPage />,
                  },
                  {
                    path: "/payroll-periods",
                    element: <PayrollPeriodsPage />,
                  },
                  {
                    path: "/reports",
                    element: <ReportsPage />,
                  },
                ],
              },
              {
                element: <RoleGuard roles={["admin"]} />,
                children: [
                  {
                    path: "/leave-types",
                    element: <LeaveTypesPage />,
                  },
                  {
                    path: "/users",
                    element: <UsersPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
