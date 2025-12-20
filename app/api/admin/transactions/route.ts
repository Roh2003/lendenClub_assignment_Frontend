import { NextResponse } from "next/server"

// Mock database
const transactions: any[] = []

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    // Validate admin token
    if (!token || !token.startsWith("admin_token_")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Return all transactions sorted by latest first
    const allTransactions = transactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json(allTransactions)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { transactions }
