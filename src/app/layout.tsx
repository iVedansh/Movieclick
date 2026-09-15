import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieClick",
  description: "Book movie tickets easily with MovieClick",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a
              href="/events"
              className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              MovieClick
            </a>

            <div className="flex gap-6 items-center">
              <a
                href="/events"
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Movies
              </a>

              <a
                href="/my-bookings"
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                My Bookings
              </a>

              <a
                href="/login"
                className="text-sm font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
