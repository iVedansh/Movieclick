'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Play, Search, Star, Ticket } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import SiteFooter from '@/components/SiteFooter';

const demoMovies = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', title: 'Mirzapur: The Movie', venue: 'PVR: Heritage RSL ECR, Chennai', starts_at: '2026-09-20T10:30:00+05:30', price: 202, cover_image_url: 'https://placehold.co/600x900/171717/ffffff?text=MIRZAPUR%3A+THE+MOVIE', rating: '9.1', votes: '99.4K+', genre: 'Action / Crime / Thriller' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', title: 'Haiwaan', venue: 'HDFC Millennium PVR, Chennai', starts_at: '2026-09-21T12:00:00+05:30', price: 180, cover_image_url: 'https://placehold.co/600x900/0b1220/ffffff?text=HAIWAAN', rating: '6.0', votes: '2.9K+', genre: 'Action / Crime / Thriller' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', title: 'Last Man in Tower', venue: 'Cinepolis: BSR Mall, OMR', starts_at: '2026-09-22T11:00:00+05:30', price: 160, cover_image_url: 'https://placehold.co/600x900/292524/ffffff?text=LAST+MAN+IN+TOWER', rating: '8.8', votes: '190+', genre: 'Drama' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', title: 'Resident Evil', venue: 'AGS Cinemas, T Nagar', starts_at: '2026-09-23T14:00:00+05:30', price: 190, cover_image_url: 'https://placehold.co/600x900/111827/ef4444?text=RESIDENT+EVIL', rating: '8.4', votes: '33.5K+', genre: 'Action / Horror / Sci-Fi / Thriller' },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', title: 'Sardar 2', venue: 'PVR: Heritage RSL ECR, Chennai', starts_at: '2026-09-24T13:00:00+05:30', price: 175, cover_image_url: 'https://placehold.co/600x900/431407/ffffff?text=SARDAR+2', rating: '8.0', votes: '10.6K+', genre: 'Action / Thriller' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('search') || '');
    async function load() {
      const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: true });
      setEvents(data?.length ? data : demoMovies);
      setLoading(false);
    }
    load();
  }, []);

  const movies = useMemo(() => (events.length ? events : demoMovies).filter((m) => `${m.title} ${m.venue}`.toLowerCase().includes(search.toLowerCase())), [events, search]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#222] transition-colors dark:bg-[#080b12] dark:text-gray-100">
      <section className="mx-auto max-w-7xl px-5 pt-6"><div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#261317] via-[#581c2b] to-[#111827] p-7 text-white shadow-lg shadow-black/10 md:p-10"><div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#e83f57]/25 blur-3xl" /><div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" /><div className="relative"><p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-red-200">Your movie destination</p><h1 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">Book movies. Pick your seats. Enjoy the show.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 md:text-base">Discover movies, compare showtimes, choose your cinema and reserve the seats you want — all in one place.</p><div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur"><Ticket className="mr-2 inline h-4 w-4" />Easy booking</span><span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur"><CalendarDays className="mr-2 inline h-4 w-4" />Multiple shows</span></div></div></div></section>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-9"><div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black tracking-tight md:text-3xl">Recommended Movies</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Now showing and upcoming near you</p></div><Link href="/events" className="hidden items-center gap-1 text-sm font-bold text-[#e83f57] sm:flex">See All <ChevronRight className="h-4 w-4" /></Link></div>{loading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />)}</div> : movies.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{movies.map((movie) => <Link key={movie.id} href={`/events/${movie.id}`} className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#111722] dark:ring-white/5"><div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800"><img src={movie.cover_image_url || `https://placehold.co/600x900/18181b/ffffff?text=${encodeURIComponent(movie.title)}`} alt={movie.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 pt-14 text-white"><div className="flex items-center gap-1 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {movie.rating || '8.0'} <span className="font-normal text-white/65">{movie.votes || '1K+'} Votes</span></div></div><div className="absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white opacity-0 shadow-lg transition group-hover:opacity-100"><Play className="h-4 w-4 fill-current" /></div></div><div className="p-3.5"><h3 className="truncate font-bold text-gray-900 dark:text-white">{movie.title}</h3><p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{movie.genre || 'Action / Thriller'}</p><p className="mt-2 text-xs font-semibold text-gray-400 dark:text-gray-500">Tickets from ₹{movie.price}</p></div></Link>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900"><Search className="mx-auto h-8 w-8 text-gray-400" /><p className="mt-3 font-bold">No movies found</p><p className="mt-1 text-sm text-gray-500">Try another movie, cinema or show name.</p></div>}</section>
      <SiteFooter />
    </main>
  );
}
