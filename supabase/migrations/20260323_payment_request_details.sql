alter table public.payment_requests
  add column if not exists bank_name text not null default '',
  add column if not exists additional_notes text not null default '',
  add column if not exists confirmation boolean not null default false;

create policy "Contributors can view available devices"
  on public.devices for select
  to authenticated
  using (status = 'Available');
