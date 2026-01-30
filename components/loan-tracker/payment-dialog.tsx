"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Loan } from "@/lib/loan-data"
import { formatCurrency } from "@/lib/loan-data"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan: Loan | null
  onPayment: (loanId: string, amount: number) => void
}

export function PaymentDialog({ open, onOpenChange, loan, onPayment }: PaymentDialogProps) {
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (loan) {
      setAmount(loan.monthly_payment.toString())
    }
  }, [loan, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loan) {
      onPayment(loan.id, parseFloat(amount))
      onOpenChange(false)
    }
  }

  if (!loan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Registra Pagamento</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {loan.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Debito residuo</span>
              <span className="font-medium text-foreground">{formatCurrency(loan.current_balance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rata mensile suggerita</span>
              <span className="font-medium text-primary">{formatCurrency(loan.monthly_payment)}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="text-foreground">Importo da Pagare</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="mt-1.5 text-lg"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annulla
            </Button>
            <Button type="submit">
              Conferma Pagamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
