import { supabase } from '@/lib/supabaseClient';
import { EventCard } from '@/components/EventCard';
import { EventSearch } from '@/components/EventSearch';
import Link from 'next/link';
import { Film, Search, Ticket, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  let query = supabase.from('events').select('*').order('starts_at', { ascending: true });
  if (search) query = query.or(`title.ilike.%${search}%,venue.ilike.%${search}%`);
  const { data: events, error } = await query;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/events" className="flex items-center gap-2.5 text-xl font-black tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20"><Film className="h-5 w-5" /></span>
            Movie<span className="text-red-500">Click</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-semibold text-zinc-300">
            <Link href="/events" className="text-white">Movies</Link>
            <Link href="/my-bookings" className="flex items-center gap-1.5 hover:text-white"><Ticket className="h-4 w-4" /> My Bookings</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(220,38,38,.22),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(127,29,29,.16),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-red-500">Your cinema. Your seats.</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">Movies worth <span className="text-red-500">watching.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">Discover what&apos;s playing, pick your showtime, choose your seats and book in a few clicks.</p>
          <div className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-2 backdrop-blur-md">
            <Search className="ml-3 h-5 w-5 text-zinc-500" />
            <div className="flex-1"><EventSearch /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-red-500">MovieClick</p><h2 className="text-3xl font-black sm:text-4xl">Now Showing</h2></div>
          <span className="hidden text-sm text-zinc-500 sm:block">{events?.length || 0} movies available</span>
        </div>
        {error && <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-5 text-red-300">Unable to load movies: {error.message}</div>}
        {!events?.length && !error ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-14 text-center">
            <Film className="mx-auto mb-5 h-12 w-12 text-zinc-600" /><h3 className="text-2xl font-bold">No movies found</h3>
            <p className="mx-auto mt-2 max-w-md text-zinc-500">Try another search or add a movie from the existing event management flow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{events?.map((event) => <EventCard key={event.id} {...event} />)}</div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-900 to-red-950/30 p-7 sm:flex-row sm:items-center sm:p-9">
          <div><h3 className="text-2xl font-black">Ready for your next movie?</h3><p className="mt-1 text-zinc-400">Pick a movie above and choose your perfect seats.</p></div>
          <Link href="/my-bookings" className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200">View my bookings <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
