import { NextResponse } from "next/server"

// Mock database
const users: any[] = []

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    // Validate admin token
    if (!token || !token.startsWith("admin_token_")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Return all users (excluding password)
    const allUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      balance: u.balance,
    }))

    return NextResponse.json(allUsers)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { users }
