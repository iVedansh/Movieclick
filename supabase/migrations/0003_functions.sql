create or replace function generate_seats_for_event()
returns trigger
language plpgsql
as $$
declare
    r int;
    c int;
    col_letter text;
begin
    for r in 1..new.rows loop
        col_letter := chr(64 + r); -- A, B, C ... (cap at 20 rows -> up to 'T')
        for c in 1..new.cols loop
            insert into seats (event_id, label, seat_row, seat_col, category)
            values (
                new.id,
                col_letter || c::text,
                r,
                c,
                case when r = 1 then 'premium' else 'standard' end -- example: front row = premium
            );
        end loop;
    end loop;
    return new;
end;
$$;

create trigger trg_generate_seats
after insert on events
for each row execute function generate_seats_for_event();

create or replace function book_seats(p_event_id uuid, p_seat_ids uuid[])
returns table (booking_id uuid, seat_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid := auth.uid();
    v_event events%rowtype;
    v_seat_count int;
begin
    if v_user_id is null then
        raise exception 'Not authenticated';
    end if;

    select * into v_event from events where id = p_event_id;
    if not found then
        raise exception 'Event not found';
    end if;

    if v_event.starts_at <= now() then
        raise exception 'Cannot book seats for a past event';
    end if;

    v_seat_count := array_length(p_seat_ids, 1);
    if v_seat_count is null or v_seat_count = 0 then
        raise exception 'No seats selected';
    end if;
    if v_seat_count > 4 then
        raise exception 'You can book a maximum of 4 seats per booking';
    end if;

    -- Confirm every seat id actually belongs to this event
    if (select count(*) from seats where id = any(p_seat_ids) and event_id = p_event_id) <> v_seat_count then
        raise exception 'One or more seats do not belong to this event';
    end if;

    -- ONE multi-row INSERT is atomic in Postgres: if the partial unique
    -- index rejects any single row, the whole statement (and therefore
    -- the whole booking) is rolled back automatically. This is what
    -- gives you "all seats booked, or none" for free.
    return query
    insert into bookings (seat_id, event_id, user_id, status)
    select s, p_event_id, v_user_id, 'booked'
    from unnest(p_seat_ids) as s
    returning id, bookings.seat_id;

exception
    when unique_violation then
        raise exception 'One of the selected seats was just booked by someone else. Please choose again.';
end;
$$;

create or replace function cancel_booking(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid := auth.uid();
    v_booking bookings%rowtype;
    v_event events%rowtype;
begin
    select * into v_booking from bookings where id = p_booking_id;
    if not found or v_booking.user_id <> v_user_id then
        raise exception 'Booking not found';
    end if;

    select * into v_event from events where id = v_booking.event_id;
    if v_event.starts_at <= now() then
        raise exception 'Cannot cancel a booking after the event has started';
    end if;

    update bookings set status = 'cancelled' where id = p_booking_id;
    -- The partial unique index automatically allows this seat_id to be
    -- booked again, because the row no longer matches status in ('booked','held').
end;
$$;
