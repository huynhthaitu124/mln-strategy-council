create extension if not exists pgcrypto;

create table if not exists public.mln_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score integer not null,
  completed_levels integer not null,
  duration_seconds integer not null,
  created_at timestamptz not null default now(),
  constraint mln_scores_player_name_length check (
    char_length(trim(player_name)) between 1 and 24
  ),
  constraint mln_scores_score_range check (
    score between 0 and 100000
  ),
  constraint mln_scores_completed_levels_range check (
    completed_levels between 0 and 6
  ),
  constraint mln_scores_duration_seconds_range check (
    duration_seconds between 1 and 86400
  )
);

alter table public.mln_scores enable row level security;

create index if not exists mln_scores_leaderboard_idx
  on public.mln_scores (score desc, duration_seconds asc, created_at asc);

create policy "Leaderboard is publicly readable"
  on public.mln_scores
  for select
  to anon, authenticated
  using (true);

create policy "Players can submit leaderboard scores"
  on public.mln_scores
  for insert
  to anon, authenticated
  with check (
    char_length(trim(player_name)) between 1 and 24
    and score between 0 and 100000
    and completed_levels between 0 and 6
    and duration_seconds between 1 and 86400
  );
