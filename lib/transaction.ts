export type TransactionType = "sent" | "received"
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED"

export interface UITransaction {
  id: string
  type: TransactionType
  counterpartyId?: string
  counterpartyName?: string
  amount: number
  status: TransactionStatus
  createdAt: string
}

export interface AdminTransaction {
    id: string
    senderId: string
    senderName: string
    senderEmail?: string
    receiverId: string
    receiverName?: string
    receiverEmail?: string
    amount: number
    status: "COMPLETED" | "PENDING" | "FAILED"
    createdAt: string
  }
  
