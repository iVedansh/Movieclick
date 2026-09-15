import React from 'react';
import { Seat } from './SeatMap';
import { IndianRupee } from 'lucide-react';

interface BookingSummaryProps {
  selectedSeats: Seat[];
  eventPrice: number;
  onConfirm: () => void;
  isBooking: boolean;
}

export function BookingSummary({ selectedSeats, eventPrice, onConfirm, isBooking }: BookingSummaryProps) {
  if (selectedSeats.length === 0) return null;

  const total = selectedSeats.reduce((sum, seat) => {
    return sum + (Number(seat.price_override) || eventPrice);
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-6">
      <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
        Booking Summary
        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs py-1 px-2 rounded-full">
          {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
        </span>
      </h3>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        {selectedSeats.map(seat => (
          <div key={seat.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <p className="font-semibold">{seat.label}</p>
              <p className="text-xs text-gray-500 capitalize">{seat.category}</p>
            </div>
            <div className="font-medium flex items-center">
              <IndianRupee className="w-3 h-3 mr-0.5 text-gray-400" />
              {Number(seat.price_override) || eventPrice}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="flex items-center text-blue-600 dark:text-blue-400">
            <IndianRupee className="w-5 h-5 mr-0.5" />
            {total}
          </span>
        </div>
      </div>
      
      <button
        onClick={onConfirm}
        disabled={isBooking}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
      >
        {isBooking ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </div>
  );
}
