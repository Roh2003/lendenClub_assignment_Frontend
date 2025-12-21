"use client"

import { useEffect } from "react"
import { Transaction } from "@/lib/transaction"

type Callback = (tx: Transaction) => void

export function useAdminTransactionStream(
  enabled: boolean,
  onTransaction: Callback 
) {
  useEffect(() => {
    if (!enabled) return

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (!token) {
      console.warn("Token missing, SSE not started");
      return;
    }

    console.log("Connecting to admin SSE...")

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/stream?token=${token}`
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const data: Transaction = JSON.parse(event.data)
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
