import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';

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
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Link href={`/events/${id}`} className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {cover_image_url ? (
          <img src={cover_image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/20 flex items-center justify-center">
            <span className="text-blue-300 dark:text-blue-700/50 text-6xl font-bold opacity-50">{title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
           <IndianRupee className="w-4 h-4" />
           {price === 0 ? 'Free' : price}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        
        <div className="flex flex-col gap-3 mt-auto text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
