'use client';

import React from 'react';

export type SeatStatus = 'available' | 'booked' | 'held';

export interface Seat {
  id: string;
  label: string;
  seat_row: number;
  seat_col: number;
  category: 'standard' | 'premium';
  status: SeatStatus;
  price_override?: number | null;
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSeatClick: (seatId: string) => void;
  maxSeats?: number;
}

export function SeatMap({ seats, selectedSeatIds, onSeatClick, maxSeats = 4 }: SeatMapProps) {
  const maxRow = Math.max(...seats.map((seat) => seat.seat_row), 1);
  const maxCol = Math.max(...seats.map((seat) => seat.seat_col), 1);

  const rows = Array.from({ length: maxRow }, (_, rowIndex) => {
    const row = rowIndex + 1;
    return Array.from({ length: maxCol }, (_, colIndex) => {
      const col = colIndex + 1;
      return seats.find((seat) => seat.seat_row === row && seat.seat_col === col);
    });
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="mx-auto min-w-max rounded-2xl border border-gray-200 bg-[#fafafa] p-6 shadow-sm sm:p-8">
        <div className="mb-9 select-none text-center">
          <div className="relative mx-auto max-w-2xl">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#f84464] to-transparent opacity-80" />
            <div className="mx-auto mt-2 h-8 w-3/4 rounded-full bg-[#f84464]/10 blur-xl" />
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400">Screen this way</p>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          {rows.map((rowSeats, rowIndex) => {
            const rowNumber = rowIndex + 1;
            const rowLetter = String.fromCharCode(64 + rowNumber);
            return (
              <div key={rowNumber} className="flex items-center gap-2">
                <div className="w-7 text-center text-[11px] font-bold text-gray-400">{rowLetter}</div>
                <div className="flex gap-1.5 sm:gap-2">
                  {rowSeats.map((seat, colIndex) => {
                    if (!seat) return <div key={`empty-${rowIndex}-${colIndex}`} className="h-8 w-8 sm:h-9 sm:w-9" />;

                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isAvailable = seat.status === 'available';
                    const isMaxReached = selectedSeatIds.length >= maxSeats && !isSelected;
                    const disabled = !isAvailable || isMaxReached;
                    const isPremium = seat.category === 'premium';

                    let classes = 'relative flex h-8 w-8 items-center justify-center rounded-t-lg rounded-b-md border text-[10px] font-bold transition sm:h-9 sm:w-9 sm:text-xs ';
                    if (!isAvailable) {
                      classes += 'cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400';
                    } else if (isSelected) {
                      classes += 'scale-105 border-[#f84464] bg-[#f84464] text-white shadow-md shadow-red-500/25';
                    } else if (isPremium) {
                      classes += 'cursor-pointer border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-500 hover:bg-amber-100';
                    } else {
                      classes += 'cursor-pointer border-green-500 bg-white text-green-700 hover:bg-green-50';
                    }
                    if (isMaxReached && isAvailable) classes += ' cursor-not-allowed opacity-40';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSeatClick(seat.id)}
                        className={classes}
                        aria-label={`${seat.label} - ${isAvailable ? 'Available' : 'Unavailable'}`}
                        title={!isAvailable ? 'Unavailable' : isMaxReached && !isSelected ? `Maximum ${maxSeats} seats` : seat.label}
                      >
                        {seat.seat_col}
                        {!isAvailable && <span className="absolute inset-x-1 top-1/2 h-px rotate-45 bg-gray-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-gray-200 pt-5 text-xs text-gray-500">
          <span><i className="mr-1.5 inline-block h-3.5 w-3.5 rounded border border-green-500 bg-white align-[-2px]" />Available</span>
          <span><i className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-[#f84464] align-[-2px]" />Selected</span>
          <span><i className="mr-1.5 inline-block h-3.5 w-3.5 rounded border border-amber-300 bg-amber-50 align-[-2px]" />Premium</span>
          <span><i className="mr-1.5 inline-block h-3.5 w-3.5 rounded bg-gray-200 align-[-2px]" />Sold</span>
        </div>
      </div>
    </div>
  );
}
