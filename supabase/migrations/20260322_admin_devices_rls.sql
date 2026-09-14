alter table public.devices enable row level security;

drop policy if exists "Admins can view devices" on public.devices;
drop policy if exists "Admins can insert devices" on public.devices;
drop policy if exists "Admins can update devices" on public.devices;
drop policy if exists "Admins can delete devices" on public.devices;

create policy "Admins can view devices"
  on public.devices for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can insert devices"
  on public.devices for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update devices"
  on public.devices for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete devices"
  on public.devices for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
