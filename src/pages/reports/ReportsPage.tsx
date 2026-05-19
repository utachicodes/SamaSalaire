import { useState } from "react"
import { usePayrollSummary, useLeaveSummary } from "../../hooks/use-reports"
import { usePayrollPeriods } from "../../hooks/use-payroll-periods"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { EmptyState } from "../../components/shared/EmptyState"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { format, parseISO } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function ReportsPage() {
  return (
    <Tabs defaultValue="payroll">
      <TabsList>
        <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
        <TabsTrigger value="leave">Leave Summary</TabsTrigger>
      </TabsList>
      <TabsContent value="payroll" className="mt-6">
        <PayrollSummaryTab />
      </TabsContent>
      <TabsContent value="leave" className="mt-6">
        <LeaveSummaryTab />
      </TabsContent>
    </Tabs>
  )
}

function PayrollSummaryTab() {
  const { data: periods = [] } = usePayrollPeriods()
  const [periodId, setPeriodId] = useState<string>("")
  const { data: summary = [], isLoading } = usePayrollSummary(periodId || undefined)

  const row = summary[0] as Record<string, number> | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={periodId} onValueChange={setPeriodId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a period (all if empty)" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {format(parseISO(p.start_date), "dd MMM yyyy")} — {format(parseISO(p.end_date), "dd MMM yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : summary.length === 0 ? (
        <EmptyState title="No payroll data" description="Run payroll first to see summary data." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard title="Employees" value={String(row?.employee_count ?? 0)} />
          <StatCard title="Total Gross" value={(Number(row?.total_gross ?? 0)).toLocaleString("fr-SN") + " FCFA"} />
          <StatCard title="Total Deductions" value={(Number(row?.total_deductions ?? 0)).toLocaleString("fr-SN") + " FCFA"} />
          <StatCard title="Total Net" value={(Number(row?.total_net ?? 0)).toLocaleString("fr-SN") + " FCFA"} />
        </div>
      )}
    </div>
  )
}

function LeaveSummaryTab() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const { data: summary = [], isLoading } = useLeaveSummary(year)

  const chartData = summary.map((s) => {
    const id = s._id as Record<string, string>
    return {
      name: `${id?.status ?? ""} / ${id?.leave_type_id?.toString().slice(-4) ?? ""}`,
      count: s.count as number,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : summary.length === 0 ? (
        <EmptyState title="No leave data" description="No leave requests found for the selected year." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Requests by Type & Status — {year}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
