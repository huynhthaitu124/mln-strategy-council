import { createClient } from '@supabase/supabase-js';

export type ScoreEntry = {
  id?: string;
  player_name: string;
  score: number;
  completed_levels: number;
  duration_seconds: number;
  created_at?: string;
};

export type LeaderboardState = {
  entries: ScoreEntry[];
  mode: 'online' | 'offline';
};

const tableName = 'mln_scores';
const storageKey = 'mln-strategy-scores';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabase ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

const sortEntries = (entries: ScoreEntry[]) =>
  [...entries]
    .sort((a, b) => b.score - a.score || a.duration_seconds - b.duration_seconds)
    .slice(0, 10);

function readOfflineScores() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}

function writeOfflineScores(entries: ScoreEntry[]) {
  localStorage.setItem(storageKey, JSON.stringify(sortEntries(entries)));
}

export async function fetchLeaderboard(): Promise<LeaderboardState> {
  if (!supabase) {
    return { entries: sortEntries(readOfflineScores()), mode: 'offline' };
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('id, player_name, score, completed_levels, duration_seconds, created_at')
    .order('score', { ascending: false })
    .order('duration_seconds', { ascending: true })
    .limit(10);

  if (error) {
    return { entries: sortEntries(readOfflineScores()), mode: 'offline' };
  }

  return { entries: data ?? [], mode: 'online' };
}

export async function submitScore(entry: ScoreEntry): Promise<LeaderboardState> {
  const entryWithDate = {
    ...entry,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    const entries = sortEntries([...readOfflineScores(), entryWithDate]);
    writeOfflineScores(entries);
    return { entries, mode: 'offline' };
  }

  const { error } = await supabase.from(tableName).insert(entry);
  if (error) {
    const entries = sortEntries([...readOfflineScores(), entryWithDate]);
    writeOfflineScores(entries);
    return { entries, mode: 'offline' };
  }

  return fetchLeaderboard();
}

export function subscribeLeaderboard(onChange: (state: LeaderboardState) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('mln-scores-leaderboard')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
      },
      () => {
        void fetchLeaderboard().then(onChange);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
