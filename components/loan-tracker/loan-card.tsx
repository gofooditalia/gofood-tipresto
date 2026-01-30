"use client"

import React from "react"

import { MoreHorizontal, Building2, Car, Home, GraduationCap, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Loan, UserRole } from "@/lib/loan-data"
import { calculateProgress, formatCurrency, getLoanTypeLabel, getStatusLabel } from "@/lib/loan-data"

interface LoanCardProps {
  loan: Loan
  activeRole: UserRole
  onEdit: (loan: Loan) => void
  onDelete: (id: string) => void
  onMakePayment: (loan: Loan) => void
}

const typeIcons: Record<Loan['type'], React.ElementType> = {
  personal: Building2,
  mortgage: Home,
  auto: Car,
  student: GraduationCap,
  business: Briefcase,
}

export function LoanCard({ loan, activeRole, onEdit, onDelete, onMakePayment }: LoanCardProps) {
  const progress = calculateProgress(loan)
  const Icon = typeIcons[loan.type]

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground line-clamp-1">{loan.name}</h3>
              <p className="text-sm text-muted-foreground">{loan.status === 'active' ? 'Prestito Attivo' : 'Prestito'}</p>
            </div>
          </div>

          {activeRole === 'creditor' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="sr-only">Opzioni</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(loan)}>
                  Modifica
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(loan.id)}
                  className="text-destructive"
                >
                  Elimina
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={loan.status === 'active' ? 'default' : loan.status === 'paid' ? 'secondary' : 'destructive'}
            className={loan.status === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}
          >
            {getStatusLabel(loan.status)}
          </Badge>
          <span className="text-xs text-muted-foreground">{getLoanTypeLabel(loan.type)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso pagamento</span>
            <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Debito residuo</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(loan.current_balance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rata mensile</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(loan.monthly_payment)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span>Tasso: </span>
            <span className="font-medium text-foreground">{loan.interest_rate}% TAN</span>
          </div>

          {activeRole === 'debtor' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMakePayment(loan)}
              className="text-primary hover:text-primary/80"
              disabled={loan.status === 'paid'}
            >
              Paga
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
