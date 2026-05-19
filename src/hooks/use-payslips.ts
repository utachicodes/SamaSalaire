import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import type { ApiResponse, Payslip } from "../types"

export function usePayslips(filters?: Record<string, string>) {
  const params = filters ? `?${new URLSearchParams(filters)}` : ""
  return useQuery({
    queryKey: ["payslips", filters],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Payslip[]>>(`/payslips${params}`)
      return res.data.data
    },
  })
}
