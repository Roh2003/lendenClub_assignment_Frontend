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
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { UITransaction, AdminTransaction } from "@/lib/transaction"

/**
 * Component-specific discriminated union
 * Controls admin vs user rendering safely
 */
type TransactionTableProps =
  | { isAdmin?: false; transactions: UITransaction[] }
  | { isAdmin: true; transactions: AdminTransaction[] }

export function TransactionTable(props: TransactionTableProps) {
  const { isAdmin = false } = props
  const transactions = props.transactions

  console.log("Rendering TransactionTable with transactions:", transactions)

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet</p>
      </div>
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {!isAdmin && <TableHead>Type</TableHead>}
            {isAdmin && <TableHead>Sender</TableHead>}
            {isAdmin && <TableHead>Receiver</TableHead>}
            {!isAdmin && <TableHead>Counterparty</TableHead>}
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              {/* USER VIEW: Type */}
              {!isAdmin && "type" in transaction && (
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
              {isAdmin && "senderId" in transaction && (
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
              {!isAdmin && "counterpartyId" in transaction && (
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.counterpartyName ?? "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {transaction.counterpartyId}
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
