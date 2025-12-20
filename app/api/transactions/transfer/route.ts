import { NextResponse } from "next/server"

// Mock databases
const users: any[] = []
const transactions: any[] = []

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, amount } = await request.json()

    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid transfer details" }, { status: 400 })
    }

    // Extract sender ID from token
    const senderId = token.split("_")[1]
    const sender = users.find((u) => u.id === senderId)
    const receiver = users.find((u) => u.id === receiverId)

    if (!sender) {
      return NextResponse.json({ message: "Sender not found" }, { status: 404 })
    }

    if (!receiver) {
      return NextResponse.json({ message: "Receiver not found" }, { status: 404 })
    }

    if (sender.id === receiver.id) {
      return NextResponse.json({ message: "Cannot transfer to yourself" }, { status: 400 })
    }

    if (sender.balance < amount) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })
    }

    // Perform transfer
    sender.balance -= amount
    receiver.balance += amount

    // Record transaction
    const transaction = {
      id: `TXN${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      receiverId: receiver.id,
      receiverName: receiver.name,
      amount,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    transactions.push(transaction)

    return NextResponse.json({
      message: "Transfer successful",
      transaction,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { users, transactions }
