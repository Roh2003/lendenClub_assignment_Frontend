"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, ArrowUp, ArrowDown } from "lucide-react"
import { Transaction } from "@/lib/transaction"
import { useState, useMemo } from "react"

type TransactionTableProps =
  | { isAdmin?: false; transactions: Transaction[] }
  | { isAdmin: true; transactions: Transaction[] }

type SortDirection = "asc" | "desc"
type SortKey =
  | "type"
  | "sender"
  | "receiver"
  | "counterparty"
  | "amount"
  | "status"
  | "date"

const SORT_KEYS: { [key in SortKey]: string } = {
  type: "Type",
  sender: "Sender",
  receiver: "Receiver",
  counterparty: "Counterparty",
  amount: "Amount",
  status: "Status",
  date: "Date",
}

function getSortableColumns(isAdmin: boolean): SortKey[] {
  if (isAdmin) {
    return ["sender", "receiver", "amount", "status", "date"]
  }
  return ["type", "counterparty", "amount", "status", "date"]
}

export function TransactionTable(props: TransactionTableProps) {
  const { isAdmin = false } = props
  const originalTransactions = props.transactions

  const [sortKey, setSortKey] = useState<SortKey>(isAdmin ? "date" : "date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  // Sorting function
  const sortedTransactions = useMemo(() => {
    let txCopy = [...originalTransactions]

    function compare(a: Transaction, b: Transaction) {
      let result = 0
      switch (sortKey) {
        case "type":
          result = (a.type ?? "").localeCompare(b.type ?? "")
          break
        case "sender":
          result = (a.senderName ?? "Unknown").localeCompare(b.senderName ?? "Unknown")
          if (result === 0) {
            result = (a.senderId ?? "").localeCompare(b.senderId ?? "")
          }
          break
        case "receiver":
          result = (a.receiverName ?? "Unknown").localeCompare(b.receiverName ?? "Unknown")
          if (result === 0) {
            result = (a.receiverId ?? "").localeCompare(b.receiverId ?? "")
          }
          break
        case "counterparty":
          result = (a.counterpartyName ?? "Unknown").localeCompare(b.counterpartyName ?? "Unknown")
          if (result === 0) {
            result = (a.counterpartyId ?? "").localeCompare(b.counterpartyId ?? "")
          }
          break
        case "amount":
          result = a.amount - b.amount
          break
        case "status":
          result = (a.status ?? "").localeCompare(b.status ?? "")
          break
        case "date":
          result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortDirection === "asc" ? result : -result
    }
    txCopy.sort(compare)
    return txCopy
  }, [originalTransactions, sortKey, sortDirection])

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet</p>
      </div>
    )
  }

  // Render sort icon
  function SortIcon(active: boolean, direction: SortDirection) {
    return active ? (
      direction === "asc" ? <ArrowUp className="inline h-4 w-4 ml-1" /> : <ArrowDown className="inline h-4 w-4 ml-1" />
    ) : (
      <span className="inline-block w-4" />
    )
  }

  // Click to trigger sort
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  // Column definitions based on admin/user
  const columns = getSortableColumns(isAdmin)

  return (
    <div className="rounded-md border overflow-x-auto">

      <Table>
        <TableHeader>
          <TableRow>
            {!isAdmin && (
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("type")}
              >
                Type
                {SortIcon(sortKey === "type", sortDirection)}
              </TableHead>
            )}
            {isAdmin && (
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("sender")}
              >
                Sender
                {SortIcon(sortKey === "sender", sortDirection)}
              </TableHead>
            )}
            {isAdmin && (
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("receiver")}
              >
                Receiver
                {SortIcon(sortKey === "receiver", sortDirection)}
              </TableHead>
            )}
            {!isAdmin && (
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("counterparty")}
              >
                Counterparty
                {SortIcon(sortKey === "counterparty", sortDirection)}
              </TableHead>
            )}
            <TableHead
              className="text-right cursor-pointer select-none"
              onClick={() => handleSort("amount")}
            >
              Amount
              {SortIcon(sortKey === "amount", sortDirection)}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("status")}
            >
              Status
              {SortIcon(sortKey === "status", sortDirection)}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("date")}
            >
              Date
              {SortIcon(sortKey === "date", sortDirection)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              {/* USER VIEW: Type */}
              {!isAdmin && transaction.type && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.type === "sent" ? (
                      <>
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                        <span className="font-medium">Sent</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="h-4 w-4 text-accent" />
                        <span className="font-medium">Received</span>
                      </>
                    )}
                  </div>
                </TableCell>
              )}

              {/* ADMIN VIEW: Sender / Receiver */}
              {isAdmin && transaction.senderId && (
                <>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transaction.senderName ?? "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {transaction.senderId}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transaction.receiverName ?? "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {transaction.receiverId}
                      </div>
                    </div>
                  </TableCell>
                </>
              )}

              {/* USER VIEW: Counterparty */}
              {!isAdmin && transaction.counterpartyId && (
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.counterpartyName
                        ? transaction.counterpartyName
                        : "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {transaction.counterpartyId ??
                        (transaction.senderId ?? "Unknown")}
                    </div>
                  </div>
                </TableCell>
              )}

              {/* Amount */}
              <TableCell className="text-right font-mono font-semibold">
                ₹{transaction.amount.toLocaleString()}
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={
                    transaction.status === "COMPLETED"
                      ? "default"
                      : transaction.status === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {transaction.status}
                </Badge>
              </TableCell>

              {/* Date */}
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(transaction.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
