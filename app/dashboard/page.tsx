"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { userService } from "@/services/userService"
import { transactionService } from "@/services/transactionService"
import { UserCard } from "@/components/UserCard"
import { AddFundsModal } from "@/components/AddFundsModal"
import { TransferForm } from "@/components/TransferForm"
import { TransactionTable } from "@/components/TransactionTable"
import { LogOut } from "lucide-react"
import { UITransaction } from "@/lib/transaction"
import { buildTransactionHistory } from "@/lib/buildTransactionHistory"

interface User {
  id: number
  name: string
  clientId: string,
  email: string
  balance: number
}



export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<UITransaction []>([])
  const [loading, setLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [clientId, setClientId] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await userService.getCurrentUser()
      console.log("userdata", userData)
      setUser(userData.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.clientId) {
      fetchTransactions(user.clientId)
      setClientId(user.clientId)
    }
  }, [user])
  

  const fetchTransactions = async (clientId: string) => {
    try {
      const response = await transactionService.getTransactions()
      const data = response.data
      const history = buildTransactionHistory(
        data.transactions,
        data.deposites,
        clientId
      )
      setTransactions(history)

    } catch (error) {
      console.error("Failed to load transactions:", error)
    }
  }

  const handleAddFunds = async (amount: number, method: string) => {
    try {
      await transactionService.addFunds(amount, method)
      toast({
        variant: "success",
        title: "Funds Added Successfully",
        description: `₹${amount} has been added to your wallet`,
      })
      fetchUserData()
      setShowAddFunds(false)
    } catch (error: any) {
      toast({
        title: "Failed to Add Funds",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleTransfer = async (receiverId: string, amount: number) => {
    try {
      await transactionService.transferFunds(receiverId, amount)
      toast({
        title: "Transfer Successful",
        description: `₹${amount} has been sent successfully`,
      })
      fetchUserData()
      fetchTransactions(clientId)
    
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }



  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                LC
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LenDenClub</h1>
                <p className="text-xs text-muted-foreground">User Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* User Info Card */}
          <UserCard user={user} onAddFunds={() => setShowAddFunds(true)} />

          {/* Transfer Section */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Funds</CardTitle>
              <CardDescription>Send money to other LenDenClub users using their Client ID</CardDescription>
            </CardHeader>
            <CardContent>
              <TransferForm onTransfer={handleTransfer} currentBalance={user.balance} />
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal open={showAddFunds} onClose={() => setShowAddFunds(false)} onAddFunds={handleAddFunds} />
    </div>
  )
}
