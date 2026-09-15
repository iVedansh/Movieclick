'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckinPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string}>({ type: 'info', message: 'Waiting for scan...' });
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setStatus({ type: 'error', message: 'Not authenticated' });
        return;
      }

      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
      
      if (error || !data) {
        setStatus({ type: 'error', message: 'Event not found' });
        return;
      }

      if (data.owner_id !== userData.user.id) {
        setStatus({ type: 'error', message: 'Unauthorized. Only the event owner can check in guests.' });
        return;
      }

      setEvent(data);

      // Initialize scanner after event is verified
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          if (scannerRef.current?.getState() !== 2) return; // NOT_SCANNING
          scannerRef.current.pause(true);
          processCheckin(decodedText);
        },
        () => {} // ignore normal scanning errors
      );
    }
    
    init();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [eventId]);

  const processCheckin = async (bookingId: string) => {
    setStatus({ type: 'info', message: 'Processing ticket...' });
    
    try {
      const { data, error } = await supabase.from('bookings').select('*, seats(label)').eq('id', bookingId).single();
      
      if (error || !data) throw new Error('Invalid ticket: Booking not found');
      if (data.event_id !== eventId) throw new Error('Invalid ticket: Booking is for a different event');
      if (data.status !== 'booked') throw new Error(`Invalid ticket: Booking was ${data.status}`);
      if (data.checked_in_at) throw new Error(`Already checked in at ${new Date(data.checked_in_at).toLocaleTimeString()}`);
      
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ checked_in_at: new Date().toISOString() })
        .eq('id', bookingId);
        
      if (updateError) throw updateError;
      
      setStatus({ type: 'success', message: `Valid Ticket! Seat ${data.seats.label} checked in.` });
      
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
    
    // Resume scanning after 3 seconds
    setTimeout(() => {
      setStatus({ type: 'info', message: 'Waiting for next scan...' });
      if (scannerRef.current) {
        scannerRef.current.resume();
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href={`/events/${eventId}/dashboard`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Ticket Scanner</h1>
          <p className="text-gray-500 dark:text-gray-400">{event?.title || 'Loading...'}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none mb-8">
          <div id="reader" className="w-full rounded-2xl overflow-hidden [&>div]:border-none [&>div]:!bg-transparent [&_video]:rounded-xl mb-6"></div>
          
          <div className={`p-4 rounded-2xl flex items-center gap-3 transition-colors ${
            status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            status.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {status.type === 'success' && <CheckCircle className="w-6 h-6 flex-shrink-0" />}
            {status.type === 'error' && <XCircle className="w-6 h-6 flex-shrink-0" />}
            {status.type === 'info' && <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
            
            <p className="font-semibold text-lg">{status.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
