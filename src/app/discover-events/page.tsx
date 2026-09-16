'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Filter, MapPin, Music, PartyPopper, Search, Sparkles, Ticket, Users } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';

const eventData = [
  { id: 'sounds-of-india', title: 'VIR DAS - SOUNDS OF INDIA - CHENNAI', category: 'Comedy', date: '31 Oct', venue: 'Sir Mutha Venkatasubba Rao Concert Hall', area: 'Chennai', price: 799, tone: 'from-amber-300 via-orange-400 to-red-500', icon: '🎤', featured: true },
  { id: 'tabla-poetry', title: 'Tabla Poetry By Bhupendra Singh', category: 'Music', date: '20 Sep', venue: 'Music Academy Mini Hall', area: 'Chennai', price: 499, tone: 'from-violet-950 via-purple-800 to-fuchsia-500', icon: '🥁', featured: true },
  { id: 'sundance', title: 'Casa Grand Sundance', category: 'Experiences', date: '17 Sep onwards', venue: 'Casagrand Suncity', area: 'Chennai', price: 399, tone: 'from-slate-950 via-cyan-900 to-emerald-400', icon: '✨', featured: false },
  { id: 'kids-running', title: 'Chennai Kids Running Festival 2026', category: 'Sports', date: '20 Sep', venue: 'SDAT - Nehru Park', area: 'Chennai', price: 299, tone: 'from-sky-400 via-blue-600 to-indigo-900', icon: '🏃', featured: true },
  { id: 'marine-kingdom', title: 'VGP Marine Kingdom - Chennai', category: 'Activities', date: '17 Sep onwards', venue: 'VGP Marine Kingdom', area: 'Chennai', price: 650, tone: 'from-cyan-300 via-blue-700 to-slate-950', icon: '🌊', featured: false },
  { id: 'gokul-insecure', title: 'Insecure by Gokul Kumar', category: 'Comedy', date: '20 Sep', venue: 'Medai - The Stage, Alwarpet', area: 'Chennai', price: 399, tone: 'from-indigo-950 via-blue-800 to-black', icon: '😂', featured: false },
  { id: 'akshay-live', title: 'Akshay Srivastava Live Standup Comedy', category: 'Comedy', date: '19 Sep', venue: 'Trinity Studio, Kodambakkam', area: 'Chennai', price: 499, tone: 'from-blue-950 via-blue-700 to-slate-900', icon: '🎙️', featured: false },
  { id: 'clat-tour', title: 'All India CLAT GK Tour', category: 'Education', date: '20 Sep', venue: 'Chennai', area: 'Chennai', price: 249, tone: 'from-emerald-400 via-green-700 to-yellow-300', icon: '📚', featured: false },
  { id: 'hug-therapy', title: 'Hug Therapy', category: 'Experiences', date: '17 Sep', venue: 'Chennai', area: 'Chennai', price: 499, tone: 'from-lime-300 via-amber-600 to-stone-800', icon: '🤝', featured: false },
];

const categories = ['All', 'Comedy', 'Music', 'Sports', 'Activities', 'Experiences', 'Education'];

export default function DiscoverEventsPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');

  const filtered = useMemo(() => {
    const result = eventData.filter((item) => (category === 'All' || item.category === category) && `${item.title} ${item.venue} ${item.area}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'date') return [...result].sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }, [category, search, sort]);

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-gray-900 dark:bg-[#080b12] dark:text-gray-100">
      <section className="border-b bg-white dark:border-gray-800 dark:bg-[#0d111c]">
        <div className="mx-auto max-w-7xl px-5 py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e83f57]"><Sparkles className="h-4 w-4" /> Live experiences</div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Events in Chennai</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Comedy, music, family activities, learning experiences and more — all in one place.</p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events, venues or areas" className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#e83f57] dark:border-gray-700 dark:bg-gray-900" />
            </div>
          </div>
          <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? 'border-[#e83f57] bg-[#e83f57] text-white' : 'border-gray-200 bg-white hover:border-[#e83f57] dark:border-gray-700 dark:bg-gray-900'}`}>{item}</button>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-2xl font-black">Outdoor Events</h2><p className="mt-1 text-sm text-gray-500">Hand-picked experiences and activities</p></div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <label className="text-sm text-gray-500">Sort</label>
            <div className="relative"><select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-semibold outline-none dark:border-gray-700 dark:bg-gray-900"><option value="popular">Popular</option><option value="date">Date</option><option value="price">Price</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" /></div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <Link href={`/discover-events/${item.id}`} key={item.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#111722] dark:ring-white/5">
              <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${item.tone} p-5`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.28),transparent_32%)]" />
                <div className="relative flex h-full flex-col justify-between text-white">
                  <div className="flex items-center justify-between"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{item.category}</span>{item.featured && <span className="rounded-full bg-[#e83f57] px-3 py-1 text-xs font-bold">FEATURED</span>}</div>
                  <div><div className="mb-5 text-7xl drop-shadow-xl">{item.icon}</div><p className="text-sm font-semibold text-white/75">{item.date}</p><h3 className="mt-1 text-xl font-black leading-tight">{item.title}</h3></div>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <p className="flex gap-2 text-sm text-gray-500 dark:text-gray-400"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{item.venue} · {item.area}</p>
                <div className="flex items-center justify-between"><span className="text-sm font-bold">₹{item.price} onwards</span><span className="flex items-center gap-1 text-sm font-bold text-[#e83f57]">View <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
              </div>
            </Link>
          ))}
        </div>
        {!filtered.length && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-14 text-center dark:border-gray-700 dark:bg-gray-900"><PartyPopper className="mx-auto h-9 w-9 text-gray-400" /><h3 className="mt-3 font-bold">No events found</h3><p className="mt-1 text-sm text-gray-500">Try another category or search term.</p></div>}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><CalendarDays className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">Plan by date</h3><p className="mt-1 text-sm text-gray-500">Browse upcoming experiences and weekend plans.</p></div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><Users className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">For every group</h3><p className="mt-1 text-sm text-gray-500">Find family, friends, comedy, music and learning experiences.</p></div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><Ticket className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">Simple ticketing</h3><p className="mt-1 text-sm text-gray-500">Keep your MovieClick tickets and bookings together.</p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
