-- Guide services RLS definitive policies setup
-- Safe to re-run.

-- 1. Ensure RLS is enabled
alter table public.guide_services enable row level security;
alter table public.guides enable row level security;

-- 2. Drop temporary / legacy policies that might conflict
DROP POLICY IF EXISTS "temp select all guide_services" ON public.guide_services;
DROP POLICY IF EXISTS "guide_services_select" ON public.guide_services;
DROP POLICY IF EXISTS "guide_services_insert" ON public.guide_services;
DROP POLICY IF EXISTS "guide_services_update_owner" ON public.guide_services;
DROP POLICY IF EXISTS "guide_services_update_admin" ON public.guide_services;
DROP POLICY IF EXISTS "guide_services_delete" ON public.guide_services;

-- (Optional) existing guide policies (only drop if you want to replace)
-- DROP POLICY IF EXISTS "guides_select" ON public.guides;
-- DROP POLICY IF EXISTS "guides_modify_owner" ON public.guides;
-- DROP POLICY IF EXISTS "guides_modify_admin" ON public.guides;

-- 3. Helper function (idempotent)
-- Helper now checks user_profiles (no depende de claim en JWT)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select (
    exists (
      select 1 from public.user_profiles up
      where up.user_id = auth.uid() and up.role = 'admin'
    )
    OR (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
$$;
grant execute on function public.is_admin() to public;

-- 4. Policies for guide_services
-- Select (owner or admin)
create policy "guide_services_select"
  on public.guide_services for select
  using (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_services.guide_id AND g.user_id = auth.uid()
    )
  );

-- Insert (must own the guide)
create policy "guide_services_insert"
  on public.guide_services for insert
  with check (
    EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_services.guide_id AND g.user_id = auth.uid()
    )
  );

-- Insert admin (crear servicios para cualquier guía)
DROP POLICY IF EXISTS "guide_services_insert_admin" ON public.guide_services;
create policy "guide_services_insert_admin"
  on public.guide_services for insert
  with check ( public.is_admin() );

-- Update (owner can edit content but not approval)
create policy "guide_services_update_owner"
  on public.guide_services for update
  using (
    EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_services.guide_id AND g.user_id = auth.uid()
    )
  )
  with check (
    EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_services.guide_id AND g.user_id = auth.uid()
    )
  );

-- Update (admin unrestricted)
create policy "guide_services_update_admin"
  on public.guide_services for update
  using ( public.is_admin() )
  with check ( true );

-- Delete (owner or admin)
create policy "guide_services_delete"
  on public.guide_services for delete
  using (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.guides g
      WHERE g.id = guide_services.guide_id AND g.user_id = auth.uid()
    )
  );

-- 5. Policies for guides table (recreate cleanly)
DROP POLICY IF EXISTS "guides_select" ON public.guides;
DROP POLICY IF EXISTS "guides_modify_owner" ON public.guides;
DROP POLICY IF EXISTS "guides_modify_admin" ON public.guides;

create policy "guides_select"
  on public.guides for select
  using ( true );

create policy "guides_modify_owner"
  on public.guides for update
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );

create policy "guides_modify_admin"
  on public.guides for update
  using ( public.is_admin() )
  with check ( true );

-- (Optional) allow inserts only by admins or self for new guide rows
-- create policy if not exists "guides_insert_owner" on public.guides for insert with check ( auth.uid() = user_id );
-- create policy if not exists "guides_insert_admin" on public.guides for insert with check ( public.is_admin() );

-- 5b. (Optional) Trigger to prevent non-admins from changing approved field
create or replace function public.enforce_approval_change() returns trigger
language plpgsql as $$
begin
  IF NOT public.is_admin() AND NEW.approved IS DISTINCT FROM OLD.approved THEN
    RAISE EXCEPTION 'Solo admin puede cambiar approved';
  END IF;
  return NEW;
end; $$;

DROP TRIGGER IF EXISTS trg_enforce_approval_change ON public.guide_services;
CREATE TRIGGER trg_enforce_approval_change
  BEFORE UPDATE ON public.guide_services
  FOR EACH ROW EXECUTE FUNCTION public.enforce_approval_change();

-- 6. Verification queries (run manually):
-- select current_setting('request.jwt.claims', true);
-- select public.is_admin() as you_are_admin;
-- select id, title, approved from public.guide_services order by title limit 5;

-- 7. To rollback (example):
-- DROP POLICY IF EXISTS "guide_services_select" ON public.guide_services;
-- DROP POLICY IF EXISTS "guide_services_insert" ON public.guide_services;
-- DROP POLICY IF EXISTS "guide_services_update_owner" ON public.guide_services;
-- DROP POLICY IF EXISTS "guide_services_update_admin" ON public.guide_services;
-- DROP POLICY IF EXISTS "guide_services_delete" ON public.guide_services;
-- (Recreate a broad read policy temporarily if needed)
-- create policy "temp select all guide_services" on public.guide_services for select using (true);
