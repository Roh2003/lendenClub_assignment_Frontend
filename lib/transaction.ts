export type TransactionType = "sent" | "received"
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED"

export interface Transaction {

  id: string
  amount: number
  status: TransactionStatus
  createdAt: string
  senderId?: string
  senderName?: string
  senderEmail?: string
  receiverId?: string
  receiverName?: string
  receiverEmail?: string

  type?: TransactionType 
  counterpartyId?: string
  counterpartyName?: string
}
