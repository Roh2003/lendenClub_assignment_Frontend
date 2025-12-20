import { NextResponse } from "next/server"

// Mock database
const users: any[] = []

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 })
    }

    // Extract user ID from token
    const userId = token.split("_")[1]
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Add funds to user balance
    user.balance += amount

    return NextResponse.json({
      message: "Funds added successfully",
      newBalance: user.balance,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { users }
