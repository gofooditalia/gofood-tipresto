"use client"

import { useState } from "react"
import { Header } from "@/components/loan-tracker/header"
import { SummaryCards } from "@/components/loan-tracker/summary-cards"
import { LoansList } from "@/components/loan-tracker/loans-list"
import { PaymentChart } from "@/components/loan-tracker/payment-chart"
import { RecentActivity } from "@/components/loan-tracker/recent-activity"
import { LoanDialog } from "@/components/loan-tracker/loan-dialog"
import { PaymentDialog } from "@/components/loan-tracker/payment-dialog"
import { sampleLoans, samplePayments, type Loan, type Payment } from "@/lib/loan-data"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function LoanTrackerPage() {
  const [loans, setLoans] = useState<Loan[]>(sampleLoans)
  const [payments, setPayments] = useState<Payment[]>(samplePayments)
  const [loanDialogOpen, setLoanDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

  const handleAddLoan = () => {
    setSelectedLoan(null)
    setLoanDialogOpen(true)
  }

  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(loan)
    setLoanDialogOpen(true)
  }

  const handleDeleteLoan = (id: string) => {
    setLoans(loans.filter(l => l.id !== id))
    toast.success("Prestito eliminato correttamente")
  }

  const handleMakePayment = (loan: Loan) => {
    setSelectedLoan(loan)
    setPaymentDialogOpen(true)
  }

  const handleSaveLoan = (loanData: Omit<Loan, 'id'> & { id?: string }) => {
    if (loanData.id) {
      setLoans(loans.map(l => l.id === loanData.id ? { ...loanData, id: loanData.id } as Loan : l))
      toast.success("Prestito aggiornato correttamente")
    } else {
      const newLoan: Loan = {
        ...loanData,
        id: Date.now().toString(),
      }
      setLoans([...loans, newLoan])
      toast.success("Prestito creato correttamente")
    }
  }

  const handlePayment = (loanId: string, amount: number) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId) {
        const newBalance = Math.max(0, loan.currentBalance - amount)
        return {
          ...loan,
          currentBalance: newBalance,
          status: newBalance === 0 ? 'paid' as const : loan.status,
        }
      }
      return loan
    }))

    const newPayment: Payment = {
      id: Date.now().toString(),
      loanId,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    }
    setPayments([newPayment, ...payments])
    toast.success(`Pagamento di ${amount.toLocaleString('it-IT')} EUR registrato correttamente`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddLoan={handleAddLoan} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <SummaryCards loans={loans} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PaymentChart />
            </div>
            <div>
              <RecentActivity payments={payments} loans={loans} />
            </div>
          </div>

          <LoansList
            loans={loans}
            onEdit={handleEditLoan}
            onDelete={handleDeleteLoan}
            onMakePayment={handleMakePayment}
          />
        </div>
      </main>

      <LoanDialog
        open={loanDialogOpen}
        onOpenChange={setLoanDialogOpen}
        loan={selectedLoan}
        onSave={handleSaveLoan}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        loan={selectedLoan}
        onPayment={handlePayment}
      />

      <Toaster position="bottom-right" />
    </div>
  )
}
