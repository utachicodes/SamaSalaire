import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"
import { useEmployees } from "../../hooks/use-employees"
import {
  useSalaryComponents,
  useCreateSalaryComponent,
  useDeleteSalaryComponent,
} from "../../hooks/use-salary-components"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { EmptyState } from "../../components/shared/EmptyState"
import { ConfirmDialog } from "../../components/shared/ConfirmDialog"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import type { SalaryComponent } from "../../types"

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["earning", "deduction"]),
  amount: z.coerce.number().positive(),
})

type FormValues = z.infer<typeof schema>

export function SalaryComponentsPage() {
  const { data: employees = [], isLoading: empLoading } = useEmployees()
  const [selectedEmpId, setSelectedEmpId] = useState("")
  const { data: components = [], isLoading: compLoading } = useSalaryComponents(selectedEmpId)
  const createComp = useCreateSalaryComponent()
  const deleteComp = useDeleteSalaryComponent()
  const [addOpen, setAddOpen] = useState(false)

  const earnings = components.filter((c) => c.type === "earning")
  const deductions = components.filter((c) => c.type === "deduction")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { name: "", type: "earning", amount: 0 },
  })

  async function onSubmit(values: FormValues) {
    await createComp.mutateAsync({ ...values, employee_id: selectedEmpId })
    form.reset()
    setAddOpen(false)
  }

  if (empLoading) return <LoadingSpinner />

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-2">
        <h2 className="text-sm font-medium">Select Employee</h2>
        <div className="flex flex-col gap-1">
          {employees.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEmpId(e.id)}
              className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedEmpId === e.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {e.name}
              <span className="text-muted-foreground ml-2 text-xs">{e.department}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 lg:col-span-2">
        {!selectedEmpId ? (
          <EmptyState title="Select an employee" description="Choose an employee from the left to view their salary components." />
        ) : compLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Salary Components</h2>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="mr-1 size-4" /> Add
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-green-600">Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {earnings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No earnings configured</p>
                ) : (
                  earnings.map((c) => (
                    <ComponentRow key={c.id} comp={c} onDelete={() => deleteComp.mutate({ id: c.id, employeeId: selectedEmpId })} />
                  ))
                )}
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Earnings</span>
                  <span>{earnings.reduce((s, c) => s + c.amount, 0).toLocaleString("fr-SN")} FCFA</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-red-600">Deductions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {deductions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No deductions configured</p>
                ) : (
                  deductions.map((c) => (
                    <ComponentRow key={c.id} comp={c} onDelete={() => deleteComp.mutate({ id: c.id, employeeId: selectedEmpId })} />
                  ))
                )}
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Deductions</span>
                  <span>{deductions.reduce((s, c) => s + c.amount, 0).toLocaleString("fr-SN")} FCFA</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Net Pay</span>
                  <span>
                    {(earnings.reduce((s, c) => s + c.amount, 0) - deductions.reduce((s, c) => s + c.amount, 0)).toLocaleString("fr-SN")} FCFA
                  </span>
                </div>
              </CardContent>
            </Card>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Salary Component</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="e.g. Base Salary" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="earning">Earning</SelectItem>
                              <SelectItem value="deduction">Deduction</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (FCFA)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createComp.isPending}>
                      {createComp.isPending ? "Adding…" : "Add Component"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}

function ComponentRow({ comp, onDelete }: { comp: SalaryComponent; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{comp.name}</span>
      <div className="flex items-center gap-2">
        <span>{comp.amount.toLocaleString("fr-SN")} FCFA</span>
        <ConfirmDialog
          title="Delete component?"
          description={`Remove "${comp.name}" from this employee's salary?`}
          onConfirm={onDelete}
          trigger={
            <Button size="icon" variant="ghost" className="size-6">
              <Trash2 className="size-3" />
            </Button>
          }
        />
      </div>
    </div>
  )
}
