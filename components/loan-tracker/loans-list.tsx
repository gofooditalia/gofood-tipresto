import { LoanCard } from "./loan-card"
import type { Loan, UserRole } from "@/lib/loan-data"

interface LoansListProps {
  loans: Loan[]
  activeRole: UserRole
  onEdit: (loan: Loan) => void
  onDelete: (id: string) => void
  onMakePayment: (loan: Loan) => void
}

export function LoansList({ loans, activeRole, onEdit, onDelete, onMakePayment }: LoansListProps) {
  const activeLoans = loans.filter(l => l.status === 'active')
  const completedLoans = loans.filter(l => l.status === 'paid')

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Prestiti Attivi</h2>
          <span className="text-sm text-muted-foreground">{activeLoans.length} prestiti</span>
        </div>
        {activeLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                activeRole={activeRole}
                onEdit={onEdit}
                onDelete={onDelete}
                onMakePayment={onMakePayment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Non hai prestiti attivi
          </div>
        )}
      </section>

      {completedLoans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Prestiti Estinti</h2>
            <span className="text-sm text-muted-foreground">{completedLoans.length} completati</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                activeRole={activeRole}
                onEdit={onEdit}
                onDelete={onDelete}
                onMakePayment={onMakePayment}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
