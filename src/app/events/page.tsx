import { supabase } from '@/lib/supabaseClient';
import { EventCard } from '@/components/EventCard';
import { EventSearch } from '@/components/EventSearch';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';

  let query = supabase.from('events').select('*').order('starts_at', { ascending: true });

  if (search) {
    query = query.or(`title.ilike.%${search}%,venue.ilike.%${search}%`);
  }

  const { data: events, error } = await query;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Upcoming Events</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <EventSearch />
            <Link href="/events/new" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Event</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 border border-red-100 dark:border-red-800">
            Error loading events: {error.message}
          </div>
        )}

        {!events?.length && !error ? (
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-16 text-center border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Be the first to create an amazing event on EventHive and start selling tickets instantly.</p>
            <Link href="/events/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:bg-blue-700 hover:-translate-y-1">
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events?.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
