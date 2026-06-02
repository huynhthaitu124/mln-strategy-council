# Hội Đồng Thời Kỳ Quá Độ

Mini-game React/Vite cho môn Chủ nghĩa xã hội khoa học, chủ đề **khối liên minh công nhân - nông dân - trí thức trong thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam**.

Người chơi vào vai Nhà nước điều tiết chiến lược. Mỗi level là một bối cảnh lịch sử - hiện đại khác nhau, từ hậu chiến, Đổi mới, công nghiệp hóa, hội nhập, khủng hoảng chuỗi cung ứng đến kinh tế tri thức xanh. Người chơi chọn các chính sách đúng thời kỳ để cân bằng:

- Năng lực sản xuất
- Đời sống nhân dân
- Khoa học - công nghệ
- Đoàn kết xã hội

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:5173/`.

## Build deploy Vercel

```bash
npm run build
```

Vercel có thể import repo này trực tiếp. Framework preset: `Vite`.

## Leaderboard online

App dùng Supabase nếu có biến môi trường. Nếu thiếu env, game tự chuyển sang leaderboard offline bằng `localStorage`.

Backend Supabase đã có migration trong `supabase/migrations/`:

- Bảng `public.mln_scores`
- Index leaderboard theo `score desc`, `duration_seconds asc`
- Row Level Security bật sẵn
- Policy cho anon/authenticated đọc leaderboard và submit điểm

Biến môi trường:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Chạy local bằng Supabase CLI:

```bash
supabase start
supabase db reset
supabase status
```

Sau `supabase status`, copy `API URL` vào `VITE_SUPABASE_URL` và `anon key` vào `VITE_SUPABASE_ANON_KEY`.

Deploy schema lên Supabase Cloud:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

SQL schema chính:

```sql
create table public.mln_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score integer not null,
  completed_levels integer not null,
  duration_seconds integer not null,
  created_at timestamptz not null default now()
);
```

## Lệnh kiểm tra

```bash
npm test -- --run
npm run build
npm run e2e -- --reporter=line
```

## Visual assets

Sprite thật nằm trong `public/council-assets/`:

- `council-room.png`
- 4 ảnh đại diện: Công nhân, Nông dân, Trí thức, Nhà nước
- 9 icon chính sách/buff
