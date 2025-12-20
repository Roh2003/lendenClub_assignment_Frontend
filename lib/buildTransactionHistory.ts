import { UITransaction } from "./transaction"


export function buildTransactionHistory(
    transactions: any[],
    deposits: any[],
    currentClientId: string
  ): UITransaction [] {
  
    const mappedDeposits: UITransaction [] = deposits.map((d) => ({
      id: d.id,
      type: "received", // deposit always adds money
      counterpartyId: d.user.clientId,
      counterpartyName: "Self",
      amount: d.amount,
      status: d.status,
      createdAt: d.createdAt,
    }))
  
    const mappedTransfers: UITransaction [] = transactions.map((t) => {
      const isSender = t.senderId === currentClientId
  
      return {
        id: t.id,
        type: isSender ? "sent" : "received",
        senderId: t.senderId,
        senderName: t.sender?.name,
        receiverId: t.receiverId,
        receiverName: t.receiver?.name,
        counterpartyId: isSender ? t.receiverId : t.senderId,
        counterpartyName: isSender
          ? t.receiver?.name
          : t.sender?.name,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt,
      }
    })
  
    return [...mappedDeposits, ...mappedTransfers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
  }
  