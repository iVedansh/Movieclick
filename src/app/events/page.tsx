'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Star, Play, Ticket, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const demoMovies = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', title: 'Mirzapur: The Movie', venue: 'PVR: Heritage RSL ECR, Chennai', starts_at: '2026-09-15T22:00:00+05:30', price: 202, cover_image_url: 'https://placehold.co/600x900/171717/ffffff?text=MIRZAPUR%3A+THE+MOVIE', rating: '9.1', votes: '99.4K+', genre: 'Action / Crime / Thriller' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', title: 'Haiwaan', venue: 'HDFC Millennium PVR, Chennai', starts_at: '2026-09-15T21:30:00+05:30', price: 180, cover_image_url: 'https://placehold.co/600x900/0b1220/ffffff?text=HAIWAAN', rating: '6.0', votes: '2.9K+', genre: 'Action / Crime / Thriller' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', title: 'Last Man in Tower', venue: 'Cinepolis: BSR Mall, OMR', starts_at: '2026-09-16T21:40:00+05:30', price: 160, cover_image_url: 'https://placehold.co/600x900/292524/ffffff?text=LAST+MAN+IN+TOWER', rating: '8.8', votes: '190+', genre: 'Drama' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', title: 'Resident Evil', venue: 'AGS Cinemas, T Nagar', starts_at: '2026-09-16T22:00:00+05:30', price: 190, cover_image_url: 'https://placehold.co/600x900/111827/ef4444?text=RESIDENT+EVIL', rating: '8.4', votes: '33.5K+', genre: 'Action / Horror / Sci-Fi / Thriller' },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', title: 'Sardar 2', venue: 'PVR: Heritage RSL ECR, Chennai', starts_at: '2026-09-17T21:45:00+05:30', price: 175, cover_image_url: 'https://placehold.co/600x900/431407/ffffff?text=SARDAR+2', rating: '8.0', votes: '10.6K+', genre: 'Action / Thriller' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: true });
      setEvents(data?.length ? data : demoMovies);
      setLoading(false);
    }
    load();
  }, []);

  const movies = useMemo(() => {
    const source = events.length ? events : demoMovies;
    return source.filter((m) => `${m.title} ${m.venue}`.toLowerCase().includes(search.toLowerCase()));
  }, [events, search]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#222]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
          <Link href="/events" className="shrink-0 text-2xl font-black tracking-tight"><span className="text-[#e83f57]">Movie</span>Click</Link>
          <div className="relative hidden max-w-xl flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for Movies, Cinemas and Shows" className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#e83f57]" />
          </div>
          <button className="ml-auto flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4" /> Chennai <ChevronRight className="h-4 w-4 rotate-90" /></button>
          <Link href="/my-bookings" className="hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 sm:block">My Bookings</Link>
        </div>
        <nav className="border-t border-black/5 bg-white"><div className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-3 text-sm"><span className="font-semibold text-[#e83f57]">Movies</span><span>Stream</span><span>Events</span><span>Plays</span><span>Sports</span><span>Activities</span></div></nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#24120f] via-[#6f172a] to-[#171717] p-7 text-white shadow-sm md:p-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-500/30 blur-3xl" />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-200">MovieClick</p>
          <h1 className="max-w-2xl text-3xl font-black md:text-5xl">Book movies. Pick your seats. Enjoy the show.</h1>
          <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">A clean cinema-booking experience built for Chennai moviegoers.</p>
          <div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full bg-white/10 px-4 py-2 text-sm"><Ticket className="mr-2 inline h-4 w-4" />Easy booking</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm"><CalendarDays className="mr-2 inline h-4 w-4" />Multiple shows</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8">
        <div className="mb-5 flex items-end justify-between"><div><h2 className="text-2xl font-bold">Recommended Movies</h2><p className="mt-1 text-sm text-gray-500">Now showing in Chennai</p></div><span className="text-sm font-semibold text-[#e83f57]">See All ›</span></div>
        {loading ? <div className="py-20 text-center text-gray-500">Loading movies…</div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => <Link key={movie.id} href={`/events/${movie.id}`} className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
              <img src={movie.cover_image_url || `https://placehold.co/600x900/18181b/ffffff?text=${encodeURIComponent(movie.title)}`} alt={movie.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-12 text-white"><div className="flex items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {movie.rating || '8.0'} <span className="text-white/70">{movie.votes || '1K+'} Votes</span></div></div>
              <div className="absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white opacity-0 transition group-hover:opacity-100"><Play className="h-4 w-4 fill-current" /></div>
            </div>
            <div className="p-3"><h3 className="truncate font-semibold">{movie.title}</h3><p className="mt-1 truncate text-xs text-gray-500">{movie.genre || 'Action / Thriller'}</p><p className="mt-2 text-xs text-gray-400">Tickets from ₹{movie.price}</p></div>
          </Link>)}
        </div>}
      </section>
    </main>
  );
}
