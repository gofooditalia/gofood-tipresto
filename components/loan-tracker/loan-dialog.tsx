"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Loan } from "@/lib/loan-data"

interface LoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan?: Loan | null
  onSave: (loan: Omit<Loan, 'id'> & { id?: string }) => void
}

const loanTypes: { value: Loan['type']; label: string }[] = [
  { value: 'personal', label: 'Personale' },
  { value: 'mortgage', label: 'Mutuo' },
  { value: 'auto', label: 'Auto' },
  { value: 'student', label: 'Universitario' },
  { value: 'business', label: 'Aziendale' },
]

export function LoanDialog({ open, onOpenChange, loan, onSave }: LoanDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    lender: '',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: '',
    startDate: '',
    endDate: '',
    type: 'personal' as Loan['type'],
  })

  useEffect(() => {
    if (loan) {
      setFormData({
        name: loan.name,
        lender: loan.lender,
        originalAmount: loan.originalAmount.toString(),
        currentBalance: loan.currentBalance.toString(),
        interestRate: loan.interestRate.toString(),
        monthlyPayment: loan.monthlyPayment.toString(),
        startDate: loan.startDate,
        endDate: loan.endDate,
        type: loan.type,
      })
    } else {
      setFormData({
        name: '',
        lender: '',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        monthlyPayment: '',
        startDate: '',
        endDate: '',
        type: 'personal',
      })
    }
  }, [loan, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: loan?.id,
      name: formData.name,
      lender: formData.lender,
      originalAmount: parseFloat(formData.originalAmount),
      currentBalance: parseFloat(formData.currentBalance),
      interestRate: parseFloat(formData.interestRate),
      monthlyPayment: parseFloat(formData.monthlyPayment),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
      type: formData.type,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {loan ? 'Modifica Prestito' : 'Nuovo Prestito'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-foreground">Nome del Prestito</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Es: Prestito Personale"
                className="mt-1.5"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="lender" className="text-foreground">Istituto di Credito</Label>
              <Input
                id="lender"
                value={formData.lender}
                onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                placeholder="Es: Intesa Sanpaolo"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-foreground">Tipo di Prestito</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Loan['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interestRate" className="text-foreground">Tasso di Interesse (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="12.5"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="originalAmount" className="text-foreground">Importo Originale</Label>
              <Input
                id="originalAmount"
                type="number"
                value={formData.originalAmount}
                onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                placeholder="15000"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="currentBalance" className="text-foreground">Debito Residuo</Label>
              <Input
                id="currentBalance"
                type="number"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="8750"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="monthlyPayment" className="text-foreground">Rata Mensile</Label>
              <Input
                id="monthlyPayment"
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                placeholder="450"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-foreground">Data Inizio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="endDate" className="text-foreground">Data Scadenza</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
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
              {loan ? 'Salva Modifiche' : 'Crea Prestito'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
