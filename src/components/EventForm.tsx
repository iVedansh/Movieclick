'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { eventSchema, EventFormData } from '@/lib/validation';

interface EventFormProps {
  onSubmit: (data: EventFormData, coverImage: File | null) => void;
  isSubmitting?: boolean;
}

export function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof eventSchema>, unknown, EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      price: 0,
      rows: 10,
      cols: 15,
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, coverImage))} className="space-y-6 max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
      
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Event Cover Image (Optional)</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              {coverImage && <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{coverImage.name}</p>}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCoverImage(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Event Title</label>
        <input
          {...register('title')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g. Coldplay World Tour"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Tell attendees about this event..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Venue</label>
          <input
            {...register('venue')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. O2 Arena"
          />
          {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Time</label>
          <input
            type="datetime-local"
            {...register('starts_at')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {errors.starts_at && <p className="text-red-500 text-sm mt-1">{errors.starts_at.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Base Price (₹)</label>
          <input
            type="number"
            {...register('price')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rows</label>
          <input
            type="number"
            {...register('rows')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {errors.rows && <p className="text-red-500 text-sm mt-1">{errors.rows.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Columns</label>
          <input
            type="number"
            {...register('cols')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {errors.cols && <p className="text-red-500 text-sm mt-1">{errors.cols.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Event...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
}
