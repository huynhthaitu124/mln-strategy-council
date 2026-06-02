insert into public.mln_scores (
  player_name,
  score,
  completed_levels,
  duration_seconds
)
values
  ('Demo Council', 6840, 6, 420),
  ('MLN Team', 6520, 6, 510)
on conflict do nothing;
