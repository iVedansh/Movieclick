import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee, ArrowRight, Play } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  venue: string;
  starts_at: string;
  price: number;
  cover_image_url?: string;
}

export function EventCard({ id, title, venue, starts_at, price, cover_image_url }: EventCardProps) {
  const date = new Date(starts_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
  const time = new Date(starts_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <Link
      href={`/events/${id}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-red-500/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        {cover_image_url ? (
          <img src={cover_image_url} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-end bg-gradient-to-br from-red-950 via-zinc-900 to-black p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,.28),transparent_45%)]" />
            <span className="relative text-7xl font-black tracking-tighter text-white/20">{title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          NOW SHOWING
        </div>
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white">{title}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 space-y-2.5 text-sm text-zinc-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-500" />
            <span>{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="truncate">{venue}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-zinc-500">Tickets from</p>
            <p className="flex items-center gap-1 text-lg font-bold text-white">
              <IndianRupee className="h-4 w-4" />{price === 0 ? 'Free' : price}
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-red-400 transition-colors group-hover:text-red-300">
            Book now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
