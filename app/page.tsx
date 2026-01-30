"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/loan-tracker/header"
import { SummaryCards } from "@/components/loan-tracker/summary-cards"
import { LoansList } from "@/components/loan-tracker/loans-list"
import { PaymentChart } from "@/components/loan-tracker/payment-chart"
import { RecentActivity } from "@/components/loan-tracker/recent-activity"
import { LoanDialog } from "@/components/loan-tracker/loan-dialog"
import { PaymentDialog } from "@/components/loan-tracker/payment-dialog"
import { fetchLoans, fetchPayments, type Loan, type Payment, type UserRole } from "@/lib/loan-data"
import { getUser, getProfile, signOut } from "@/lib/auth"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function LoanTrackerPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('debtor')
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loanDialogOpen, setLoanDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      const profile = await getProfile(currentUser.id)
      if (profile) {
        setActiveRole(profile.role)
      }

      const loansData = await fetchLoans()
      const paymentsData = await fetchPayments()
      setLoans(loansData)
      setPayments(paymentsData)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const handleAddLoan = () => {
    setSelectedLoan(null)
    setLoanDialogOpen(true)
  }

  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(loan)
    setLoanDialogOpen(true)
  }

  const handleDeleteLoan = async (id: string) => {
    const { error } = await supabase.from('loans').delete().eq('id', id)
    if (error) {
      toast.error("Errore nell'eliminazione del prestito")
    } else {
      setLoans(loans.filter(l => l.id !== id))
      toast.success("Prestito eliminato correttamente")
    }
  }

  const handleMakePayment = (loan: Loan) => {
    setSelectedLoan(loan)
    setPaymentDialogOpen(true)
  }

  const handleSaveLoan = async (loanData: Omit<Loan, 'id'> & { id?: string }) => {
    // If it's a new loan, we need to set the IDs correctly based on who is creating it
    const finalLoanData = { ...loanData }

    if (!loanData.id) {
      if (activeRole === 'creditor') {
        finalLoanData.lender_id = user.id
        // debtor_id is already set from the dialog selection
      } else {
        finalLoanData.debtor_id = user.id
        // lender_id could be empty if not selected, but for debtor view 
        // it's usually a bank (lender_name), lender_id remains null/undefined
        delete (finalLoanData as any).lender_id
      }
    }

    if (loanData.id) {
      const { error } = await supabase
        .from('loans')
        .update(finalLoanData)
        .eq('id', loanData.id)

      if (error) {
        console.error("Update error:", error)
        toast.error("Errore nell'aggiornamento del prestito")
      } else {
        setLoans(loans.map(l => l.id === loanData.id ? { ...finalLoanData, id: loanData.id } as Loan : l))
        toast.success("Prestito aggiornato correttamente")
      }
    } else {
      const { data, error } = await supabase
        .from('loans')
        .insert(finalLoanData)
        .select()
        .single()

      if (error) {
        console.error("Insert error:", error)
        toast.error("Errore nella creazione del prestito: " + error.message)
      } else {
        setLoans([data, ...loans])
        toast.success("Prestito creato correttamente")
      }
    }
  }

  const handlePayment = async (loanId: string, amount: number) => {
    const { data: newPayment, error } = await supabase
      .from('payments')
      .insert({
        loan_id: loanId,
        amount,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      toast.error("Errore nella registrazione del pagamento")
    } else {
      setPayments([newPayment, ...payments])
      toast.success(`Pagamento di ${amount.toLocaleString('it-IT')} EUR registrato come in attesa di conferma`)
    }
  }

  const handleConfirmPayment = async (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId)
    if (!payment) return

    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', paymentId)

    if (paymentError) {
      toast.error("Errore nella conferma del pagamento")
      return
    }

    const loan = loans.find(l => l.id === payment.loan_id)
    if (loan) {
      const newBalance = Math.max(0, loan.current_balance - payment.amount)
      const { error: loanError } = await supabase
        .from('loans')
        .update({
          current_balance: newBalance,
          status: newBalance === 0 ? 'paid' : loan.status
        })
        .eq('id', loan.id)

      if (loanError) {
        toast.error("Errore nell'aggiornamento del saldo")
      } else {
        setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'completed' } : p))
        setLoans(loans.map(l => l.id === loan.id ? {
          ...l,
          current_balance: newBalance,
          status: newBalance === 0 ? 'paid' : l.status
        } : l))
        toast.success("Pagamento confermato e saldo aggiornato")
      }
    }
  }

  const handleRejectPayment = async (paymentId: string) => {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'rejected' })
      .eq('id', paymentId)

    if (error) {
      toast.error("Errore nel rifiuto del pagamento")
    } else {
      setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p))
      toast.error("Pagamento rifiutato")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddLoan={handleAddLoan}
        activeRole={activeRole}
        user={user}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <SummaryCards loans={loans} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PaymentChart payments={payments} loans={loans} />
            </div>
            <div>
              <RecentActivity
                payments={payments}
                loans={loans}
                activeRole={activeRole}
                onConfirm={handleConfirmPayment}
                onReject={handleRejectPayment}
              />
            </div>
          </div>

          <LoansList
            loans={loans}
            activeRole={activeRole}
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
        activeRole={activeRole}
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
