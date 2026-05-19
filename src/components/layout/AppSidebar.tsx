import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
  ClipboardList,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import type { Role } from "../../types"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "hr", "admin"] },
  { label: "Leave Requests", href: "/leave-requests", icon: CalendarDays, roles: ["employee", "manager", "hr", "admin"] },
  { label: "Payslips", href: "/payslips", icon: Wallet, roles: ["employee", "manager", "hr", "admin"] },
  { label: "Employees", href: "/employees", icon: Users, roles: ["hr", "admin"] },
  { label: "Salary Components", href: "/salary-components", icon: DollarSign, roles: ["hr", "admin"] },
  { label: "Payroll Periods", href: "/payroll-periods", icon: BriefcaseBusiness, roles: ["hr", "admin"] },
  { label: "Reports", href: "/reports", icon: BarChart3, roles: ["hr", "admin"] },
  { label: "Leave Types", href: "/leave-types", icon: ClipboardList, roles: ["admin"] },
  { label: "Users & Roles", href: "/users", icon: Settings, roles: ["admin"] },
]

const roleLabels: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR Officer",
  admin: "Administrator",
}

export function AppSidebar() {
  const { user, role, logout } = useAuth()
  const visibleItems = navItems.filter((item) => role && item.roles.includes(role))

  const generalItems = visibleItems.filter((i) => ["/dashboard"].includes(i.href))
  const workItems = visibleItems.filter((i) => ["/leave-requests", "/payslips"].includes(i.href))
  const hrItems = visibleItems.filter((i) => ["/employees", "/salary-components", "/payroll-periods", "/reports"].includes(i.href))
  const adminItems = visibleItems.filter((i) => ["/leave-types", "/users"].includes(i.href))

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Wallet className="text-primary size-6" />
          <span className="text-lg font-bold">SamaSalaire</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="General" items={generalItems} />
        {workItems.length > 0 && <NavGroup label="My Work" items={workItems} />}
        {hrItems.length > 0 && <NavGroup label="HR Operations" items={hrItems} />}
        {adminItems.length > 0 && <NavGroup label="Administration" items={adminItems} />}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {user?.user_id.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{role ? roleLabels[role] : ""}</span>
            <Badge variant="secondary" className="w-fit text-xs">{role}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  if (items.length === 0) return null
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
                  }
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
