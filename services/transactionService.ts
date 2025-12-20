// Transaction Service - Handles all transaction operations
import { api } from "@/lib/api"

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
}
