import Link from 'next/link';
import { Github, Mail, MapPin, Ticket } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-[#18191d] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/events" className="text-2xl font-black tracking-tight">
              <span className="text-[#e83f57]">Movie</span>Click
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              Discover movies, live events and sports, choose your experience and book with ease.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://github.com/iVedansh" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full border border-white/10 p-2.5 transition hover:bg-white/10"><Github className="h-4 w-4" /></a>
              <a href="mailto:vedanshmishra467@gmail.com" aria-label="Email" className="rounded-full border border-white/10 p-2.5 transition hover:bg-white/10"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Explore</h3>
            <div className="mt-4 space-y-3 text-sm text-white/55">
              <Link className="block hover:text-white" href="/events">Movies</Link>
              <Link className="block hover:text-white" href="/discover-events">Events</Link>
              <Link className="block hover:text-white" href="/sports">Sports</Link>
              <Link className="block hover:text-white" href="/my-bookings">My Bookings</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>
            <div className="mt-4 space-y-3 text-sm text-white/55">
              <Link className="block hover:text-white" href="/events/new">List Your Show</Link>
              <Link className="block hover:text-white" href="/login">Sign In</Link>
              <Link className="block hover:text-white" href="/signup">Create Account</Link>
              <a className="block hover:text-white" href="mailto:vedanshmishra467@gmail.com?subject=MovieClick%20Support">Contact Support</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">About MovieClick</h3>
            <div className="mt-4 space-y-3 text-sm text-white/55">
              <p className="flex gap-2"><Ticket className="mt-0.5 h-4 w-4 shrink-0" /> Cinema-style booking experience</p>
              <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Built for a multi-city experience</p>
              <p className="pt-2 text-white/80">Designed & developed by <strong className="text-white">Vedansh Mishra</strong></p>
              <p>SRM Kattankulathur, Chennai • EEE</p>
              <a className="block hover:text-white" href="mailto:vedanshmishra467@gmail.com">vedanshmishra467@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 MovieClick. All rights reserved.</span>
          <span>MovieClick is a project/demo booking platform.</span>
        </div>
      </div>
    </footer>
  );
}
