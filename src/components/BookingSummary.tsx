import React from 'react';
import { IndianRupee, Ticket } from 'lucide-react';
import { Seat } from './SeatMap';

interface BookingSummaryProps {
  selectedSeats: Seat[];
  eventPrice: number;
  onConfirm: () => void;
  isBooking: boolean;
  movieTitle?: string;
  cinemaName?: string;
  showTime?: string;
}

export function BookingSummary({
  selectedSeats,
  eventPrice,
  onConfirm,
  isBooking,
  movieTitle,
  cinemaName,
  showTime,
}: BookingSummaryProps) {
  if (selectedSeats.length === 0) return null;

  const total = selectedSeats.reduce((sum, seat) => {
    const override = (seat as Seat & { price_override?: number }).price_override;
    return sum + (Number(override) || Number(eventPrice));
  }, 0);

  return (
    <aside className="sticky top-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-[#242424] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-[#f84464]" />
          <h3 className="font-bold">Booking Summary</h3>
        </div>
        {movieTitle && <p className="mt-2 truncate text-sm font-semibold text-white/90">{movieTitle}</p>}
        {cinemaName && <p className="mt-1 truncate text-xs text-white/60">{cinemaName}{showTime ? ` • ${showTime}` : ''}</p>}
      </div>

      <div className="p-5">
        <div className="mb-5 space-y-2">
          {selectedSeats.map((seat) => {
            const override = (seat as Seat & { price_override?: number }).price_override;
            const seatPrice = Number(override) || Number(eventPrice);
            return (
              <div key={seat.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <div>
                  <p className="font-bold text-gray-900">{seat.label}</p>
                  <p className="text-xs capitalize text-gray-500">{seat.category} seat</p>
                </div>
                <span className="flex items-center font-semibold text-gray-800">
                  <IndianRupee className="mr-0.5 h-3.5 w-3.5" />{seatPrice}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4">
          <div className="flex items-center justify-between text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="flex items-center text-[#e83f57]">
              <IndianRupee className="mr-0.5 h-4 w-4" />{total}
            </span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={isBooking}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f84464] py-3.5 font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#e63858] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBooking ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Confirming...</>
          ) : 'Proceed to Payment'}
        </button>
        <p className="mt-3 text-center text-[11px] text-gray-400">Prototype checkout • no real payment is processed</p>
      </div>
    </aside>
  );
}
