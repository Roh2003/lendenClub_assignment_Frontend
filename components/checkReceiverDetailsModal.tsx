"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { userService } from "@/services/userService"

interface RecipientDetails {
  name: string
  email: string
  clientId: string
}

async function fetchRecipientProfile(clientId: string): Promise<RecipientDetails | null> {
  try {
    const response = await userService.getUserByCientId(clientId);
    console.log("response", response)
    if (!response || response.error || response.status === 404) {
      return null;
    }
    return {
      name: response.data.name,
      email: response.data.email,
      clientId: response.data.clientId,
    };
  } catch (e) {
    return null;
  }
}

interface CheckRecipientsDetailsProps {
  open: boolean
  onClose: () => void
  recipientClientId: string
  amount: number
  onConfirm: () => Promise<void>
}


export function CheckRecipientsDetails({
  open,
  onClose,
  recipientClientId,
  amount,
  onConfirm,
}: CheckRecipientsDetailsProps) {
  const [recipient, setRecipient] = useState<RecipientDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && recipientClientId) {
      setLoading(true)
      setError(null)
      fetchRecipientProfile(recipientClientId)
        .then(profile => {
            console.log("progile", profile)
          setRecipient(profile)
          console.log("recipient profile:", recipient)
          if (!profile) setError("No recipient found with this Client ID.")
        })
        .catch(() => setError("Failed to fetch recipient details."))
        .finally(() => setLoading(false))
    }
  }, [recipientClientId, open])

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      // Handle error as needed (e.g., show toast)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogDescription>
            Please review the recipient details before sending funds.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading recipient details…</div>
        ) : error ? (
          <div className="py-8 text-center text-destructive">{error}</div>
        ) : recipient ? (
          <form onSubmit={handleConfirm} className="space-y-4 mt-4">
            <div className="space-y-2 border rounded-md p-4 bg-muted">
              <div>
                <span className="block text-xs text-muted-foreground">Name</span>
                <span className="font-bold">{recipient.name}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Email</span>
                <span>{recipient.email}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Client ID</span>
                <span className="font-mono">{recipient.clientId}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Amount to Send</span>
                <span className="font-bold text-primary">₹{amount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="flex-1">
                {sending ? "Sending..." : "Confirm and Send"}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

