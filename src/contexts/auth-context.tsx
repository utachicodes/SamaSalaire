import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import {
  clearToken,
  decodeToken,
  type DecodedToken,
  getToken,
  isTokenExpired,
  setToken,
} from "../lib/auth"
import type { ApiResponse, LoginResponse, Role } from "../types"

interface AuthContextValue {
  user: DecodedToken | null
  role: Role | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(() => {
    const token = getToken()
    if (token && !isTokenExpired(token)) return decodeToken(token)
    clearToken()
    return null
  })

  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (token && isTokenExpired(token)) {
      clearToken()
      setUser(null)
    }
  }, [])

  async function login(username: string, password: string) {
    const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", { username, password })
    const { token } = res.data.data
    setToken(token)
    const decoded = decodeToken(token)
    setUser(decoded)
    navigate("/dashboard")
  }

  function logout() {
    clearToken()
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: (user?.role as Role) ?? null,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
