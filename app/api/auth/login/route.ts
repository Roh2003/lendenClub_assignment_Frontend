import { NextResponse } from "next/server"

// Mock database - shared across routes
const users: any[] = []

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate mock token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { users }
