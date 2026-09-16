import { createClient, type SupabaseClient } from '@supabase/supabase-js';

async function attemptBooking(client: SupabaseClient, eventId: string, seatId: string) {
  return client.rpc('book_seats' as any, {
    p_event_id: eventId,
    p_seat_ids: [seatId],
  } as any);
}

async function main() {
  const eventId = process.argv[2];
  const seatId = process.argv[3];
  
  if (!eventId || !seatId) {
    console.error('Usage: npx tsx scripts/test-double-booking.ts <eventId> <seatId>');
    process.exit(1);
  }

  // Load from .env.local usually, but here we can just pass them as env vars or read
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      process.exit(1);
  }

  // Create 20 clients
  const clients = Array.from({ length: 20 }, () =>
    createClient(supabaseUrl, supabaseKey)
  );

  console.log(`Firing 20 simultaneous booking requests for seat ${seatId}...`);

  const results = await Promise.all(clients.map(c => attemptBooking(c, eventId, seatId)));
  const successes = results.filter(r => !r.error).length;
  const errors = results.filter(r => r.error).map(r => r.error?.message);

  console.log(`Successful bookings for the same seat: ${successes} (expected: 1)`);
  if (successes > 1) {
    console.error('FAIL: Double booking occurred!');
  } else if (successes === 1) {
    console.log('PASS: Concurrency test passed. Only one booking succeeded.');
  } else {
    console.log('No bookings succeeded. Check errors:');
    console.log(errors[0]);
  }
}

main();
