import { NextResponse } from "next/server"

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@lendenclub.com",
  password: "admin123",
  id: "ADMIN001",
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = `admin_token_${Date.now()}`

      return NextResponse.json({
        token,
        admin: {
          id: ADMIN_CREDENTIALS.id,
          email: ADMIN_CREDENTIALS.email,
        },
      })
    }

    return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
