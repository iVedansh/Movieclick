'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, IndianRupee, Ticket } from 'lucide-react';

export default function OrganiserDashboard() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<any>(null);
  const [stats, setStats] = useState({ seatsSold: 0, revenue: 0, totalSeats: 0 });
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          setError('Not authenticated');
          return;
        }

        const [eventRes, seatsRes, bookingsRes] = await Promise.all([
          supabase.from('events').select('*').eq('id', eventId).single(),
          supabase.from('seats').select('id, price_override, category').eq('event_id', eventId),
          supabase.from('bookings').select('*, seats(id, label, category, price_override)').eq('event_id', eventId).eq('status', 'booked')
        ]);

        if (eventRes.error) throw eventRes.error;
        if (seatsRes.error) throw seatsRes.error;
        if (bookingsRes.error) throw bookingsRes.error;

        if (eventRes.data.owner_id !== userData.user.id) {
          throw new Error('Unauthorized: You are not the owner of this event');
        }

        setEvent(eventRes.data);

        const totalSeats = seatsRes.data.length;
        const seatsSold = bookingsRes.data.length;
        const revenue = bookingsRes.data.reduce((sum, b) => {
           return sum + (Number(b.seats.price_override) || Number(eventRes.data.price));
        }, 0);

        setStats({ seatsSold, revenue, totalSeats });
        setAttendees(bookingsRes.data);

      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [eventId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-12 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md w-full">
        <h3 className="font-bold text-lg mb-2">Error</h3>
        <p>{error}</p>
        <Link href="/events" className="mt-4 inline-block text-blue-600 hover:underline font-medium">Return to events</Link>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to events
        </Link>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Organiser Dashboard</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">{event.title}</p>
          </div>
          <Link href={`/checkin/${eventId}`} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            Launch QR Scanner
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Ticket className="w-24 h-24 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Seats Sold</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white">{stats.seatsSold} <span className="text-2xl text-gray-400 font-medium">/ {stats.totalSeats}</span></p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <IndianRupee className="w-24 h-24 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white flex items-center">
                <IndianRupee className="w-8 h-8 mr-1 text-gray-400" />
                {stats.revenue}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Occupancy</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white">
                {stats.totalSeats > 0 ? Math.round((stats.seatsSold / stats.totalSeats) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendee List</h2>
          </div>
          
          {attendees.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No bookings yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">User ID</th>
                    <th className="px-8 py-4">Seat</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Price Paid</th>
                    <th className="px-8 py-4">Booked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {attendees.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-8 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{booking.user_id.substring(0, 8)}...</td>
                      <td className="px-8 py-4 font-bold text-gray-900 dark:text-white">{booking.seats.label}</td>
                      <td className="px-8 py-4 text-sm capitalize text-gray-600 dark:text-gray-300">
                        {booking.seats.category === 'premium' ? 
                            <span className="text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/30 px-2.5 py-0.5 rounded-md">Premium</span> : 
                            'Standard'
                        }
                      </td>
                      <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <IndianRupee className="w-3 h-3 mr-0.5 text-gray-400" />
                        {booking.seats.price_override || event.price}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(booking.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
