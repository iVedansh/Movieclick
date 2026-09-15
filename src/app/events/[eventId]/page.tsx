'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SeatMap, Seat } from '@/components/SeatMap';
import { SeatLegend } from '@/components/SeatLegend';
import { BookingSummary } from '@/components/BookingSummary';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventRes, seatsRes, bookingsRes] = await Promise.all([
          supabase.from('events').select('*').eq('id', eventId).single(),
          supabase.from('seats').select('*').eq('event_id', eventId).order('seat_row').order('seat_col'),
          supabase.from('bookings').select('seat_id, status').eq('event_id', eventId).in('status', ['booked', 'held'])
        ]);

        if (eventRes.error) throw eventRes.error;
        if (seatsRes.error) throw seatsRes.error;
        if (bookingsRes.error) throw bookingsRes.error;

        setEvent(eventRes.data);
        
        const bookedSeatIds = bookingsRes.data.map(b => b.seat_id);
        const processedSeats = seatsRes.data.map(seat => ({
          ...seat,
          status: bookedSeatIds.includes(seat.id) ? 'booked' : 'available'
        })) as Seat[];

        setSeats(processedSeats);
      } catch (err: any) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Bonus: Realtime updates
    const channel = supabase
      .channel(`event-${eventId}-bookings`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings', 
        filter: `event_id=eq.${eventId}` 
      }, () => {
        // Simple re-fetch on change
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleSeatClick = (seatId: string) => {
    setBookingError('');
    setSelectedSeatIds(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeatIds.length === 0) return;
    
    setIsBooking(true);
    setBookingError('');

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setBookingError('You must be logged in to book seats');
      setIsBooking(false);
      return;
    }

    const { data, error } = await supabase.rpc('book_seats', {
      p_event_id: eventId,
      p_seat_ids: selectedSeatIds,
    });

    setIsBooking(false);

    if (error) {
      setBookingError(error.message);
    } else {
      router.push('/my-bookings');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>;
  }

  if (error || !event) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-12 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md w-full">
        <h3 className="font-bold text-lg mb-2">Oops!</h3>
        <p>{error || 'Event not found'}</p>
        <Link href="/events" className="mt-4 inline-block text-blue-600 hover:underline font-medium">Return to events</Link>
      </div>
    </div>;
  }

  const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));
  const date = new Date(event.starts_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-12 pb-8 px-6 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to events
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{event.title}</h1>
          {event.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl text-lg leading-relaxed">{event.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300 mt-8">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-full shadow-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-full shadow-sm">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-5 py-2.5 rounded-full shadow-sm">
              <IndianRupee className="w-4 h-4" />
              <span>Base price: {event.price === 0 ? 'Free' : event.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Seats</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You can select up to {4 - selectedSeatIds.length} more {4 - selectedSeatIds.length === 1 ? 'seat' : 'seats'}.</p>
            </div>
          </div>
          
          {bookingError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-100 dark:border-red-800/50 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{bookingError}</span>
            </div>
          )}

          <SeatMap 
            seats={seats} 
            selectedSeatIds={selectedSeatIds} 
            onSeatClick={handleSeatClick} 
            maxSeats={4} 
          />
          <SeatLegend />
        </div>
        
        <div className="lg:col-span-1">
          <BookingSummary 
            selectedSeats={selectedSeats}
            eventPrice={event.price}
            onConfirm={handleConfirmBooking}
            isBooking={isBooking}
          />
        </div>
      </div>
    </div>
  );
}
