"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  clientId : string,
  email: string
  balance: number
}

interface UserCardProps {
  user: User
  onAddFunds: () => void
}

export function UserCard({ user, onAddFunds }: UserCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  console.log("usar", user)

  const copyUserId = () => {
    navigator.clipboard.writeText(String(user.clientId))
    setCopied(true)
    toast({
      variant: 'success',
      title: "Client ID Copied",
      description: "Your Client ID has been copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-sm text-primary-foreground/80">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 rounded-lg px-3 py-2">
                <p className="text-xs text-primary-foreground/80 mb-1">Your Client ID</p>
                <p className="font-mono font-bold text-lg">{user.clientId}</p>
              </div>
              <Button variant="secondary" size="icon" onClick={copyUserId} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/90 leading-relaxed max-w-md">
              Your unique Client ID is used for peer-to-peer transfers. Share it with others to receive funds.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:text-right">
            <div>
              <p className="text-sm text-primary-foreground/80 mb-1">Current Balance</p>
              <p className="text-4xl font-bold">₹{user.balance?.toLocaleString()}</p>
            </div>
            <Button onClick={onAddFunds} variant="secondary" size="lg" className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
