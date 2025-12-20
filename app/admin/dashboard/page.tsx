"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { adminService } from "@/services/adminService"
import { UsersTable } from "@/components/UsersTable"
import { TransactionTable } from "@/components/TransactionTable"
import { LogOut, ShieldCheck } from "lucide-react"
import { AdminTransaction } from "@/lib/transaction"
import { useAdminTransactionStream } from "@/hooks/useAdminTransactionStream"

interface User {
  id: number
  name: string
  email: string
  clientId: string
  balance: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [sseEnabled, setSseEnabled] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
  
    setSseEnabled(true)
    fetchAdminData()
  }, [])
  
  const fetchAdminData = async () => {
    try {
      const [usersData, transactionsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllTransactions(),
      ])

      console.log("usersData", usersData)
      console.log("transactionsData", transactionsData)

      setUsers(usersData.data)
      setTransactions(transactionsData.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }


  const handleAdminTransaction = useCallback((tx: AdminTransaction) => {
    setTransactions((prev) => {
      if (prev.some((t) => t.id === tx.id)) return prev
      return [tx, ...prev]
    })
  }, [])


  useAdminTransactionStream(sseEnabled, handleAdminTransaction)

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("admin")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel - LenDenClub</h1>
                <p className="text-xs text-muted-foreground">Monitor & Manage Platform</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{users.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-3xl">{transactions.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Volume</CardDescription>
                <CardTitle className="text-3xl">
                  ₹{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Users Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Users Overview</CardTitle>
              <CardDescription>
                View all registered users and their account balances. User IDs can be copied for testing transfers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable users={users} />
            </CardContent>
          </Card>

          {/* Latest Transactions (Audit Log) */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Transactions (Audit Log)</CardTitle>
              <CardDescription>
                All transactions are immutable and logged for audit purposes. This is a read-only view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} isAdmin />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
