"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/authService"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(email, password)

      const token = response.data?.token
      const user = response.data?.user

      if (token && user) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      }

      console.log("response", response)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user?.name}!`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.log("FULL ERROR OBJECT:", error);
      console.log("BACKEND MESSAGE:", error?.data.error);

      toast({
        title: "Login Failed",
        description: error.data?.error || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              LC
            </div>
            <span className="text-xl font-bold text-foreground">LenDenClub</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Login</CardTitle>
            <CardDescription>Access your account and manage transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
