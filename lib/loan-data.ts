export interface Loan {
  id: string
  name: string
  lender: string
  originalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  startDate: string
  endDate: string
  status: 'active' | 'paid' | 'overdue'
  type: 'personal' | 'mortgage' | 'auto' | 'student' | 'business'
}

export interface Payment {
  id: string
  loanId: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export const sampleLoans: Loan[] = [
  {
    id: '1',
    name: 'Prestito Personale Banca Nazionale',
    lender: 'Banca Nazionale',
    originalAmount: 15000,
    currentBalance: 8750,
    interestRate: 12.5,
    monthlyPayment: 450,
    startDate: '2024-03-15',
    endDate: '2027-03-15',
    status: 'active',
    type: 'personal',
  },
  {
    id: '2',
    name: 'Finanziamento Auto',
    lender: 'Findomestic',
    originalAmount: 28000,
    currentBalance: 21500,
    interestRate: 9.8,
    monthlyPayment: 620,
    startDate: '2024-06-01',
    endDate: '2028-06-01',
    status: 'active',
    type: 'auto',
  },
  {
    id: '3',
    name: 'Mutuo Casa',
    lender: 'Intesa Sanpaolo',
    originalAmount: 180000,
    currentBalance: 165000,
    interestRate: 7.2,
    monthlyPayment: 1450,
    startDate: '2023-01-10',
    endDate: '2043-01-10',
    status: 'active',
    type: 'mortgage',
  },
  {
    id: '4',
    name: 'Prestito Universitario',
    lender: 'Credito Educativo',
    originalAmount: 12000,
    currentBalance: 0,
    interestRate: 6.5,
    monthlyPayment: 280,
    startDate: '2020-09-01',
    endDate: '2024-09-01',
    status: 'paid',
    type: 'student',
  },
]

export const samplePayments: Payment[] = [
  { id: 'p1', loanId: '1', amount: 450, date: '2026-01-15', status: 'completed' },
  { id: 'p2', loanId: '1', amount: 450, date: '2025-12-15', status: 'completed' },
  { id: 'p3', loanId: '2', amount: 620, date: '2026-01-01', status: 'completed' },
  { id: 'p4', loanId: '2', amount: 620, date: '2025-12-01', status: 'completed' },
  { id: 'p5', loanId: '3', amount: 1450, date: '2026-01-10', status: 'pending' },
  { id: 'p6', loanId: '3', amount: 1450, date: '2025-12-10', status: 'completed' },
]

export function calculateProgress(loan: Loan): number {
  return ((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100
}

export function getTotalDebt(loans: Loan[]): number {
  return loans.filter(l => l.status !== 'paid').reduce((sum, loan) => sum + loan.currentBalance, 0)
}

export function getMonthlyTotal(loans: Loan[]): number {
  return loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.monthlyPayment, 0)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
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
