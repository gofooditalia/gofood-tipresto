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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Loan, UserRole } from "@/lib/loan-data"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface LoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan?: Loan | null
  onSave: (loan: Omit<Loan, 'id'> & { id?: string }) => void
  activeRole: UserRole
}

const loanTypes: { value: Loan['type']; label: string }[] = [
  { value: 'personal', label: 'Personale' },
  { value: 'mortgage', label: 'Mutuo' },
  { value: 'auto', label: 'Auto' },
  { value: 'student', label: 'Universitario' },
  { value: 'business', label: 'Aziendale' },
]

export function LoanDialog({ open, onOpenChange, loan, onSave, activeRole }: LoanDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    lender_name: '',
    original_amount: '',
    current_balance: '',
    interest_rate: '',
    monthly_payment: '',
    start_date: '',
    end_date: '',
    type: 'personal' as Loan['type'],
    debtor_id: '',
  })
  const [profiles, setProfiles] = useState<{ id: string, full_name: string, role: string }[]>([])

  useEffect(() => {
    if (open) {
      const fetchProfiles = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .order('full_name')

        if (data) {
          setProfiles(data)
        }
      }
      fetchProfiles()
    }
  }, [open])

  useEffect(() => {
    if (loan) {
      setFormData({
        name: loan.name,
        lender_name: loan.lender_name || '',
        original_amount: loan.original_amount.toString(),
        current_balance: loan.current_balance.toString(),
        interest_rate: loan.interest_rate.toString(),
        monthly_payment: loan.monthly_payment.toString(),
        start_date: loan.start_date,
        end_date: loan.end_date,
        type: loan.type,
        debtor_id: loan.debtor_id || '',
      })
    } else {
      setFormData({
        name: '',
        lender_name: '',
        original_amount: '',
        current_balance: '',
        interest_rate: '',
        monthly_payment: '',
        start_date: '',
        end_date: '',
        type: 'personal',
        debtor_id: '',
      })
    }
  }, [loan, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate for creditor: they must select a debtor
    if (activeRole === 'creditor' && !formData.debtor_id) {
      toast.error("Per favore seleziona un debitore")
      return
    }

    onSave({
      id: loan?.id,
      name: formData.name,
      lender_name: formData.lender_name,
      original_amount: parseFloat(formData.original_amount),
      current_balance: parseFloat(formData.current_balance),
      interest_rate: parseFloat(formData.interest_rate),
      monthly_payment: parseFloat(formData.monthly_payment),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: 'active',
      type: formData.type,
      lender_id: loan?.lender_id || '',
      debtor_id: formData.debtor_id || (loan?.debtor_id ? loan.debtor_id : undefined) as any,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {loan ? 'Modifica Prestito' : 'Nuovo Prestito'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {loan ? 'Modifica i dettagli del prestito esistente.' : 'Inserisci i dettagli per registrare un nuovo prestito.'}
          </DialogDescription>
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

            {activeRole === 'creditor' && (
              <div className="col-span-2">
                <Label htmlFor="debtor" className="text-foreground">Debitore</Label>
                <Select
                  value={formData.debtor_id}
                  onValueChange={(value) => setFormData({ ...formData, debtor_id: value })}
                  required
                >
                  <SelectTrigger className="mt-1.5 focus:ring-primary">
                    <SelectValue placeholder="Seleziona un debitore..." />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles
                      .filter(p => p.role === 'debtor')
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="col-span-2">
              <Label htmlFor="lender_name" className="text-foreground">Istituto di Credito</Label>
              <Input
                id="lender_name"
                value={formData.lender_name}
                onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
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
              <Label htmlFor="interest_rate" className="text-foreground">Tasso di Interesse (%)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.1"
                value={formData.interest_rate}
                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                placeholder="12.5"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="original_amount" className="text-foreground">Importo Originale</Label>
              <Input
                id="original_amount"
                type="number"
                value={formData.original_amount}
                onChange={(e) => setFormData({ ...formData, original_amount: e.target.value })}
                placeholder="15000"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="current_balance" className="text-foreground">Debito Residuo</Label>
              <Input
                id="current_balance"
                type="number"
                value={formData.current_balance}
                onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                placeholder="8750"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="monthly_payment" className="text-foreground">Rata Mensile</Label>
              <Input
                id="monthly_payment"
                type="number"
                value={formData.monthly_payment}
                onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
                placeholder="450"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="start_date" className="text-foreground">Data Inizio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="end_date" className="text-foreground">Data Scadenza</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
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
