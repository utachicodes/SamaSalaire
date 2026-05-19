import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import type { ApiResponse } from "../types"

export function usePayrollSummary(periodId?: string) {
  const params = periodId ? `?period_id=${periodId}` : ""
  return useQuery({
    queryKey: ["reports", "payroll-summary", periodId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Record<string, unknown>[]>>(`/reports/payroll-summary${params}`)
      return res.data.data
    },
  })
}

export function useLeaveSummary(year?: number) {
  const params = year ? `?year=${year}` : ""
  return useQuery({
    queryKey: ["reports", "leave-summary", year],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Record<string, unknown>[]>>(`/reports/leave-summary${params}`)
      return res.data.data
    },
  })
}
