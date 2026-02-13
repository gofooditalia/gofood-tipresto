"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Check, X, CheckCircle2, Clock, XCircle, Paperclip, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Payment, Loan, UserRole } from "@/lib/loan-data"
import { formatCurrency, formatDate } from "@/lib/loan-data"
import { generateMovementsPDF } from "@/lib/export-utils"
import { Download } from "lucide-react"

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium">Attivita Recente</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 hover:bg-primary/5 gap-1">
              <Eye className="w-3.5 h-3.5" />
              Vedi tutti
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between pr-8">
              <DialogTitle>Tutti i Movimenti</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => generateMovementsPDF(payments, loans)}
                disabled={payments.length === 0}
              >
                <Download className="w-4 h-4" />
                Scarica PDF
              </Button>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4 py-4">
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nessun movimento trovato.</p>
                ) : (
                  payments.map((payment) => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      loanName={getLoanName(payment.loan_id)}
                      activeRole={activeRole}
                      onConfirm={onConfirm}
                      onReject={onReject}
                      showSeparator={true}
                    />
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nessuna attività recente</p>
          ) : (
            payments.slice(0, 5).map((payment, index) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                loanName={getLoanName(payment.loan_id)}
                activeRole={activeRole}
                onConfirm={onConfirm}
                onReject={onReject}
                showSeparator={index !== Math.min(payments.length, 5) - 1}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PaymentRowProps {
  payment: Payment
  loanName: string
  activeRole: UserRole
  onConfirm?: (paymentId: string) => void
  onReject?: (paymentId: string) => void
  showSeparator?: boolean
}

function PaymentRow({
  payment,
  loanName,
  activeRole,
  onConfirm,
  onReject,
  showSeparator
}: PaymentRowProps) {
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
    <div className={`flex items-center justify-between py-3 ${showSeparator ? "border-b border-border" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
          {statusIcons[payment.status]}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {loanName}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(payment.date)} - {statusLabels[payment.status]}
          </p>
          {payment.notes && (
            <p className="text-xs text-foreground/80 italic mt-1 bg-secondary/30 p-1.5 rounded border-l-2 border-primary/30">
              "{payment.notes}"
            </p>
          )}
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
  )
}
