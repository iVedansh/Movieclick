-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =========================================================
-- EVENTS
-- =========================================================
create table events (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    venue text not null,
    starts_at timestamptz not null,
    price numeric(10,2) not null default 0 check (price >= 0),
    rows int not null check (rows between 1 and 20),
    cols int not null check (cols between 1 and 20),
    cover_image_url text, -- bonus: Supabase Storage public URL
    created_at timestamptz not null default now(),
    constraint event_date_must_be_future check (starts_at > created_at)
);

-- =========================================================
-- SEATS (auto-generated when an event is created)
-- =========================================================
create table seats (
    id uuid primary key default gen_random_uuid(),
    event_id uuid not null references events(id) on delete cascade,
    label text not null, -- e.g. "C4"
    seat_row int not null,
    seat_col int not null,
    category text not null default 'standard' 
        check (category in ('standard', 'premium')), -- bonus pricing tiers
    price_override numeric(10,2), -- bonus: premium row price, null = use event.price
    unique (event_id, label)
);

create index idx_seats_event_id on seats(event_id);

-- =========================================================
-- BOOKINGS
-- =========================================================
create table bookings (
    id uuid primary key default gen_random_uuid(),
    seat_id uuid not null references seats(id) on delete cascade,
    event_id uuid not null references events(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    status text not null default 'booked' 
        check (status in ('booked', 'cancelled', 'held')), -- 'held' = bonus seat-hold feature
    hold_expires_at timestamptz, -- bonus: 5-minute hold expiry
    created_at timestamptz not null default now()
);

create index idx_bookings_event_id on bookings(event_id);
create index idx_bookings_user_id on bookings(user_id);

-- =========================================================
-- THE CORE GUARANTEE: a seat can never have two ACTIVE bookings
-- =========================================================
-- A normal UNIQUE constraint on seat_id would permanently lock a seat
-- forever, even after cancellation. A PARTIAL unique index only applies
-- to rows matching the WHERE clause, so a cancelled booking frees the
-- seat back up for a new 'booked' or 'held' row.
create unique index bookings_seat_active_unique
on bookings (seat_id)
where status in ('booked', 'held');
