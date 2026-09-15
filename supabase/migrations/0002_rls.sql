alter table events enable row level security;
alter table seats enable row level security;
alter table bookings enable row level security;

-- ---------- EVENTS ----------
create policy "Anyone can read events"
on events for select
using (true);

create policy "Owner can insert their own event"
on events for insert
with check (auth.uid() = owner_id);

create policy "Owner can update their own event"
on events for update
using (auth.uid() = owner_id);

create policy "Owner can delete their own event"
on events for delete
using (auth.uid() = owner_id);

-- ---------- SEATS ----------
create policy "Anyone can read seats"
on seats for select
using (true);

-- Seats are only ever written by the trigger / RPC functions below
-- (running as the table owner), so no public insert/update policy
-- is needed for normal users.

-- ---------- BOOKINGS ----------
create policy "Users can read their own bookings"
on bookings for select
using (auth.uid() = user_id);

create policy "Event owners can read bookings for their own events"
on bookings for select
using (
    auth.uid() in (
        select owner_id from events where events.id = bookings.event_id
    )
);

-- No direct insert/update/delete policy for bookings: all writes go
-- through the book_seats() and cancel_booking() RPC functions, which
-- run as SECURITY DEFINER so they can bypass RLS safely while still
-- checking auth.uid() manually inside the function body.
