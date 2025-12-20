"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send } from "lucide-react"
import { CheckRecipientsDetails } from "@/components/checkReceiverDetailsModal"

interface TransferFormProps {
  onTransfer: (receiverId: string, amount: number) => Promise<void>
  currentBalance: number
}

export function TransferForm({ onTransfer, currentBalance }: TransferFormProps) {
  const [receiverId, setReceiverId] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingTransfer, setPendingTransfer] = useState<{ receiverId: string; amount: number } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  /** Validate and show modal for confirmation */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const amountNum = Number.parseFloat(amount)

    if (!receiverId || amountNum <= 0) {
      setFormError("Please provide a valid Client Id and amount greater than zero.")
      return
    }

    if (amountNum > currentBalance) {
      setFormError("You do not have sufficient balance for this transfer.")
      return
    }

    // Show check receiver details modal and pass data
    setPendingTransfer({ receiverId, amount: amountNum })
    setIsModalOpen(true)
  }

  /** Handles the actual fund transfer after modal confirmation */
  const handleConfirmTransfer = async () => {
    if (!pendingTransfer) return;
    setLoading(true)
    setFormError(null)
    try {
      await onTransfer(pendingTransfer.receiverId, pendingTransfer.amount)
      setReceiverId("")
      setAmount("")
    } catch (error) {
      setFormError("Transfer failed. Please try again.")
    } finally {
      setLoading(false)
      setPendingTransfer(null)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPendingTransfer(null)
  }

  return (
    <div>
      <Alert className="mb-6 bg-muted/50">
        <AlertDescription className="text-sm">
          Ask the receiver for their Client Id to complete the transfer. You can find your own Client Id in the card above.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="receiverId">Receiver Client Id</Label>
            <Input
              id="receiverId"
              type="text"
              placeholder="Enter receiver's Client Id"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transferAmount">Amount (₹)</Label>
            <Input
              id="transferAmount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              // max={currentBalance}
              step="0.01"
              required
            />
          </div>
        </div>
        {formError && (
          <div className="text-sm text-red-600">{formError}</div>
        )}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full md:w-auto"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Transferring..." : "Transfer Funds"}
        </Button>
      </form>

      {/* Check recipient details but only open when needed */}
      {pendingTransfer && (
        <CheckRecipientsDetails
          open={isModalOpen}
          onClose={handleCloseModal}
          recipientClientId={pendingTransfer.receiverId}
          amount={pendingTransfer.amount}
          onConfirm={handleConfirmTransfer}
        />
      )}
    </div>
  )
}
