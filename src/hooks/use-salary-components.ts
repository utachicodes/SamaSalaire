import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, SalaryComponent } from "../types"

export function useSalaryComponents(employeeId: string) {
  return useQuery({
    queryKey: ["salary-components", employeeId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SalaryComponent[]>>(`/salary-components/${employeeId}`)
      return res.data.data
    },
    enabled: !!employeeId,
  })
}

export function useCreateSalaryComponent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<SalaryComponent>) => {
      const res = await api.post<ApiResponse<SalaryComponent>>("/salary-components", data)
      return res.data.data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["salary-components", vars.employee_id] })
      toast.success("Component added")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useUpdateSalaryComponent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, employeeId, data }: { id: string; employeeId: string; data: Partial<SalaryComponent> }) => {
      const res = await api.put<ApiResponse<SalaryComponent>>(`/salary-components/${id}`, data)
      return { result: res.data.data, employeeId }
    },
    onSuccess: ({ employeeId }) => {
      qc.invalidateQueries({ queryKey: ["salary-components", employeeId] })
      toast.success("Component updated")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useDeleteSalaryComponent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, employeeId }: { id: string; employeeId: string }) => {
      await api.delete(`/salary-components/${id}`)
      return employeeId
    },
    onSuccess: (employeeId) => {
      qc.invalidateQueries({ queryKey: ["salary-components", employeeId] })
      toast.success("Component deleted")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
