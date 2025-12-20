import { NextResponse } from "next/server"

// Mock database - In production, this would be a real database
const users: any[] = []

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `USER${Date.now()}`,
      name,
      email,
      password, // In production, hash this password
      balance: 0,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json({ message: "User registered successfully", userId: newUser.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Export users array for use in other API routes
export { users }
