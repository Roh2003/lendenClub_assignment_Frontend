// User Service - Handles user-related operations
import { api } from "@/lib/api"

export const userService = {
  // Get current logged-in user data
  async getCurrentUser() {
    const response = await api.get("/api/user/profile")
    return response.data
  },

  async getUserBalance() {
    const response = await api.get("/api/user/balance")
    return response.data
  },

  // Get user by ID (for admin)
  async getUserById(userId: string) {
    const response = await api.get(`/api/user/${userId}`)
    return response.data
  },

  async getUserByCientId(clientId: string) {
    const response = await api.get(`/api/user/client/${clientId}`)
    return response.data
  }
}
