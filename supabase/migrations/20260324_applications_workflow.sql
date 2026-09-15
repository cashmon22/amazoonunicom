alter table public.applications
  add column if not exists status text,
  add column if not exists submission_id text;

update public.applications
set status = 'Under Review'
where status is null
   or status not in ('Under Review', 'Approved', 'Rejected');

alter table public.applications
  alter column status set default 'Under Review',
  alter column status set not null;

alter table public.applications drop constraint if exists applications_status_check;

alter table public.applications
  add constraint applications_status_check
  check (status in ('Under Review', 'Approved', 'Rejected'));

create unique index if not exists applications_submission_id_unique_idx
  on public.applications (submission_id)
  where submission_id is not null;

alter table public.applications enable row level security;

revoke all on public.applications from anon;

drop policy if exists "Admins can view applications" on public.applications;
drop policy if exists "Admins can update applications" on public.applications;

create policy "Admins can view applications"
  on public.applications for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can update applications"
  on public.applications for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
