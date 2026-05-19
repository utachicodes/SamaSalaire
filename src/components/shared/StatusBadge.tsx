import { Badge } from "../ui/badge"

type Status = "pending" | "approved" | "rejected" | "open" | "closed" | "draft"

const config: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  open: { label: "Open", variant: "default" },
  closed: { label: "Closed", variant: "secondary" },
  draft: { label: "Draft", variant: "outline" },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = config[status as Status] ?? { label: status, variant: "outline" as const }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
