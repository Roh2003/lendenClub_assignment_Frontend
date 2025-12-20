import { NextResponse } from "next/server"

// Mock databases
const users: any[] = []
const transactions: any[] = []

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract user ID from token
    const userId = token.split("_")[1]

    // Filter transactions for this user
    const userTransactions = transactions
      .filter((t) => t.senderId === userId || t.receiverId === userId)
      .map((t) => ({
        id: t.id,
        type: t.senderId === userId ? "sent" : "received",
        counterpartyId: t.senderId === userId ? t.receiverId : t.senderId,
        counterpartyName: t.senderId === userId ? t.receiverName : t.senderName,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(userTransactions)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { users, transactions }
