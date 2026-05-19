import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import type { ApiResponse, LeaveBalance } from "../types"

export function useLeaveBalances(employeeId: string) {
  return useQuery({
    queryKey: ["leave-balances", employeeId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<LeaveBalance[]>>(`/leave-balances/${employeeId}`)
      return res.data.data
    },
    enabled: !!employeeId,
  })
}
