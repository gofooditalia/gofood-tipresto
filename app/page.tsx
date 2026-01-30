import { DashboardClient } from "@/components/loan-tracker/dashboard-client"
import { headers } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function LoanTrackerPage() {
  // Accessing headers forces the route into dynamic rendering mode
  await headers()

  return <DashboardClient />
}
