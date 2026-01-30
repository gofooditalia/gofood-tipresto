# Gestione Prestiti by GO!Food 🚀

Applicazione moderna e intuitiva per il monitoraggio e la gestione dei prestiti personali, sviluppata per **GO!Food**.

## ✨ Caratteristiche Principal

- **Autenticazione Sicura**: Integrazione completa con Supabase Auth per login e registrazione.
- **Ruoli Utente**: Supporto per profili **Creditore** (chi presta) e **Debitore** (chi riceve).
- **Persistenza Dati**: Tutti i prestiti e i pagamenti sono salvati su database PostgreSQL tramite Supabase.
- **Dashboard Dinamica**: Riepilogo in tempo reale di debiti residui, rate mensili e storico pagamenti.
- **Grafici Analitici**: Visualizzazione dello storico pagamenti degli ultimi 6 mesi.
- **UI Premium**: Interfaccia moderna basata su Shadcn UI con supporto per Dark Mode e branding ufficiale GO!Food.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4 & Shadcn UI
- **Linguaggio**: TypeScript
- **Visualizzazione Dati**: Recharts

## 🚀 Guida Rapida alla Configurazione

### 1. Requisiti
- Node.js & pnpm
- Un progetto attivo su [Supabase](https://supabase.com)

### 2. Variabili d'Ambiente (.env.local)
Configura le seguenti chiavi nel tuo file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tua_url_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tua_anon_key
```

### 3. Setup Database
Esegui il contenuto del file `supabase_schema.sql` nell'SQL Editor del tuo pannello Supabase per creare le tabelle e le policy RLS.

### 4. Installazione e Avvio
```bash
# Installa le dipendenze
pnpm install

# Avvia il server di sviluppo
pnpm run dev

# Build per produzione
pnpm run build
```

---
*Developed by **Antigravity** for **GO!Food***