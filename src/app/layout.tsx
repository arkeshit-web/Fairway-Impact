import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fairway Impact | Golf Charity Platform",
  description: "Play golf, support charity, and win prizes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-zinc-950 text-zinc-50 selection:bg-emerald-500/30`}>
        <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-100 transition-all">
                FairwayImpact
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold hover:text-emerald-400 transition-colors">
                    Dashboard
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold hover:text-emerald-400 transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm font-bold bg-emerald-500 text-zinc-950 px-6 py-2.5 rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                    Subscribe
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
