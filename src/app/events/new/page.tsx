'use client';

import React, { useState } from 'react';
import { EventForm } from '@/components/EventForm';
import { supabase } from '@/lib/supabaseClient';
import { EventFormData } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: EventFormData, coverImage: File | null) => {
    setIsSubmitting(true);
    setError('');

    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      setError('You must be logged in to create an event');
      setIsSubmitting(false);
      return;
    }

    let cover_image_url = undefined;

    if (coverImage) {
      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('event-covers').upload(filePath, coverImage);
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}. Make sure you created the 'event-covers' bucket.`);
        setIsSubmitting(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('event-covers').getPublicUrl(filePath);
      cover_image_url = publicUrl;
    }

    const { error: insertError } = await supabase.from('events').insert({
      title: data.title,
      description: data.description,
      venue: data.venue,
      starts_at: data.starts_at,
      price: data.price,
      rows: data.rows,
      cols: data.cols,
      owner_id: userData.user.id,
      cover_image_url,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
    } else {
      router.push('/events');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to events
        </Link>
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create New Event</h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">Set up your event and start selling tickets in minutes.</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
