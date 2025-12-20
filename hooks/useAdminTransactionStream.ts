"use client"

import { useEffect } from "react"
import { AdminTransaction } from "@/lib/transaction"

type Callback = (tx: AdminTransaction) => void

export function useAdminTransactionStream(
  enabled: boolean,
  onTransaction: Callback
) {
  useEffect(() => {
    if (!enabled) return

    const token = localStorage.getItem("adminToken")
    if (!token) {
      console.warn("Admin token missing, SSE not started")
      return
    }

    console.log("Connecting to admin SSE...")

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions/stream?token=${token}`
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const data: AdminTransaction = JSON.parse(event.data)
      onTransaction(data)
    }

    eventSource.onerror = (err) => {
      console.error("SSE ERROR", err)
      eventSource.close()
    }

    return () => {
      console.log("Closing admin SSE")
      eventSource.close()
    }
  }, [enabled, onTransaction])
}
