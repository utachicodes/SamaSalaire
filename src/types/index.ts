export type Role = "employee" | "manager" | "hr" | "admin"

export interface Employee {
  id: string
  name: string
  email: string
  hire_date: string
  job_title: string
  department: string
  manager_id?: string
  role: Role
  is_active: boolean
}

export interface User {
  id: string
  employee_id: string
  username: string
  role: Role
}

export interface SalaryComponent {
  id: string
  employee_id: string
  name: string
  type: "earning" | "deduction"
  amount: number
}

export interface PayrollPeriod {
  id: string
  start_date: string
  end_date: string
  status: "open" | "closed"
}

export interface Payslip {
  id: string
  employee_id: string
  period_id: string
  gross_pay: number
  deductions: number
  net_pay: number
  generated_at: string
}

export interface LeaveType {
  id: string
  name: string
  annual_entitlement: number
  allows_negative: boolean
}

export interface LeaveBalance {
  id: string
  employee_id: string
  leave_type_id: string
  remaining_days: number
}

export interface LeaveRequest {
  id: string
  employee_id: string
  leave_type_id: string
  start_date: string
  end_date: string
  status: "draft" | "pending" | "approved" | "rejected"
  reason: string
  decided_by?: string
  decided_at?: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  target: string
  timestamp: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    role: Role
    employee_id: string
    username: string
  }
}

export interface ApiResponse<T> {
  data: T
  error: string | null
}
