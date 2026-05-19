import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Plus, Play, Lock } from "lucide-react"
import {
  usePayrollPeriods,
  useCreatePayrollPeriod,
  useRunPayroll,
  useFinalizePeriod,
} from "../../hooks/use-payroll-periods"
import { DataTable } from "../../components/shared/DataTable"
import { StatusBadge } from "../../components/shared/StatusBadge"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { ConfirmDialog } from "../../components/shared/ConfirmDialog"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import type { PayrollPeriod } from "../../types"

export function PayrollPeriodsPage() {
  const { data: periods = [], isLoading } = usePayrollPeriods()
  const createPeriod = useCreatePayrollPeriod()
  const runPayroll = useRunPayroll()
  const finalize = useFinalizePeriod()
  const [createOpen, setCreateOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const cols = [
    { key: "start", header: "Start Date", render: (p: PayrollPeriod) => format(parseISO(p.start_date), "dd MMM yyyy") },
    { key: "end", header: "End Date", render: (p: PayrollPeriod) => format(parseISO(p.end_date), "dd MMM yyyy") },
    { key: "status", header: "Status", render: (p: PayrollPeriod) => <StatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (p: PayrollPeriod) => (
        <div className="flex gap-2">
          {p.status === "open" && (
            <>
              <ConfirmDialog
                title="Run payroll?"
                description="This will compute payslips for all active employees."
                onConfirm={() => runPayroll.mutate(p.id)}
                trigger={
                  <Button size="sm" variant="outline" disabled={runPayroll.isPending}>
                    <Play className="mr-1 size-3" /> Run
                  </Button>
                }
              />
              <ConfirmDialog
                title="Finalize period?"
                description="Once finalized the period will be closed and cannot be re-run."
                onConfirm={() => finalize.mutate(p.id)}
                trigger={
                  <Button size="sm" variant="outline" disabled={finalize.isPending}>
                    <Lock className="mr-1 size-3" /> Finalize
                  </Button>
                }
              />
            </>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" /> New Period
        </Button>
      </div>
      <DataTable columns={cols} data={periods} emptyMessage="No payroll periods created yet" />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Payroll Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!startDate || !endDate || createPeriod.isPending}
              onClick={async () => {
                await createPeriod.mutateAsync({
                  start_date: new Date(startDate).toISOString(),
                  end_date: new Date(endDate).toISOString(),
                })
                setCreateOpen(false)
                setStartDate("")
                setEndDate("")
              }}
            >
              {createPeriod.isPending ? "Creating…" : "Create Period"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
