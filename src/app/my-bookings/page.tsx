'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setError('You must be logged in to view your bookings');
        setLoading(false);
        return;
      }

      // Fetch bookings with event and seat details
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          events (
            id,
            title,
            venue,
            starts_at,
            price
          ),
          seats (
            label,
            category,
            price_override
          )
        `)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelingId(bookingId);
    
    const { error } = await supabase.rpc('cancel_booking', {
      p_booking_id: bookingId
    });

    setCancelingId('');

    if (error) {
      alert(`Failed to cancel booking: ${error.message}`);
    } else {
      fetchBookings(); // refresh the list
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">My Bookings</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        {bookings.length === 0 && !error ? (
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No bookings yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">You haven't booked any seats yet. Find an upcoming event and secure your spot.</p>
            <Link href="/events" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:bg-blue-700 hover:-translate-y-1">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const event = booking.events;
              const seat = booking.seats;
              const date = new Date(event.starts_at).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const price = seat.price_override ?? event.price;
              const isPastEvent = new Date(event.starts_at) <= new Date();
              const isCanceled = booking.status === 'cancelled';
              const canCancel = !isPastEvent && !isCanceled;

              return (
                <div key={booking.id} className={`bg-white dark:bg-gray-900 rounded-3xl p-6 border ${isCanceled ? 'border-gray-200 dark:border-gray-800 opacity-60' : 'border-gray-100 dark:border-gray-800'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</h3>
                      {isCanceled && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Cancelled</span>
                      )}
                      {!isCanceled && isPastEvent && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Past</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl w-fit">
                      <div className="text-center px-3 border-r border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-0.5">Seat</div>
                        <div className="font-bold text-gray-900 dark:text-white">{seat.label}</div>
                      </div>
                      <div className="text-center px-3 border-r border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-0.5">Type</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{seat.category}</div>
                      </div>
                      <div className="text-center px-3">
                        <div className="text-xs text-gray-500 mb-0.5">Paid</div>
                        <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <IndianRupee className="w-3 h-3" />
                          {price}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 min-w-[140px] items-center md:items-stretch">
                    {!isCanceled && !isPastEvent && (
                      <div className="bg-white p-2 rounded-xl border border-gray-200 w-fit mx-auto md:mx-0 shadow-sm">
                        <QRCodeSVG value={booking.id} size={100} />
                      </div>
                    )}
                    <Link href={`/events/${event.id}`} className="text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-colors">
                      View Event
                    </Link>
                    {canCancel && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelingId === booking.id}
                        className="text-center bg-white dark:bg-gray-900 border-2 border-red-100 hover:border-red-500 dark:border-red-900/30 dark:hover:border-red-600 text-red-600 dark:text-red-400 font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {cancelingId === booking.id ? 'Canceling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
