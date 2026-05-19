import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import type { Role } from "../types"

interface Props {
  roles: Role[]
}

export function RoleGuard({ roles }: Props) {
  const { role } = useAuth()
  if (!role || !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
