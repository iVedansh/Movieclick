'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, Search, ShieldCheck, Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { SeatMap, Seat } from '@/components/SeatMap';
import { SeatLegend } from '@/components/SeatLegend';
import { BookingSummary } from '@/components/BookingSummary';

type Showtime = { id: string; event_id: string; cinema_id: string; show_time: string; language: string; format: string; screen_name: string; cinemas?: { id: string; name: string; location: string; brand: string } | null };
type ActiveBooking = { seat_id: string; status: string; showtime_id?: string | null };

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
const formatTime = (value: string) => new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<any>(null);
  const [baseSeats, setBaseSeats] = useState<Seat[]>([]);
  const [activeSeats, setActiveSeats] = useState<Seat[]>([]);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShow, setSelectedShow] = useState<Showtime | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const refreshSeatAvailability = (show: Showtime | null, sourceSeats = baseSeats, bookings = activeBookings) => {
    const bookedIds = new Set(bookings.filter((b) => b.showtime_id === show?.id).map((b) => b.seat_id));
    setActiveSeats(sourceSeats.map((seat) => ({ ...seat, status: bookedIds.has(seat.id) ? 'booked' : 'available' })));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [eventRes, seatsRes, bookingsRes, showsRes] = await Promise.all([
          supabase.from('events').select('*').eq('id', eventId).single(),
          supabase.from('seats').select('*').eq('event_id', eventId).order('seat_row').order('seat_col'),
          supabase.from('bookings').select('seat_id, status, showtime_id').eq('event_id', eventId).in('status', ['booked', 'held']),
          supabase.from('showtimes').select('*, cinemas(*)').eq('event_id', eventId).order('show_time'),
        ]);
        if (eventRes.error) throw eventRes.error;
        if (seatsRes.error) throw seatsRes.error;
        if (bookingsRes.error) throw bookingsRes.error;
        if (showsRes.error) throw showsRes.error;

        const sourceSeats = (seatsRes.data || []) as Seat[];
        const shows = (showsRes.data || []) as Showtime[];
        const bookings = (bookingsRes.data || []) as ActiveBooking[];
        setEvent(eventRes.data);
        setBaseSeats(sourceSeats);
        setActiveBookings(bookings);
        setShowtimes(shows);
        if (shows.length) {
          setSelectedShow(shows[0]);
          setSelectedDate(shows[0].show_time.slice(0, 10));
          const bookedIds = new Set(bookings.filter((b) => b.showtime_id === shows[0].id).map((b) => b.seat_id));
          setActiveSeats(sourceSeats.map((seat) => ({ ...seat, status: bookedIds.has(seat.id) ? 'booked' : 'available' })));
        } else {
          setActiveSeats(sourceSeats);
        }
      } catch (err: any) {
        setError(err.message || 'Unable to load this movie.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId]);

  const dateOptions = useMemo(() => Array.from(new Set(showtimes.map((show) => show.show_time.slice(0, 10)))).sort(), [showtimes]);
  const filteredShows = useMemo(() => showtimes.filter((show) => show.show_time.slice(0, 10) === selectedDate), [showtimes, selectedDate]);
  const selectedSeats = activeSeats.filter((seat) => selectedSeatIds.includes(seat.id));
  const selectedCinema = selectedShow?.cinemas?.name || event?.venue || '';

  const chooseShow = (show: Showtime) => {
    setSelectedShow(show);
    setSelectedSeatIds([]);
    setBookingError('');
    refreshSeatAvailability(show);
    document.getElementById('seat-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chooseDate = (date: string) => {
    setSelectedDate(date);
    const first = showtimes.find((show) => show.show_time.slice(0, 10) === date) || null;
    setSelectedShow(first);
    setSelectedSeatIds([]);
    setBookingError('');
    refreshSeatAvailability(first);
  };

  const handleSeatClick = (seatId: string) => {
    setBookingError('');
    setSelectedSeatIds((current) => current.includes(seatId) ? current.filter((id) => id !== seatId) : current.length >= 4 ? current : [...current, seatId]);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeatIds.length || !selectedShow) return;
    setIsBooking(true);
    setBookingError('');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setBookingError('Please log in before booking your seats.');
      setIsBooking(false);
      return;
    }
    const { error: rpcError } = await supabase.rpc('book_seats', { p_event_id: eventId, p_seat_ids: selectedSeatIds, p_showtime_id: selectedShow.id });
    setIsBooking(false);
    if (rpcError) {
      setBookingError(rpcError.message);
      return;
    }
    router.push('/my-bookings');
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#f84464]" /></div>;
  if (error || !event) return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] p-6"><div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5"><h2 className="text-xl font-bold">Movie not found</h2><p className="mt-2 text-sm text-gray-500">{error || 'This movie is unavailable.'}</p><Link href="/events" className="mt-5 inline-flex rounded-lg bg-[#f84464] px-5 py-3 font-semibold text-white">Back to movies</Link></div></div>;

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#222]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5"><Link href="/events" className="rounded-full p-2 transition hover:bg-gray-100" aria-label="Back"><ArrowLeft className="h-5 w-5" /></Link><Link href="/events" className="text-xl font-black tracking-tight"><span className="text-[#f84464]">Movie</span>Click</Link><div className="relative ml-4 hidden max-w-lg flex-1 md:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input className="h-10 w-full rounded-md bg-gray-100 pl-10 pr-4 text-sm outline-none" placeholder="Search for Movies, Cinemas and Shows" /></div><Link href="/my-bookings" className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100">My Bookings</Link></div></header>

      <section className="bg-[#171717] text-white"><div className="mx-auto flex max-w-7xl gap-7 px-5 py-7 md:py-9"><img src={event.cover_image_url} alt={event.title} className="hidden h-64 w-44 rounded-xl object-cover shadow-2xl md:block" /><div className="flex min-w-0 flex-1 flex-col justify-center"><div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">MovieClick • Chennai</div><h1 className="text-3xl font-black tracking-tight md:text-5xl">{event.title}</h1><div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80"><span className="rounded border border-white/20 px-3 py-1.5">2D</span><span className="rounded border border-white/20 px-3 py-1.5">Action</span><span className="rounded border border-white/20 px-3 py-1.5">Thriller</span><span className="rounded border border-white/20 px-3 py-1.5">UA / A</span></div><div className="mt-5 flex flex-wrap gap-5 text-sm text-white/70"><span><Star className="mr-1 inline h-4 w-4 fill-yellow-400 text-yellow-400" />8.4/10</span><span>Multiple languages</span><span>2h 30m</span></div><p className="mt-4 max-w-3xl text-sm leading-6 text-white/65">{event.description || 'Choose a date, cinema, showtime and your preferred seats.'}</p></div></div></section>

      <section className="border-b border-gray-200 bg-white"><div className="mx-auto max-w-7xl px-5"><div className="flex items-center gap-2 border-b py-4 text-sm text-gray-500"><CalendarDays className="h-4 w-4" /> Select date</div><div className="flex overflow-x-auto">{dateOptions.map((date) => { const active = date === selectedDate; const dateValue = `${date}T12:00:00+05:30`; return <button key={date} onClick={() => chooseDate(date)} className={`min-w-24 border-b-2 px-4 py-4 text-center transition ${active ? 'border-[#f84464] text-[#f84464]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}><div className="text-[11px] font-bold uppercase">{new Date(dateValue).toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })}</div><div className="text-2xl font-black">{new Date(dateValue).getDate()}</div><div className="text-[11px] font-semibold uppercase">{new Date(dateValue).toLocaleDateString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' })}</div></button>; })}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-7"><div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-bold">{selectedDate ? formatDate(`${selectedDate}T12:00:00+05:30`) : 'Showtimes'}</h2><p className="mt-1 text-sm text-gray-500">Select a cinema and showtime</p></div><div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="h-4 w-4" /> Chennai</div></div><div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold">From ₹{event.price}</span><span className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold">{filteredShows.length} showtimes</span></div><div className="space-y-3">{filteredShows.map((show) => { const active = selectedShow?.id === show.id; const cinema = show.cinemas; return <div key={show.id} className={`rounded-2xl border bg-white p-5 transition ${active ? 'border-[#f84464] shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'}`}><div className="flex flex-col gap-5 lg:flex-row lg:items-center"><div className="flex min-w-0 flex-1 items-start gap-4"><div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f84464]/10 font-black text-[#f84464] sm:flex">{(cinema?.brand || 'MC').slice(0, 2).toUpperCase()}</div><div className="min-w-0"><h3 className="truncate font-bold text-gray-900">{cinema?.name || event.venue}</h3><p className="mt-1 text-xs text-gray-500">{cinema?.location || 'Chennai'} • {show.screen_name}</p><div className="mt-2 flex gap-2 text-[11px] text-gray-500"><span>{show.language}</span><span>•</span><span>{show.format}</span></div></div></div><div className="flex flex-wrap gap-2"><button onClick={() => chooseShow(show)} className={`min-w-28 rounded-lg border-2 px-5 py-3 text-sm font-bold transition ${active ? 'border-[#f84464] bg-[#f84464] text-white' : 'border-green-600 bg-white text-green-700 hover:bg-green-50'}`}>{formatTime(show.show_time)}</button><button onClick={() => chooseShow(show)} className="rounded-lg bg-[#f84464] px-5 py-3 text-sm font-bold text-white hover:bg-[#e63858]">Select Seats</button></div></div></div>; })}{!filteredShows.length && <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-gray-500">No shows are available for this date.</div>}</div></section>

      <section id="seat-section" className="scroll-mt-16 border-t border-gray-200 bg-white py-9"><div className="mx-auto max-w-7xl px-5"><div className="mb-6 flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f84464]">Step 2</p><h2 className="mt-1 text-2xl font-black">Select Seats</h2><p className="mt-1 text-sm text-gray-500">{selectedShow ? `${selectedCinema} • ${formatDate(selectedShow.show_time)} • ${formatTime(selectedShow.show_time)} • ${selectedShow.screen_name}` : 'Select a showtime above'}</p></div><div className="flex items-center gap-2 text-xs text-gray-500"><ShieldCheck className="h-4 w-4 text-green-600" /> Secure seat selection</div></div>{bookingError && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{bookingError}</div>}{!selectedShow ? <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-gray-500">Choose a showtime to open the seat map.</div> : <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"><div><SeatMap seats={activeSeats} selectedSeatIds={selectedSeatIds} onSeatClick={handleSeatClick} maxSeats={4} /><SeatLegend /><div className="mt-3 text-center text-xs text-gray-400">You can select up to 4 seats</div></div><BookingSummary selectedSeats={selectedSeats} eventPrice={Number(event.price) || 0} onConfirm={handleConfirmBooking} isBooking={isBooking} movieTitle={event.title} cinemaName={selectedCinema} showTime={formatTime(selectedShow.show_time)} /></div>}</div></section>

      <footer className="border-t bg-[#242424] py-8 text-center text-xs text-white/45">MovieClick • Cinema ticket booking prototype • Chennai</footer>
    </main>
  );
}
