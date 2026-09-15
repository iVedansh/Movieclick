'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SeatMap, Seat } from '@/components/SeatMap';
import { SeatLegend } from '@/components/SeatLegend';
import { BookingSummary } from '@/components/BookingSummary';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, ChevronDown, Info, MapPin, Star, Ticket } from 'lucide-react';
import Link from 'next/link';

const fallbackCinemas = [
  { id: '1', name: 'Cinepolis: BSR Mall, OMR, Thoraipakkam', brand: 'Cinepolis', location: 'OMR, Chennai' },
  { id: '2', name: 'HDFC Millennium PVR: Escape-Express Avenue Mall', brand: 'PVR', location: 'Royapettah, Chennai' },
  { id: '3', name: 'PVR: Heritage RSL ECR, Chennai', brand: 'PVR', location: 'ECR, Chennai' },
];

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventRes, seatsRes, bookingsRes, showsRes] = await Promise.all([
          supabase.from('events').select('*').eq('id', eventId).single(),
          supabase.from('seats').select('*').eq('event_id', eventId).order('seat_row').order('seat_col'),
          supabase.from('bookings').select('seat_id, status').eq('event_id', eventId).in('status', ['booked', 'held']),
          supabase.from('showtimes').select('*, cinemas(*)').eq('event_id', eventId).order('show_time'),
        ]);

        if (eventRes.error) throw eventRes.error;
        if (seatsRes.error) throw seatsRes.error;
        if (bookingsRes.error) throw bookingsRes.error;

        setEvent(eventRes.data);
        const bookedSeatIds = (bookingsRes.data || []).map((b: any) => b.seat_id);
        setSeats((seatsRes.data || []).map((seat: any) => ({ ...seat, status: bookedSeatIds.includes(seat.id) ? 'booked' : 'available' })) as Seat[]);

        const databaseShows = showsRes.error ? [] : (showsRes.data || []);
        const fallback = [
          { id: 'fallback-1', cinema: { name: eventRes.data.venue || fallbackCinemas[2].name }, show_time: eventRes.data.starts_at, language: 'Hindi', format: '2D', screen_name: 'Screen 1' },
          { id: 'fallback-2', cinema: { name: fallbackCinemas[0].name }, show_time: new Date(new Date(eventRes.data.starts_at).getTime() - 20 * 60000).toISOString(), language: 'Hindi', format: '2D', screen_name: 'Screen 2' },
        ];
        const finalShows = databaseShows.length ? databaseShows : fallback;
        setShowtimes(finalShows);
        setSelectedShow(finalShows[0]);
      } catch (err: any) {
        setError(err.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId]);

  const handleSeatClick = (seatId: string) => {
    setBookingError('');
    setSelectedSeatIds((prev) => prev.includes(seatId) ? prev.filter((id) => id !== seatId) : prev.length >= 4 ? prev : [...prev, seatId]);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeatIds.length) return;
    setIsBooking(true);
    setBookingError('');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setBookingError('Please log in before booking your seats.');
      setIsBooking(false);
      return;
    }
    const { error: rpcError } = await supabase.rpc('book_seats', { p_event_id: eventId, p_seat_ids: selectedSeatIds });
    setIsBooking(false);
    if (rpcError) setBookingError(rpcError.message);
    else router.push('/my-bookings');
  };

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const movieDate = event ? new Date(event.starts_at) : new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => new Date(movieDate.getTime() + i * 86400000));

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-[#e83f57]" /></div>;
  if (error || !event) return <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f7] p-8"><div className="rounded-xl bg-white p-8 text-center shadow"><h2 className="text-xl font-bold">Movie not found</h2><p className="mt-2 text-gray-500">{error}</p><Link href="/events" className="mt-5 inline-block text-[#e83f57]">Back to movies</Link></div></div>;

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#222]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <Link href="/events" className="rounded-full p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></Link>
          <div><h1 className="text-lg font-bold">{event.title}</h1><p className="text-xs text-gray-500">MovieClick • Chennai</p></div>
          <Link href="/my-bookings" className="ml-auto text-sm font-semibold text-[#e83f57]">My Bookings</Link>
        </div>
      </header>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            <img src={event.cover_image_url || 'https://placehold.co/180x260/18181b/ffffff?text=MovieClick'} alt="" className="hidden h-44 w-28 rounded-lg object-cover shadow md:block" />
            <div className="flex-1"><h2 className="text-3xl font-bold md:text-4xl">{event.title}</h2><div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600"><span className="rounded-full border px-3 py-1">Movie runtime: 3h 17m</span><span className="rounded-full border px-3 py-1">A</span><span className="rounded-full border px-3 py-1">Action</span><span className="rounded-full border px-3 py-1">Crime</span><span className="rounded-full border px-3 py-1">Thriller</span></div><p className="mt-4 max-w-3xl text-sm text-gray-500">{event.description || 'Book your cinema tickets and choose your preferred seats.'}</p></div>
          </div>
        </div>
        <div className="overflow-x-auto border-t"><div className="mx-auto flex max-w-7xl min-w-max px-5">
          {dateOptions.map((d, i) => <button key={i} className={`w-20 border-b-2 px-2 py-4 text-center ${i === 0 ? 'border-[#e83f57] text-[#e83f57]' : 'border-transparent text-gray-600'}`}><div className="text-xs font-semibold uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div><div className="text-xl font-bold">{d.getDate()}</div><div className="text-[10px] uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</div></button>)}
        </div></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 flex items-center gap-3 text-sm text-gray-600"><span className="rounded border px-3 py-1 font-medium">Hindi - 2D</span><span><Info className="mr-1 inline h-4 w-4" />Cancellation available on selected shows</span></div>
        <div className="space-y-3">
          {showtimes.map((show) => {
            const active = selectedShow?.id === show.id;
            const time = new Date(show.show_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return <div key={show.id} className={`rounded-xl border bg-white p-5 transition ${active ? 'border-[#e83f57] shadow-sm' : 'border-gray-200'}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1"><div className="flex items-center gap-2 text-lg font-semibold"><span className="rounded-md border px-2 py-1 text-xs text-[#e83f57]">{show.cinemas?.brand || 'Cinema'}</span>{show.cinemas?.name || show.cinema?.name || event.venue}</div><p className="mt-1 text-sm text-gray-500">Non-cancellable • {show.screen_name || 'Screen 1'}</p></div>
                <button onClick={() => { setSelectedShow(show); setSelectedSeatIds([]); }} className={`min-w-28 rounded-md border-2 px-5 py-3 text-sm font-semibold transition ${active ? 'border-[#e83f57] bg-[#e83f57] text-white' : 'border-green-600 text-gray-800 hover:bg-green-50'}`}>{time}</button>
                <button onClick={() => { setSelectedShow(show); setSelectedSeatIds([]); document.getElementById('seat-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-md bg-[#e83f57] px-5 py-3 text-sm font-bold text-white hover:bg-[#d92f49]">Select Seats</button>
              </div>
            </div>;
          })}
        </div>
      </section>

      <section id="seat-section" className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#e83f57]">Step 2 of 2</p><h2 className="mt-1 text-2xl font-bold">Select Seats</h2><p className="text-sm text-gray-500">{selectedShow ? `${selectedShow.cinemas?.name || selectedShow.cinema?.name || event.venue} • ${new Date(selectedShow.show_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'Choose a showtime above'}</p></div><div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="h-4 w-4" /> Chennai <ChevronDown className="h-4 w-4" /></div></div>
          {bookingError && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">{bookingError}</div>}
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div><SeatMap seats={seats} selectedSeatIds={selectedSeatIds} onSeatClick={handleSeatClick} maxSeats={4} /><SeatLegend /><div className="mt-5 flex items-center justify-center gap-6 text-xs text-gray-500"><span><i className="mr-1 inline-block h-3 w-3 rounded border border-green-500" />Available</span><span><i className="mr-1 inline-block h-3 w-3 rounded bg-gray-200" />Sold</span><span><i className="mr-1 inline-block h-3 w-3 rounded bg-green-600" />Selected</span></div></div>
            <BookingSummary selectedSeats={selectedSeats} eventPrice={event.price} onConfirm={handleConfirmBooking} isBooking={isBooking} />
          </div>
        </div>
      </section>
    </main>
  );
}
