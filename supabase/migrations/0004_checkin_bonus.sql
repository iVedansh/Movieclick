-- Add checked_in_at for QR code checkin bonus
alter table bookings add column checked_in_at timestamptz;

create policy "Owner can update bookings to check in"
on bookings for update
using (
    auth.uid() in (
        select owner_id from events where events.id = bookings.event_id
    )
);
