'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Filter, MapPin, Search, Trophy, Users, Zap } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';

const sportsData = [
  { id: 'india-west-indies', title: 'INDIA vs WEST INDIES 2ND ODI', type: 'Cricket', date: '30 Sep', venue: 'ACA Stadium, Guwahati', price: 500, tone: 'from-blue-950 via-blue-700 to-emerald-600', icon: '🏏' },
  { id: 'national-heroes', title: 'RUN FOR OUR NATIONAL HEROES 2026', type: 'Running', date: '28 Sep', venue: 'Olcott Memorial High School, Chennai', price: 649, tone: 'from-orange-300 via-amber-700 to-slate-900', icon: '🏃' },
  { id: 'soldiers-pride', title: 'RUN FOR THE SOLDIERS WITH PRIDE 2026', type: 'Marathon', date: '5 Oct', venue: 'Chennai', price: 399, tone: 'from-slate-900 via-red-700 to-orange-400', icon: '🎖️' },
  { id: 'chess-chai', title: 'Chess - Chai - Connect', type: 'Chess', date: '21 Sep', venue: 'Rotticious, Chennai', price: 249, tone: 'from-amber-100 via-stone-500 to-slate-950', icon: '♟️' },
  { id: 'city-football', title: 'Chennai City Football Cup', type: 'Football', date: '4 Oct', venue: 'Jawaharlal Nehru Stadium, Chennai', price: 599, tone: 'from-emerald-950 via-green-700 to-lime-300', icon: '⚽' },
  { id: 'badminton-open', title: 'Chennai Badminton Open', type: 'Badminton', date: '11 Oct', venue: 'SDAT Indoor Stadium, Chennai', price: 349, tone: 'from-cyan-950 via-blue-700 to-violet-600', icon: '🏸' },
];
const types = ['All', 'Running', 'Cricket', 'Football', 'Chess', 'Badminton', 'Marathon'];

export default function SportsPage() {
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const filtered = useMemo(() => {
    const list = sportsData.filter((item) => (type === 'All' || item.type === type) && `${item.title} ${item.venue} ${item.type}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price') return [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [type, search, sort]);

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-gray-900 dark:bg-[#080b12] dark:text-gray-100">
      <section className="bg-white dark:border-b dark:border-gray-800 dark:bg-[#0d111c]"><div className="mx-auto max-w-7xl px-5 py-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e83f57]"><Trophy className="h-4 w-4" /> Sports & activities</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">Sports in Chennai</h1><p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Find matches, runs, tournaments and community sports experiences.</p></div><div className="relative w-full lg:max-w-sm"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sports, venues or events" className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#e83f57] dark:border-gray-700 dark:bg-gray-900" /></div></div><div className="mt-7 flex gap-2 overflow-x-auto pb-1">{types.map((item) => <button key={item} onClick={() => setType(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${type === item ? 'border-[#e83f57] bg-[#e83f57] text-white' : 'border-gray-200 bg-white hover:border-[#e83f57] dark:border-gray-700 dark:bg-gray-900'}`}>{item}</button>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Sports In Chennai</h2><p className="mt-1 text-sm text-gray-500">Upcoming matches and participation events</p></div><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-gray-400" /><label className="text-sm text-gray-500">Sort</label><div className="relative"><select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-semibold dark:border-gray-700 dark:bg-gray-900"><option value="popular">Popular</option><option value="price">Price</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" /></div></div></div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]"><aside className="hidden h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#111722] lg:block"><h3 className="font-black">Filters</h3><div className="mt-5 space-y-2">{types.slice(1).map((item) => <button key={item} onClick={() => setType(item)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${type === item ? 'bg-[#e83f57]/10 font-bold text-[#e83f57]' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}>{item}<span>›</span></button>)}</div><button onClick={() => { setType('All'); setSearch(''); }} className="mt-5 w-full rounded-lg border py-2 text-sm font-semibold">Clear filters</button></aside>
          <div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <Link key={item.id} href={`/sports/${item.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#111722] dark:ring-white/5"><div className={`relative aspect-[4/5] bg-gradient-to-br ${item.tone} p-5`}><div className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">{item.type}</div><div className="flex h-full flex-col justify-end text-white"><div className="mb-5 text-7xl">{item.icon}</div><p className="text-sm font-semibold text-white/70">{item.date}</p><h3 className="mt-1 text-xl font-black leading-tight">{item.title}</h3></div></div><div className="space-y-3 p-4"><p className="flex gap-2 text-sm text-gray-500 dark:text-gray-400"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{item.venue}</p><div className="flex items-center justify-between"><span className="font-bold">₹{item.price} onwards</span><span className="font-bold text-[#e83f57]">View details →</span></div></div></Link>)}</div>{!filtered.length && <div className="rounded-2xl border border-dashed p-14 text-center"><Zap className="mx-auto h-8 w-8 text-gray-400" /><p className="mt-3 font-bold">No sports events found</p><p className="mt-1 text-sm text-gray-500">Try a different sport or search term.</p></div>}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 pb-12"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><CalendarDays className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">Upcoming calendar</h3><p className="mt-1 text-sm text-gray-500">Keep track of matches, runs and tournaments.</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><Users className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">Play together</h3><p className="mt-1 text-sm text-gray-500">Discover community-friendly sports activities.</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 dark:bg-[#111722]"><Trophy className="h-5 w-5 text-[#e83f57]" /><h3 className="mt-3 font-bold">More than matches</h3><p className="mt-1 text-sm text-gray-500">Explore participation events alongside spectator experiences.</p></div></div></section>
      <SiteFooter />
    </main>
  );
}
