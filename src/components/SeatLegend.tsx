import React from 'react';

export function SeatLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-6 text-sm mt-8 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
        <span className="text-gray-600 dark:text-gray-300 font-medium">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t border-2 border-blue-600 bg-blue-600 shadow-sm shadow-blue-500/40"></div>
        <span className="text-gray-600 dark:text-gray-300 font-medium">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-gray-200 dark:bg-gray-800"></div>
        <span className="text-gray-500 dark:text-gray-400 font-medium">Booked / Held</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30"></div>
        <span className="text-amber-700 dark:text-amber-400 font-medium">Premium</span>
      </div>
    </div>
  );
}
