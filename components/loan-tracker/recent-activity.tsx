"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Check, X, CheckCircle2, Clock, XCircle, Paperclip } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Payment, Loan, UserRole } from "@/lib/loan-data"
import { formatCurrency, formatDate } from "@/lib/loan-data"

interface RecentActivityProps {
  payments: Payment[]
  loans: Loan[]
  activeRole: UserRole
  onConfirm?: (paymentId: string) => void
  onReject?: (paymentId: string) => void
}

export function RecentActivity({
  payments,
  loans,
  activeRole,
  onConfirm,
  onReject
}: RecentActivityProps) {
  const getLoanName = (loanId: string) => {
    return loans.find(l => l.id === loanId)?.name || 'Prestito'
  }

  const statusIcons: Record<Payment['status'], React.ReactNode> = {
    completed: <CheckCircle2 className="w-4 h-4 text-primary" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    rejected: <XCircle className="w-4 h-4 text-destructive" />,
  }

  const statusLabels: Record<Payment['status'], string> = {
    completed: 'Completato',
    pending: 'In attesa',
    rejected: 'Rifiutato',
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-medium">Attivita Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.slice(0, 5).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                  {statusIcons[payment.status]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {getLoanName(payment.loan_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(payment.date)} - {statusLabels[payment.status]}
                  </p>
                  {payment.proof_url && (
                    <a
                      href={payment.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary hover:underline"
                    >
                      <Paperclip className="w-3 h-3" />
                      Vedi Allegato
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-sm font-medium ${payment.status === 'completed' ? 'text-primary' : 'text-foreground'}`}>
                  {formatCurrency(payment.amount)}
                </span>

                {activeRole === 'creditor' && payment.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 text-primary border-primary/20 hover:bg-primary/10"
                      onClick={() => onConfirm?.(payment.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => onReject?.(payment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
