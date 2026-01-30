"use client"

import { useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"

interface NotificationHandlerProps {
    user: User | null
    activeRole: 'debtor' | 'creditor'
}

export function NotificationHandler({ user, activeRole }: NotificationHandlerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Hidden audio element for alerts
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
        // Note: Mixkit preview URL as a fallback, user should provide a local one eventually
    }, [])

    useEffect(() => {
        if (!user) return

        const playAlert = () => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e))
            }
        }

        const showNotification = (title: string, body: string) => {
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification(title, {
                    body,
                    icon: "/icon.svg",
                })
            }
            toast.info(`${title}: ${body}`, {
                duration: 10000,
            })
            playAlert()
        }

        // Subscribe to payment requests (new payments in 'pending' status)
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'payments'
                },
                async (payload) => {
                    const newPayment = payload.new

                    // If I'm the creditor, alert me of a new payment request
                    if (activeRole === 'creditor') {
                        // Check if this payment is for one of my loans
                        const { data: loan } = await supabase
                            .from('loans')
                            .select('name, lender_id')
                            .eq('id', newPayment.loan_id)
                            .single()

                        if (loan && loan.lender_id === user.id) {
                            showNotification(
                                "Nuova Richiesta di Pagamento",
                                `Ricevuta una richiesta per: ${loan.name}`
                            )
                        }
                    }
                }
            )
            .subscribe()

        // Request notification permission on first load
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission()
        }

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, activeRole])

    return null
}
