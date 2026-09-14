create table if not exists public.payment_requests (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_legal_name text not null,
  email text not null,
  phone text not null,
  delivery_address text not null,
  city text not null,
  state_province text not null,
  postal_code text not null,
  country text not null,
  device_id text not null,
  device_name text not null,
  device_model text not null,
  device_amount numeric(10, 2),
  currency text not null default 'USD',
  vendor text not null default 'Trusted Vendor',
  status text not null default 'Pending Review' check (status in ('Pending Review', 'Approved', 'Rejected', 'Completed')),
  created_at timestamptz not null default now()
);

alter table public.payment_requests enable row level security;

create policy "Users can view their own payment requests"
  on public.payment_requests for select
  using (auth.uid() = user_id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create policy "Users can create their own payment requests"
  on public.payment_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can update payment request statuses"
  on public.payment_requests for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create index if not exists payment_requests_user_id_created_at_idx
  on public.payment_requests (user_id, created_at desc);
