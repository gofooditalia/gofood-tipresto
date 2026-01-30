"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { Loan, Payment } from "@/lib/loan-data"

interface PaymentChartProps {
  payments: Payment[]
  loans: Loan[]
}

export function PaymentChart({ payments, loans }: PaymentChartProps) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return {
      month: d.toLocaleString('it-IT', { month: 'short' }),
      monthNum: d.getMonth(),
      year: d.getFullYear(),
      pagato: 0,
    }
  }).reverse()

  const chartData = last6Months.map(m => {
    const monthPayments = payments.filter(p => {
      const d = new Date(p.date)
      return d.getMonth() === m.monthNum && d.getFullYear() === m.year && p.status === 'completed'
    })
    return {
      month: m.month,
      pagato: monthPayments.reduce((sum, p) => sum + p.amount, 0),
    }
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-medium">Storico Pagamenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPagato" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
              <XAxis
                dataKey="month"
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.18 0.005 260)",
                  border: "1px solid oklch(0.28 0.005 260)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
                formatter={(value: number) => [`${value.toLocaleString('it-IT')} EUR`, '']}
              />
              <Area
                type="monotone"
                dataKey="pagato"
                stroke="oklch(0.72 0.19 160)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPagato)"
                name="Pagato"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Pagamenti Mensili</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
