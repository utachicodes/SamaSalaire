import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "../lib/api"
import { parseApiError } from "../lib/errors"
import type { ApiResponse, User } from "../types"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User[]>>("/users")
      return res.data.data
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { employee_id: string; username: string; password: string; role: string }) => {
      const res = await api.post<ApiResponse<User>>("/users", data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
      toast.success("User created")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { role?: string; password?: string } }) => {
      const res = await api.put<ApiResponse<User>>(`/users/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
      toast.success("User updated")
    },
    onError: (err) => toast.error(parseApiError(err)),
  })
}
