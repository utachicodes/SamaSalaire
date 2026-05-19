import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil } from "lucide-react"
import { useLeaveTypes, useCreateLeaveType, useUpdateLeaveType } from "../../hooks/use-leave-types"
import { DataTable } from "../../components/shared/DataTable"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import type { LeaveType } from "../../types"

const schema = z.object({
  name: z.string().min(1),
  annual_entitlement: z.coerce.number().positive(),
  allows_negative: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function LeaveTypesPage() {
  const { data: types = [], isLoading } = useLeaveTypes()
  const createType = useCreateLeaveType()
  const updateType = useUpdateLeaveType()
  const [editTarget, setEditTarget] = useState<LeaveType | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const cols = [
    { key: "name", header: "Name", render: (t: LeaveType) => t.name },
    { key: "entitlement", header: "Annual Days", render: (t: LeaveType) => t.annual_entitlement },
    {
      key: "negative",
      header: "Allows Negative",
      render: (t: LeaveType) => (t.allows_negative ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "",
      render: (t: LeaveType) => (
        <Button size="icon" variant="ghost" onClick={() => setEditTarget(t)}>
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
          <Plus className="mr-2 size-4" /> New Leave Type
        </Button>
      </div>
      <DataTable columns={cols} data={types} emptyMessage="No leave types defined" />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Leave Type</DialogTitle></DialogHeader>
          <LeaveTypeForm
            onSubmit={async (v) => { await createType.mutateAsync(v); setCreateOpen(false) }}
            isPending={createType.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Leave Type</DialogTitle></DialogHeader>
          {editTarget && (
            <LeaveTypeForm
              defaultValues={{
                name: editTarget.name,
                annual_entitlement: editTarget.annual_entitlement,
                allows_negative: editTarget.allows_negative,
              }}
              onSubmit={async (v) => {
                await updateType.mutateAsync({ id: editTarget.id, data: v })
                setEditTarget(null)
              }}
              isPending={updateType.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LeaveTypeForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: FormValues
  onSubmit: (v: FormValues) => Promise<void>
  isPending: boolean
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: defaultValues ?? { name: "", annual_entitlement: 21, allows_negative: false },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input placeholder="e.g. Annual Leave" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="annual_entitlement" render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Entitlement (days)</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="allows_negative" render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="!mt-0">Allow negative balance</FormLabel>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  )
}
