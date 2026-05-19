import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil } from "lucide-react"
import { useUsers, useCreateUser, useUpdateUser } from "../../hooks/use-users"
import { useEmployees } from "../../hooks/use-employees"
import { DataTable } from "../../components/shared/DataTable"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import type { User } from "../../types"

const createSchema = z.object({
  employee_id: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(4),
  role: z.enum(["employee", "manager", "hr", "admin"]),
})

const updateSchema = z.object({
  role: z.enum(["employee", "manager", "hr", "admin"]),
  password: z.string().optional(),
})

type CreateValues = z.infer<typeof createSchema>
type UpdateValues = z.infer<typeof updateSchema>

export function UsersPage() {
  const { data: users = [], isLoading } = useUsers()
  const { data: employees = [] } = useEmployees()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e.name]))

  const cols = [
    { key: "username", header: "Username", render: (u: User) => u.username },
    {
      key: "employee",
      header: "Employee",
      render: (u: User) => employeeMap[u.employee_id] ?? u.employee_id.slice(-6),
    },
    { key: "role", header: "Role", render: (u: User) => <Badge variant="secondary">{u.role}</Badge> },
    {
      key: "actions",
      header: "",
      render: (u: User) => (
        <Button size="icon" variant="ghost" onClick={() => setEditTarget(u)}>
          <Pencil className="size-3.5" />
        </Button>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" /> New User
        </Button>
      </div>
      <DataTable columns={cols} data={users} emptyMessage="No users found" />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New User</DialogTitle></DialogHeader>
          <CreateUserForm
            employees={employees}
            onSubmit={async (v) => { await createUser.mutateAsync(v); setCreateOpen(false) }}
            isPending={createUser.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {editTarget && (
            <UpdateUserForm
              defaultRole={editTarget.role}
              onSubmit={async (v) => {
                const data: { role?: string; password?: string } = { role: v.role }
                if (v.password) data.password = v.password
                await updateUser.mutateAsync({ id: editTarget.id, data })
                setEditTarget(null)
              }}
              isPending={updateUser.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateUserForm({
  employees,
  onSubmit,
  isPending,
}: {
  employees: { id: string; name: string }[]
  onSubmit: (v: CreateValues) => Promise<void>
  isPending: boolean
}) {
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { employee_id: "", username: "", password: "", role: "employee" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="employee_id" render={({ field }) => (
          <FormItem>
            <FormLabel>Employee</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger></FormControl>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                {(["employee", "manager", "hr", "admin"] as const).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating…" : "Create User"}
        </Button>
      </form>
    </Form>
  )
}

function UpdateUserForm({
  defaultRole,
  onSubmit,
  isPending,
}: {
  defaultRole: string
  onSubmit: (v: UpdateValues) => Promise<void>
  isPending: boolean
}) {
  const form = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { role: defaultRole as UpdateValues["role"], password: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                {(["employee", "manager", "hr", "admin"] as const).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>New Password (leave blank to keep)</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
