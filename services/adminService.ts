// Admin Service - Handles admin operations
import { api } from "@/lib/api"

export const adminService = {
  // Get all users (admin only)
  async getAllUsers() {
    const response = await api.get("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    return response.data
  },

  // Get all transactions (admin only)
  async getAllTransactions() {
    const response = await api.get("/api/admin/transactions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    return response.data
  },

  async exportTransactionReport() {
    const token = localStorage.getItem("adminToken")
    const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/export/transactions`

    return {
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  },
}
