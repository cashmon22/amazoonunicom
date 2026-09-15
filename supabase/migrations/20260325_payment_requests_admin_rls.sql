drop policy if exists "Users can view their own payment requests" on public.payment_requests;
drop policy if exists "Admins can update payment request statuses" on public.payment_requests;

create policy "Users can view their own payment requests"
  on public.payment_requests for select
  using (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can update payment request statuses"
  on public.payment_requests for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
