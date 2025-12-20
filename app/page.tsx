import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Users, UserPlus } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                LC
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LenDenClub</h1>
                <p className="text-xs text-muted-foreground">P2P Lending Platform</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Empowering peer-to-peer financial freedom
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            LenDenClub simplifies peer-to-peer transactions with transparency, security, and trust.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Admin Login Card */}
          <Card className="hover:shadow-lg transition-shadow border-2">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Admin Login</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Monitor users, balances, and audit logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button className="w-full" size="lg">
                  Access Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* User Login Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-primary/50">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">User Login</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Access your account and manage transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full" size="lg" variant="default">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Create Account Card */}
          <Card className="hover:shadow-lg transition-shadow border-2">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Create New Account</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Join LenDenClub and start peer-to-peer transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full bg-transparent" size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Why Choose LenDenClub?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl mb-2">🔒</div>
              <h4 className="font-semibold text-foreground mb-2">Secure</h4>
              <p className="text-sm text-muted-foreground">Bank-level security for all your transactions</p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-semibold text-foreground mb-2">Instant</h4>
              <p className="text-sm text-muted-foreground">Real-time peer-to-peer money transfers</p>
            </div>
            <div>
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold text-foreground mb-2">Transparent</h4>
              <p className="text-sm text-muted-foreground">Complete audit trail for all activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
