"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [role, setRole] = useState<"debtor" | "creditor">("debtor")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Accesso effettuato")
            router.push("/")
        }
        setLoading(false)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        })

        if (signupError) {
            toast.error(signupError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            // Upsert profile entry (to avoid conflict with DB trigger)
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: data.user.id,
                    full_name: fullName,
                    role: role,
                    updated_at: new Date().toISOString(),
                })

            if (profileError) {
                console.error("Profile creation error:", profileError)
                toast.error("Errore nella configurazione del profilo: " + profileError.message)
            } else {
                toast.success("Registrazione completata!")
                router.push("/")
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-transparent mb-2 overflow-hidden">
                        <img src="/icon.svg" alt="GO!Food Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestione Prestiti</h1>
                    <p className="text-muted-foreground font-medium">by GO!Food</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="login">Accedi</TabsTrigger>
                        <TabsTrigger value="signup">Registrati</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card>
                            <form onSubmit={handleLogin}>
                                <CardHeader>
                                    <CardTitle>Accedi</CardTitle>
                                    <CardDescription>Inserisci le tue credenziali per gestire i tuoi prestiti.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="mario.rossi@esempio.it"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Accedi"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card>
                            <form onSubmit={handleSignup}>
                                <CardHeader>
                                    <CardTitle>Nuovo Account</CardTitle>
                                    <CardDescription>Crea un profilo per iniziare a tracciare i pagamenti.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input
                                            id="name"
                                            placeholder="Mario Rossi"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="mario.rossi@esempio.it"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sei un Debitore o un Creditore?</Label>
                                        <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full pt-1">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="debtor" className="text-xs">Debitore</TabsTrigger>
                                                <TabsTrigger value="creditor" className="text-xs">Creditore</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Registrati"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
