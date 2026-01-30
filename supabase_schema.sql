-- TiPresto Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('debtor', 'creditor')),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Loans table
create table if not exists loans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  lender_name text,
  lender_id uuid references profiles(id),
  debtor_id uuid references profiles(id),
  original_amount numeric not null,
  current_balance numeric not null,
  interest_rate numeric default 0,
  monthly_payment numeric default 0,
  start_date date default now(),
  end_date date,
  type text check (type in ('personal', 'mortgage', 'auto', 'student', 'business')),
  status text check (status in ('active', 'paid', 'overdue')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Payments table
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references loans(id) on delete cascade,
  amount numeric not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  status text check (status in ('completed', 'pending', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table loans enable row level security;
alter table payments enable row level security;

-- Profiles: Users can view their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Loans: Users can view loans where they are either lender or debtor
create policy "Users can view their loans" on loans for select 
using (auth.uid() = lender_id or auth.uid() = debtor_id);

-- Payments: Users can view payments for their loans
create policy "Users can view payments for their loans" on payments for select
using (
  exists (
    select 1 from loans 
    where loans.id = payments.loan_id 
    and (loans.lender_id = auth.uid() or loans.debtor_id = auth.uid())
  )
);
