import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parseISO } from "date-fns"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "../../hooks/use-employees"
import { DataTable } from "../../components/shared/DataTable"
import { StatusBadge } from "../../components/shared/StatusBadge"
import { ConfirmDialog } from "../../components/shared/ConfirmDialog"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import type { Employee, Role } from "../../types"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  hire_date: z.string().min(1),
  job_title: z.string().min(1),
  department: z.string().min(1),
  role: z.enum(["employee", "manager", "hr", "admin"]),
})

type FormValues = z.infer<typeof schema>

export function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees()
  const createEmp = useCreateEmployee()
  const updateEmp = useUpdateEmployee()
  const deleteEmp = useDeleteEmployee()
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const cols = [
    { key: "name", header: "Name", render: (e: Employee) => e.name },
    { key: "email", header: "Email", render: (e: Employee) => e.email },
    { key: "dept", header: "Department", render: (e: Employee) => e.department },
    { key: "title", header: "Job Title", render: (e: Employee) => e.job_title },
    { key: "role", header: "Role", render: (e: Employee) => <Badge variant="secondary">{e.role}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (e: Employee) => <StatusBadge status={e.is_active ? "open" : "closed"} />,
    },
    {
      key: "hire",
      header: "Hired",
      render: (e: Employee) => format(parseISO(e.hire_date), "dd MMM yyyy"),
    },
    {
      key: "actions",
      header: "",
      render: (e: Employee) => (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => setEditTarget(e)}>
            <Pencil className="size-3.5" />
          </Button>
          <ConfirmDialog
            title="Deactivate employee?"
            description={`${e.name} will be marked as inactive.`}
            onConfirm={() => deleteEmp.mutate(e.id)}
            trigger={
              <Button size="icon" variant="ghost">
                <Trash2 className="size-3.5" />
              </Button>
            }
          />
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" /> New Employee
        </Button>
      </div>

      <DataTable columns={cols} data={employees} emptyMessage="No employees found" />

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={async (values) => {
              await createEmp.mutateAsync({ ...values, hire_date: new Date(values.hire_date).toISOString() })
              setCreateOpen(false)
            }}
            isPending={createEmp.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <EmployeeForm
              defaultValues={{
                name: editTarget.name,
                email: editTarget.email,
                hire_date: editTarget.hire_date.slice(0, 10),
                job_title: editTarget.job_title,
                department: editTarget.department,
                role: editTarget.role as Role,
              }}
              onSubmit={async (values) => {
                await updateEmp.mutateAsync({
                  id: editTarget.id,
                  data: { ...values, hire_date: new Date(values.hire_date).toISOString() },
                })
                setEditTarget(null)
              }}
              isPending={updateEmp.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmployeeForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: FormValues
  onSubmit: (v: FormValues) => Promise<void>
  isPending: boolean
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      hire_date: "",
      job_title: "",
      department: "",
      role: "employee",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="job_title" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="department" render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="hire_date" render={({ field }) => (
            <FormItem>
              <FormLabel>Hire Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(["employee", "manager", "hr", "admin"] as const).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  )
}
