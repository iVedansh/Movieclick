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
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSeatClick: (seatId: string) => void;
  maxSeats?: number;
}

export function SeatMap({ seats, selectedSeatIds, onSeatClick, maxSeats = 4 }: SeatMapProps) {
  // Find grid dimensions
  const maxRow = Math.max(...seats.map((s) => s.seat_row), 1);
  const maxCol = Math.max(...seats.map((s) => s.seat_col), 1);

  // Group seats by row
  const rows = Array.from({ length: maxRow }, (_, i) => i + 1).map((r) => {
    return Array.from({ length: maxCol }, (_, j) => j + 1).map((c) => {
      return seats.find((s) => s.seat_row === r && s.seat_col === c);
    });
  });

  return (
    <div className="w-full overflow-x-auto pb-6 touch-pan-x">
      <div className="min-w-max mx-auto p-6 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        
        {/* Screen / Stage indicator */}
        <div className="mb-12 relative select-none">
          <div className="h-2 w-4/5 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-16 w-4/5 mx-auto bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl absolute left-1/2 -translate-x-1/2 top-0" />
          <p className="text-center text-xs font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase mt-4">Stage</p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          {rows.map((rowSeats, rIdx) => (
            <div key={rIdx} className="flex gap-2 items-center group">
              <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
                {String.fromCharCode(64 + rowSeats[0]?.seat_row || rIdx + 1)}
              </div>
              <div className="flex gap-3">
                {rowSeats.map((seat, cIdx) => {
                  if (!seat) {
                    return <div key={`empty-${rIdx}-${cIdx}`} className="w-10 h-10" />; // Empty space
                  }

                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isAvailable = seat.status === 'available';
                  const isPremium = seat.category === 'premium';
                  
                  const isMaxReached = selectedSeatIds.length >= maxSeats && !isSelected;
                  const disabled = !isAvailable || isMaxReached;

                  let baseClasses = "relative w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ";
                  
                  if (!isAvailable) {
                    baseClasses += "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed overflow-hidden";
                  } else if (isSelected) {
                    baseClasses += "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 -translate-y-1";
                  } else if (isPremium) {
                    baseClasses += "bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-600/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100 hover:border-amber-400 cursor-pointer hover:-translate-y-1 shadow-sm";
                  } else {
                    baseClasses += "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer hover:-translate-y-1 shadow-sm";
                  }
                  
                  if (isMaxReached && !isSelected && isAvailable) {
                      baseClasses += " opacity-40 hover:translate-y-0 cursor-not-allowed";
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => !disabled && onSeatClick(seat.id)}
                      disabled={disabled}
                      className={baseClasses}
                      aria-label={`${seat.label} - ${isAvailable ? 'Available' : 'Unavailable'}`}
                      title={!isAvailable ? 'Unavailable' : isMaxReached && !isSelected ? `Max ${maxSeats} seats allowed` : seat.label}
                    >
                      {seat.seat_col}
                      {/* Unavailable cross out visual */}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-700/50 rotate-45 pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
