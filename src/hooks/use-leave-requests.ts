import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, LeaveRequest } from "../types"

export function useLeaveRequests(filters?: Record<string, string>) {
  const params = filters ? `?${new URLSearchParams(filters)}` : ""
  return useQuery({
    queryKey: ["leave-requests", filters],
    queryFn: async () => {
      const res = await api.get<ApiResponse<LeaveRequest[]>>(`/leave-requests${params}`)
      return res.data.data
    },
  })
}

export function useCreateLeaveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<LeaveRequest>) => {
      const res = await api.post<ApiResponse<LeaveRequest>>("/leave-requests", data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave-requests"] })
      qc.invalidateQueries({ queryKey: ["leave-balances"] })
      toast.success("Leave request submitted")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useDecideLeaveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: "approved" | "rejected"; note?: string }) => {
      const res = await api.put<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/decide`, { status, note })
      return res.data.data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["leave-requests"] })
      qc.invalidateQueries({ queryKey: ["leave-balances"] })
      toast.success(`Request ${vars.status}`)
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
