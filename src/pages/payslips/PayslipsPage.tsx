import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Eye, Printer } from "lucide-react"
import { usePayslips } from "../../hooks/use-payslips"
import { DataTable } from "../../components/shared/DataTable"
import { LoadingSpinner } from "../../components/shared/LoadingSpinner"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import type { Payslip } from "../../types"

export function PayslipsPage() {
  const { data: payslips = [], isLoading } = usePayslips()
  const [selected, setSelected] = useState<Payslip | null>(null)

  const cols = [
    { key: "period", header: "Period ID", render: (p: Payslip) => p.period_id.slice(-8) },
    {
      key: "gross",
      header: "Gross Pay",
      render: (p: Payslip) => p.gross_pay.toLocaleString("fr-SN") + " FCFA",
    },
    {
      key: "deductions",
      header: "Deductions",
      render: (p: Payslip) => p.deductions.toLocaleString("fr-SN") + " FCFA",
    },
    {
      key: "net",
      header: "Net Pay",
      render: (p: Payslip) => (
        <span className="font-semibold">{p.net_pay.toLocaleString("fr-SN")} FCFA</span>
      ),
    },
    {
      key: "date",
      header: "Generated",
      render: (p: Payslip) => format(parseISO(p.generated_at), "dd MMM yyyy"),
    },
    {
      key: "actions",
      header: "",
      render: (p: Payslip) => (
        <Button size="sm" variant="ghost" onClick={() => setSelected(p)}>
          <Eye className="size-4" />
        </Button>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <DataTable columns={cols} data={payslips} emptyMessage="No payslips available yet" />
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payslip Detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <PayslipDetail payslip={selected} onClose={() => setSelected(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PayslipDetail({ payslip, onClose }: { payslip: Payslip; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pay Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Pay</span>
            <span>{payslip.gross_pay.toLocaleString("fr-SN")} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deductions</span>
            <span className="text-destructive">-{payslip.deductions.toLocaleString("fr-SN")} FCFA</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Net Pay</span>
            <span>{payslip.net_pay.toLocaleString("fr-SN")} FCFA</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Generated: {format(parseISO(payslip.generated_at), "dd MMM yyyy HH:mm")}
          </p>
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onClose()
          setTimeout(() => window.print(), 100)
        }}
      >
        <Printer className="mr-2 size-4" /> Print
      </Button>
    </div>
  )
}
