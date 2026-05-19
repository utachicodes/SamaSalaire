import { format, parseISO } from "date-fns"
import { useAuth } from "../../contexts/auth-context"
import { useLeaveBalances } from "../../hooks/use-leave-balances"
import { useLeaveRequests } from "../../hooks/use-leave-requests"
import { usePayslips } from "../../hooks/use-payslips"
import { useEmployees } from "../../hooks/use-employees"
import { usePayrollPeriods } from "../../hooks/use-payroll-periods"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { StatusBadge } from "../../components/shared/StatusBadge"
import { DataTable } from "../../components/shared/DataTable"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import type { LeaveRequest } from "../../types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function DashboardPage() {
  const { role, user } = useAuth()

  if (!user) return <LoadingSpinner />

  if (role === "hr" || role === "admin") return <HRDashboard />
  if (role === "manager") return <ManagerDashboard employeeId={user.employee_id} />
  return <EmployeeDashboard employeeId={user.employee_id} />
}

function StatCard({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {sub && <p className="text-muted-foreground mt-1 text-xs">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function EmployeeDashboard({ employeeId }: { employeeId: string }) {
  const { data: balances = [] } = useLeaveBalances(employeeId)
  const { data: payslips = [] } = usePayslips()
  const { data: requests = [] } = useLeaveRequests()
  const pendingCount = requests.filter((r) => r.status === "pending").length
  const totalDays = balances.reduce((s, b) => s + b.remaining_days, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Leave Days Remaining" value={totalDays} sub="across all leave types" />
        <StatCard title="Pending Requests" value={pendingCount} />
        <StatCard title="Total Payslips" value={payslips.length} />
      </div>
    </div>
  )
}

function ManagerDashboard({ employeeId }: { employeeId: string }) {
  const { data: requests = [] } = useLeaveRequests({ status: "pending" })
  const { data: balances = [] } = useLeaveBalances(employeeId)
  const totalDays = balances.reduce((s, b) => s + b.remaining_days, 0)

  const cols = [
    { key: "employee", header: "Employee", render: (r: LeaveRequest) => r.employee_id.slice(-6) },
    { key: "start", header: "Start", render: (r: LeaveRequest) => format(parseISO(r.start_date), "dd MMM yyyy") },
    { key: "end", header: "End", render: (r: LeaveRequest) => format(parseISO(r.end_date), "dd MMM yyyy") },
    { key: "status", header: "Status", render: (r: LeaveRequest) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard title="Pending Approvals" value={requests.length} sub="waiting for your decision" />
        <StatCard title="Your Leave Days Remaining" value={totalDays} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={cols} data={requests} emptyMessage="No pending requests" />
        </CardContent>
      </Card>
    </div>
  )
}

function HRDashboard() {
  const { data: employees = [] } = useEmployees()
  const { data: periods = [] } = usePayrollPeriods()
  const { data: requests = [] } = useLeaveRequests({ status: "pending" })
  const { data: payslips = [] } = usePayslips()
  const openPeriods = periods.filter((p) => p.status === "open").length

  const chartData = periods.slice(-6).map((p) => {
    const periodPayslips = payslips.filter((ps) => ps.period_id === p.id)
    const netTotal = periodPayslips.reduce((s, ps) => s + ps.net_pay, 0)
    return {
      name: format(parseISO(p.start_date), "MMM yy"),
      net: Math.round(netTotal),
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Active Employees" value={employees.length} />
        <StatCard title="Open Payroll Periods" value={openPeriods} />
        <StatCard title="Pending Leave Requests" value={requests.length} />
      </div>
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Net Pay by Period (last 6)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => Number(v).toLocaleString("fr-SN") + " FCFA"} />
                <Bar dataKey="net" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
