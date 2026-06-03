delete from public.mln_scores
where player_name ilike 'codex%';

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'mln_scores'
  ) then
    alter publication supabase_realtime add table public.mln_scores;
  end if;
end $$;
