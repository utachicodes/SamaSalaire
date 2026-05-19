import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, Employee } from "../types"

export function useEmployees(filters?: Record<string, string>) {
  const params = new URLSearchParams({ is_active: "true", ...filters })
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Employee[]>>(`/employees?${params}`)
      return res.data.data
    },
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Employee>>(`/employees/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Employee>) => {
      const res = await api.post<ApiResponse<Employee>>("/employees", data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Employee created")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const res = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Employee updated")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Employee deactivated")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
