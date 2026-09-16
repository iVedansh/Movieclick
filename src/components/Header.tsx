'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  ChevronDown,
  Check,
  MapPin,
  Moon,
  Search,
  Sun,
  User,
  LogOut,
  Ticket,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const locations = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState('Chennai');
  const [dark, setDark] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLocation = window.localStorage.getItem('movieclick-location');
    const savedTheme = window.localStorage.getItem('movieclick-theme');
    if (savedLocation) setLocation(savedLocation);

    const shouldUseDark = savedTheme === 'dark';
    setDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);

    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
      if (!locationRef.current?.contains(target)) setLocationOpen(false);
    };
    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('movieclick-theme', next ? 'dark' : 'light');
  };

  const selectLocation = (value: string) => {
    setLocation(value);
    window.localStorage.setItem('movieclick-location', value);
    setLocationOpen(false);
    setLocationSearch('');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push('/events');
    router.refresh();
  };

  const filteredLocations = locations.filter((item) =>
    item.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const initials = user?.email?.slice(0, 1).toUpperCase() || 'U';
  const isMovies = pathname.startsWith('/events');
  const isBookings = pathname.startsWith('/my-bookings');

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-[#0d111c]/95">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-5 lg:gap-7">
        <Link href="/events" className="shrink-0 text-[25px] font-black tracking-[-0.04em] text-gray-950 dark:text-white">
          <span className="text-[#e83f57]">Movie</span>Click
        </Link>

        <div className="relative hidden max-w-2xl flex-1 md:block">
          <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(`/events?search=${encodeURIComponent(e.currentTarget.value)}`);
            }}
            placeholder="Search for Movies, Cinemas and Shows"
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#e83f57] focus:bg-white focus:ring-4 focus:ring-[#e83f57]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:bg-gray-900"
          />
        </div>

        <div ref={locationRef} className="relative ml-auto">
          <button
            onClick={() => setLocationOpen((value) => !value)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <MapPin className="h-[18px] w-[18px]" />
            <span className="max-w-[120px] truncate">{location}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
          </button>

          {locationOpen && (
            <div className="absolute right-0 top-12 w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/10 dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Choose your location</p>
                <p className="mt-1 text-xs text-gray-500">Switch city/state anytime</p>
                <input
                  autoFocus
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search a state or union territory"
                  className="mt-3 h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#e83f57] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredLocations.map((item) => {
                  const selected = location === item || (item === 'Tamil Nadu' && location === 'Chennai');
                  return (
                    <button
                      key={item}
                      onClick={() => selectLocation(item === 'Tamil Nadu' ? 'Chennai' : item)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <span>{item}</span>
                      {selected && <Check className="h-4 w-4 text-[#e83f57]" />}
                    </button>
                  );
                })}
                {!filteredLocations.length && <p className="px-3 py-6 text-center text-sm text-gray-500">No location found</p>}
              </div>
            </div>
          )}
        </div>

        <Link href="/my-bookings" className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 sm:flex">
          <Ticket className="h-4 w-4" /> My Bookings
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-gray-700 shadow-sm transition hover:scale-105 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-yellow-300"
        >
          <span className={`absolute transition-all duration-300 ${dark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-8 -rotate-90 opacity-0'}`}><Sun className="h-[18px] w-[18px]" /></span>
          <span className={`absolute transition-all duration-300 ${dark ? 'translate-y-8 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}><Moon className="h-[18px] w-[18px]" /></span>
        </button>

        {user ? (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#e83f57] to-[#a855f7] text-xs font-black text-white">{initials}</span>
              <span className="hidden max-w-[90px] truncate sm:block">Profile</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg font-black">{initials}</span>
                    <div className="min-w-0">
                      <p className="font-bold">MovieClick User</p>
                      <p className="truncate text-xs text-white/60">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/my-bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                    <CalendarDays className="h-4 w-4" /> My bookings
                  </Link>
                  <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="rounded-lg bg-[#e83f57] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d9364f] hover:shadow-md">
            Sign In
          </Link>
        )}
      </div>

      <nav className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-[#0d111c]">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="/events" className={`${isMovies ? 'font-bold text-[#e83f57]' : 'hover:text-gray-950 dark:hover:text-white'}`}>Movies</Link>
          <Link href="/events" className="hidden hover:text-gray-950 dark:hover:text-white sm:block">Stream</Link>
          <Link href="/events" className="hidden hover:text-gray-950 dark:hover:text-white sm:block">Events</Link>
          <Link href="/events" className="hidden hover:text-gray-950 dark:hover:text-white sm:block">Plays</Link>
          <Link href="/events" className="hidden hover:text-gray-950 dark:hover:text-white sm:block">Sports</Link>
          <Link href="/events" className="hidden hover:text-gray-950 dark:hover:text-white sm:block">Activities</Link>
          {isBookings && <span className="ml-auto text-xs font-bold text-[#e83f57]">Your tickets</span>}
        </div>
      </nav>
    </header>
  );
}
