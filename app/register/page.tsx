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

function validatePassword(password: string): string | null {
  // At least 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  const lengthOk = password.length >= 8
  const uppercaseOk = /[A-Z]/.test(password)
  const lowercaseOk = /[a-z]/.test(password)
  const numberOk = /[0-9]/.test(password)
  const specialOk = /[!@#$%^&*(),.?":{}|<>_\-+=/\\~`[\];']/g.test(password)
  if (!lengthOk) return "Password must be at least 8 characters"
  if (!uppercaseOk) return "Password must contain at least one uppercase letter"
  if (!lowercaseOk) return "Password must contain at least one lowercase letter"
  if (!numberOk) return "Password must contain at least one number"
  if (!specialOk) return "Password must contain at least one special character"
  return null
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const passwordValidationMsg = validatePassword(password)
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg)
      return
    }
    setPasswordError(null)
    setLoading(true)

    try {
      await authService.register(name, email, password)

      toast({
        title: "Account Created Successfully",
        description: "Please login with your credentials",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) {
      // As user types, remove error if fixed
      const msg = validatePassword(e.target.value)
      setPasswordError(msg)
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
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join LenDenClub and start peer-to-peer transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
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
                <div className="text-xs text-muted-foreground">
                  At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
                </div>
                {passwordError && (
                  <div className="text-xs text-red-500">{passwordError}</div>
                )}
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
