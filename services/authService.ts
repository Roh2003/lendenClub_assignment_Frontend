// Auth Service - Handles authentication for users and admins
import { api } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  username: string
  balance: number
  role: string
  createdAt: string
  updatedAt: string
}

interface LoginResponseData {
  token: string
  user: User
}

interface LoginResponse {
  status: boolean
  message: string
  data: LoginResponseData
}

interface AdminLoginResponse {
  data: any
  token: string
  admin: {
    id: number
    email: string
  }
}

export const authService = {
  // User Registration
  async register(name: string, email: string, username: string, password: string) {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      username,
      password,
    })
    return response.data
  },

  // User Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    })
    return response.data
  },

  async checkUsername(username: string) {
    const response = await api.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
    return response.data
  },

  // Admin Login
  async adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
    const response = await api.post("/api/admin/login", {
      email,
      password,
    })
    return response.data
  },
}
