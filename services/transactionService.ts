// Transaction Service - Handles all transaction operations
import { api } from "@/lib/api"
import { exportTransactionReport } from "@/lib/exportReport"

export const transactionService = {
  // Add funds to user wallet
  async addFunds(amount: number, method: string) {
    const response = await api.post("/api/transactions/deposit", {
      amount, method
    })
    return response.data
  },

  // Transfer funds to another user
  async transferFunds(receiverId: string, amount: number) {
    const response = await api.post("/api/transactions/transfer", {
      receiverId,
      amount,
    })
    return response.data
  },

  // Get user's transaction history
  async getTransactions() {
    const response = await api.get("/api/transactions/history")
    return response.data
  },

  async exportTransactionReport(token: string) {
    console.log("exporting report with token:", token)
    const response = await api.get("/api/admin/export/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("response", response)
    return response.data
  }

  
}
