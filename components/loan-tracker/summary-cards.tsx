"use client"

import { TrendingDown, CreditCard, Percent, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Loan } from "@/lib/loan-data"
import { getTotalDebt, getMonthlyTotal, formatCurrency } from "@/lib/loan-data"

interface SummaryCardsProps {
  loans: Loan[]
}

export function SummaryCards({ loans }: SummaryCardsProps) {
  const totalDebt = getTotalDebt(loans)
  const monthlyPayment = getMonthlyTotal(loans)
  const activeLoans = loans.filter(l => l.status === 'active').length
  const avgInterest = loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.interest_rate, 0) / activeLoans || 0

  const stats = [
    {
      title: "Debito Totale",
      value: formatCurrency(totalDebt),
      icon: TrendingDown,
      change: "-2,4%",
      changeLabel: "vs mese scorso",
      positive: true,
    },
    {
      title: "Rata Mensile",
      value: formatCurrency(monthlyPayment),
      icon: CreditCard,
      change: `${activeLoans} prestiti`,
      changeLabel: "attivi",
      positive: false,
    },
    {
      title: "Tasso Medio",
      value: `${avgInterest.toFixed(1)}%`,
      icon: Percent,
      change: "TAN",
      changeLabel: "medio",
      positive: false,
    },
    {
      title: "Prossimo Pagamento",
      value: "10 Feb",
      icon: CalendarDays,
      change: formatCurrency(1450),
      changeLabel: "Mutuo",
      positive: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-sm font-medium ${stat.positive ? 'text-primary' : 'text-muted-foreground'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
