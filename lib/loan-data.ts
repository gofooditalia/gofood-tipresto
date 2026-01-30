import { supabase } from "./supabase"

export type UserRole = 'debtor' | 'creditor'

export interface Loan {
  id: string
  name: string
  lender_name: string
  lender_id: string
  debtor_id: string
  original_amount: number
  current_balance: number
  interest_rate: number
  monthly_payment: number
  start_date: string
  end_date: string
  status: 'active' | 'paid' | 'overdue'
  type: 'personal' | 'mortgage' | 'auto' | 'student' | 'business'
}

export interface Payment {
  id: string
  loan_id: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'rejected'
}

// Data fetching functions
export async function fetchLoans() {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching loans:', error.message, error.code, error.hint)
    return []
  }
  return data as Loan[]
}

export async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error.message, error.code, error.hint)
    return []
  }
  return data as Payment[]
}

// Utility functions for calculations
export function calculateProgress(loan: Loan): number {
  return ((loan.original_amount - loan.current_balance) / loan.original_amount) * 100
}

export function getInitialTotal(loans: Loan[]): number {
  return loans.reduce((sum, loan) => sum + Number(loan.original_amount), 0)
}

export function getTotalDebt(loans: Loan[]): number {
  return loans.filter(l => l.status !== 'paid').reduce((sum, loan) => sum + Number(loan.current_balance), 0)
}

export function getMonthlyTotal(loans: Loan[]): number {
  return loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + Number(loan.monthly_payment), 0)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch (e) {
    return dateString
  }
}

export function getLoanTypeLabel(type: Loan['type']): string {
  const labels: Record<Loan['type'], string> = {
    personal: 'Personale',
    mortgage: 'Mutuo',
    auto: 'Auto',
    student: 'Universitario',
    business: 'Aziendale',
  }
  return labels[type]
}

export function getStatusLabel(status: Loan['status']): string {
  const labels: Record<Loan['status'], string> = {
    active: 'Attivo',
    paid: 'Estinto',
    overdue: 'Scaduto',
  }
  return labels[status]
}
