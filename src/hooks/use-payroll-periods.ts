import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, PayrollPeriod } from "../types"

export function usePayrollPeriods() {
  return useQuery({
    queryKey: ["payroll-periods"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PayrollPeriod[]>>("/payroll-periods")
      return res.data.data
    },
  })
}

export function useCreatePayrollPeriod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { start_date: string; end_date: string }) => {
      const res = await api.post<ApiResponse<PayrollPeriod>>("/payroll-periods", data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payroll-periods"] })
      toast.success("Payroll period created")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useRunPayroll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (periodId: string) => {
      const res = await api.post<ApiResponse<{ payslips_generated: number }>>(`/payroll-periods/${periodId}/run`)
      return res.data.data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["payroll-periods"] })
      qc.invalidateQueries({ queryKey: ["payslips"] })
      toast.success(`Payroll run: ${data?.payslips_generated} payslips generated`)
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useFinalizePeriod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (periodId: string) => {
      await api.post(`/payroll-periods/${periodId}/finalize`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payroll-periods"] })
      toast.success("Period finalized")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
