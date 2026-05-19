import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parseISO, differenceInCalendarDays } from "date-fns"
import { Plus, Check, X } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { useLeaveRequests, useCreateLeaveRequest, useDecideLeaveRequest } from "../../hooks/use-leave-requests"
import { useLeaveTypes } from "../../hooks/use-leave-types"
import { useLeaveBalances } from "../../hooks/use-leave-balances"
import { DataTable } from "../../components/shared/DataTable"
import { StatusBadge } from "../../components/shared/StatusBadge"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import type { LeaveRequest } from "../../types"

const schema = z.object({
  leave_type_id: z.string().min(1, "Select a leave type"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
})

type FormValues = z.infer<typeof schema>

export function LeaveRequestsPage() {
  const { role, user } = useAuth()
  const canApprove = role === "manager" || role === "hr" || role === "admin"

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My Requests</TabsTrigger>
          {canApprove && <TabsTrigger value="queue">Approval Queue</TabsTrigger>}
        </TabsList>
        <TabsContent value="mine" className="mt-4">
          <MyRequestsTab employeeId={user?.employee_id ?? ""} />
        </TabsContent>
        {canApprove && (
          <TabsContent value="queue" className="mt-4">
            <ApprovalQueueTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function MyRequestsTab({ employeeId }: { employeeId: string }) {
  const { data: requests = [], isLoading } = useLeaveRequests()
  const [open, setOpen] = useState(false)

  const cols = [
    { key: "type", header: "Leave Type", render: (r: LeaveRequest) => r.leave_type_id.slice(-6) },
    { key: "start", header: "Start", render: (r: LeaveRequest) => format(parseISO(r.start_date), "dd MMM yyyy") },
    { key: "end", header: "End", render: (r: LeaveRequest) => format(parseISO(r.end_date), "dd MMM yyyy") },
    {
      key: "days",
      header: "Days",
      render: (r: LeaveRequest) => differenceInCalendarDays(parseISO(r.end_date), parseISO(r.start_date)) + 1,
    },
    { key: "reason", header: "Reason", render: (r: LeaveRequest) => r.reason },
    { key: "status", header: "Status", render: (r: LeaveRequest) => <StatusBadge status={r.status} /> },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
            </DialogHeader>
            <LeaveRequestForm employeeId={employeeId} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={cols} data={requests} emptyMessage="No leave requests yet" />
    </div>
  )
}

function LeaveRequestForm({ employeeId, onSuccess }: { employeeId: string; onSuccess: () => void }) {
  const { data: leaveTypes = [] } = useLeaveTypes()
  const { data: balances = [] } = useLeaveBalances(employeeId)
  const create = useCreateLeaveRequest()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { leave_type_id: "", start_date: "", end_date: "", reason: "" },
  })

  const selectedTypeId = form.watch("leave_type_id")
  const balance = balances.find((b) => b.leave_type_id === selectedTypeId)

  async function onSubmit(values: FormValues) {
    await create.mutateAsync({
      leave_type_id: values.leave_type_id,
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
      reason: values.reason,
    })
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="leave_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map((lt) => (
                    <SelectItem key={lt.id} value={lt.id}>
                      {lt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {balance && (
                <p className="text-muted-foreground text-xs">
                  Balance: {balance.remaining_days} days remaining
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Reason for leave..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={create.isPending}>
          {create.isPending ? "Submitting…" : "Submit Request"}
        </Button>
      </form>
    </Form>
  )
}

function ApprovalQueueTab() {
  const { data: requests = [], isLoading } = useLeaveRequests({ status: "pending" })
  const decide = useDecideLeaveRequest()

  const cols = [
    { key: "emp", header: "Employee", render: (r: LeaveRequest) => r.employee_id.slice(-6) },
    { key: "start", header: "Start", render: (r: LeaveRequest) => format(parseISO(r.start_date), "dd MMM yyyy") },
    { key: "end", header: "End", render: (r: LeaveRequest) => format(parseISO(r.end_date), "dd MMM yyyy") },
    {
      key: "days",
      header: "Days",
      render: (r: LeaveRequest) => differenceInCalendarDays(parseISO(r.end_date), parseISO(r.start_date)) + 1,
    },
    { key: "reason", header: "Reason", render: (r: LeaveRequest) => r.reason },
    { key: "status", header: "Status", render: (r: LeaveRequest) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (r: LeaveRequest) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => decide.mutate({ id: r.id, status: "approved" })}
            disabled={decide.isPending}
          >
            <Check className="size-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => decide.mutate({ id: r.id, status: "rejected" })}
            disabled={decide.isPending}
          >
            <X className="size-3" />
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />
  return <DataTable columns={cols} data={requests} emptyMessage="No pending requests" />
}
