"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddFundsModalProps {
  open: boolean
  onClose: () => void
  onAddFunds: (amount: number, method: string) => Promise<void>
}

export function AddFundsModal({ open, onClose, onAddFunds }: AddFundsModalProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseFloat(amount)

    if (amountNum <= 0) {
      return
    }

    setLoading(true)
    try {
      await onAddFunds(amountNum, "UPI")
      setAmount("")
      onClose()
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>Add money to your LenDenClub wallet to start making transfers</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add to Balance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
