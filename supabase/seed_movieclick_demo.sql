-- MovieClick prototype seed: movies, cinemas and showtimes
-- Run this in the Supabase SQL Editor.

create table if not exists public.cinemas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  brand text not null default 'MovieClick Cinema'
);

create table if not exists public.showtimes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  cinema_id uuid not null references public.cinemas(id) on delete cascade,
  show_time timestamptz not null,
  language text not null default 'Hindi',
  format text not null default '2D',
  screen_name text not null default 'Screen 1'
);

alter table public.cinemas enable row level security;
alter table public.showtimes enable row level security;
grant select on public.cinemas to anon, authenticated;
grant select on public.showtimes to anon, authenticated;

drop policy if exists "public can read cinemas" on public.cinemas;
create policy "public can read cinemas" on public.cinemas for select to anon, authenticated using (true);
drop policy if exists "public can read showtimes" on public.showtimes;
create policy "public can read showtimes" on public.showtimes for select to anon, authenticated using (true);

insert into public.cinemas (id,name,location,brand) values
('11111111-1111-1111-1111-111111111111','PVR: Heritage RSL ECR','ECR, Chennai','PVR'),
('22222222-2222-2222-2222-222222222222','HDFC Millennium PVR','Escape-Express Avenue Mall, Chennai','PVR'),
('33333333-3333-3333-3333-333333333333','Cinepolis: BSR Mall','OMR, Thoraipakkam','Cinepolis'),
('44444444-4444-4444-4444-444444444444','AGS Cinemas','T Nagar, Chennai','AGS')
on conflict (id) do update set name=excluded.name, location=excluded.location, brand=excluded.brand;

insert into public.events (id,title,description,venue,starts_at,price,cover_image_url) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Mirzapur: The Movie','A power struggle returns to Mirzapur.','PVR: Heritage RSL ECR, Chennai','2026-09-15T22:00:00+05:30',202,'https://placehold.co/600x900/171717/ffffff?text=MIRZAPUR%3A+THE+MOVIE'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Haiwaan','Action, crime and thriller.','HDFC Millennium PVR, Chennai','2026-09-15T21:30:00+05:30',180,'https://placehold.co/600x900/0b1220/ffffff?text=HAIWAAN'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','Last Man in Tower','A drama about progress, pressure and one man who refuses to move.','Cinepolis: BSR Mall, OMR','2026-09-16T21:40:00+05:30',160,'https://placehold.co/600x900/292524/ffffff?text=LAST+MAN+IN+TOWER'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','Resident Evil','Horror / sci-fi / thriller.','AGS Cinemas, T Nagar','2026-09-16T22:00:00+05:30',190,'https://placehold.co/600x900/111827/ef4444?text=RESIDENT+EVIL'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Sardar 2','Action thriller.','PVR: Heritage RSL ECR, Chennai','2026-09-17T21:45:00+05:30',175,'https://placehold.co/600x900/431407/ffffff?text=SARDAR+2')
on conflict (id) do update set title=excluded.title, description=excluded.description, venue=excluded.venue, starts_at=excluded.starts_at, price=excluded.price, cover_image_url=excluded.cover_image_url;

insert into public.showtimes (event_id,cinema_id,show_time,language,format,screen_name)
select e.id,c.id,e.starts_at,'Hindi','2D','Screen 1'
from public.events e join public.cinemas c on c.name=e.venue
where e.id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','cccccccc-cccc-cccc-cccc-cccccccccccc','dddddddd-dddd-dddd-dddd-dddddddddddd','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
and not exists (select 1 from public.showtimes s where s.event_id=e.id and s.cinema_id=c.id and s.show_time=e.starts_at);

insert into public.showtimes (event_id,cinema_id,show_time,language,format,screen_name)
select v.event_id,v.cinema_id,v.ts,'Hindi','2D','Screen 2'
from (values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,'33333333-3333-3333-3333-333333333333'::uuid,'2026-09-15T21:40:00+05:30'::timestamptz),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,'22222222-2222-2222-2222-222222222222'::uuid,'2026-09-15T21:30:00+05:30'::timestamptz),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,'11111111-1111-1111-1111-111111111111'::uuid,'2026-09-15T22:10:00+05:30'::timestamptz),
('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,'44444444-4444-4444-4444-444444444444'::uuid,'2026-09-16T20:50:00+05:30'::timestamptz)
) v(event_id,cinema_id,ts)
where not exists (select 1 from public.showtimes s where s.event_id=v.event_id and s.cinema_id=v.cinema_id and s.show_time=v.ts);

insert into public.seats (event_id,seat_row,seat_col,category)
select e.id, chr(65+r), c, case when r <= 2 then 'premium' else 'standard' end
from public.events e cross join generate_series(0,9) r cross join generate_series(1,15) c
where e.id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','cccccccc-cccc-cccc-cccc-cccccccccccc','dddddddd-dddd-dddd-dddd-dddddddddddd','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
and not exists (select 1 from public.seats s where s.event_id=e.id and s.seat_row=chr(65+r) and s.seat_col=c);
