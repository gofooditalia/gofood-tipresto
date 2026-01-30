"use client"

import React from "react"

import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Payment, Loan } from "@/lib/loan-data"
import { formatCurrency, formatDate } from "@/lib/loan-data"

interface RecentActivityProps {
  payments: Payment[]
  loans: Loan[]
}

export function RecentActivity({ payments, loans }: RecentActivityProps) {
  const getLoanName = (loanId: string) => {
    return loans.find(l => l.id === loanId)?.name || 'Prestito'
  }

  const statusIcons: Record<Payment['status'], React.ReactNode> = {
    completed: <CheckCircle2 className="w-4 h-4 text-primary" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    failed: <XCircle className="w-4 h-4 text-destructive" />,
  }

  const statusLabels: Record<Payment['status'], string> = {
    completed: 'Completato',
    pending: 'In attesa',
    failed: 'Fallito',
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
                    {getLoanName(payment.loanId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(payment.date)} - {statusLabels[payment.status]}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${payment.status === 'completed' ? 'text-primary' : 'text-foreground'}`}>
                {formatCurrency(payment.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
