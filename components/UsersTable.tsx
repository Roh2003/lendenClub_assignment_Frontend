"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  clientId: string
  name: string
  email: string
  balance: number
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId)
    setCopiedId(userId)
    toast({
      title: "User ID Copied",
      description: "User ID has been copied to clipboard",
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No users found</p>
      </div>
    )
  }

  console.log("users", users)

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.clientId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{user.clientId}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyUserId(user.clientId)}>
                    {copiedId === user.clientId ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-right font-mono font-semibold">₹{user.balance.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
