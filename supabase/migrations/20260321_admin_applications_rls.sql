alter table public.applications enable row level security;

drop policy if exists "Admins can view applications" on public.applications;
drop policy if exists "Admins can update applications" on public.applications;

create policy "Admins can view applications"
  on public.applications for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update applications"
  on public.applications for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
