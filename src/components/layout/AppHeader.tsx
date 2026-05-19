import { Moon, Sun } from "lucide-react"
import { useMatches } from "react-router-dom"
import { useTheme } from "../theme-provider"
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leave-requests": "Leave Requests",
  "/payslips": "Payslips",
  "/employees": "Employees",
  "/salary-components": "Salary Components",
  "/payroll-periods": "Payroll Periods",
  "/reports": "Reports",
  "/leave-types": "Leave Types",
  "/users": "Users & Roles",
}

export function AppHeader() {
  const matches = useMatches()
  const { theme, setTheme } = useTheme()

  const lastMatch = matches[matches.length - 1]
  const title = routeTitles[lastMatch?.pathname ?? ""] ?? "SamaSalaire"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  )
}
