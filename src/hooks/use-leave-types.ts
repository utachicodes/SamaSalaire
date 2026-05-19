import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, LeaveType } from "../types"

export function useLeaveTypes() {
  return useQuery({
    queryKey: ["leave-types"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<LeaveType[]>>("/leave-types")
      return res.data.data
    },
  })
}

export function useCreateLeaveType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<LeaveType>) => {
      const res = await api.post<ApiResponse<LeaveType>>("/leave-types", data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave-types"] })
      toast.success("Leave type created")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useUpdateLeaveType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeaveType> }) => {
      const res = await api.put<ApiResponse<LeaveType>>(`/leave-types/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave-types"] })
      toast.success("Leave type updated")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
