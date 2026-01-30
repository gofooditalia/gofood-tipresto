import { useState, useEffect } from "react"
import { Wallet, Bell, Plus, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { type UserRole } from "@/lib/loan-data"

interface HeaderProps {
  onAddLoan: () => void
  activeRole: UserRole
  onRoleChange: (role: UserRole) => void
  user?: any
  onLogout?: () => void
}

export function Header({ onAddLoan, activeRole, onRoleChange, user, onLogout }: HeaderProps) {
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name)
    } else if (user?.email) {
      setUserName(user.email.split('@')[0])
    }
  }, [user])
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-transparent overflow-hidden">
              <img src="/icon.svg" alt="GO!Food Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Gestione Prestiti</h1>
              <p className="text-xs text-muted-foreground">by GO!Food</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={activeRole === 'debtor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('debtor')}
                className="text-xs h-7"
              >
                Debitore
              </Button>
              <Button
                variant={activeRole === 'creditor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('creditor')}
                className="text-xs h-7"
              >
                Creditore
              </Button>
            </div>

            {activeRole === 'creditor' && (
              <Button
                onClick={onAddLoan}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuovo Prestito</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border border-border">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userName || "Utente"}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnetti</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
