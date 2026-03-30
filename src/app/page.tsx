import Link from 'next/link'
import { Heart, Trophy, Target, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-[20%] w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-[10%] w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 md:px-6 text-center z-10 min-h-[85vh]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
          <Heart className="w-4 h-4 fill-emerald-400" />
          <span>Play with Purpose</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 max-w-5xl leading-[1.1]">
          Turn Every Round Into <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Real Impact.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 font-medium">
          The first golf subscription platform that rewards your Stableford scores while supporting world-changing charities.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 bg-emerald-500 text-zinc-950 font-bold text-lg px-8 py-4 rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
            Subscribe Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/charities" className="flex items-center justify-center font-bold text-lg text-white px-8 py-4 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors">
            Explore Causes
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-900/50 border-t border-zinc-800 backdrop-blur-sm z-10 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg">A seamless cycle of playing, winning, and giving.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-950/80 p-8 rounded-3xl border border-zinc-800">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">1. Log Scores</h3>
              <p className="text-zinc-400 leading-relaxed">
                Enter your latest Stableford score (1-45). Your last 5 scores are kept in the pool for the monthly draw.
              </p>
            </div>
            
            <div className="bg-zinc-950/80 p-8 rounded-3xl border border-zinc-800">
              <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">2. Win Big</h3>
              <p className="text-zinc-400 leading-relaxed">
                Match 3, 4, or 5 numbers in our monthly draws. The prize pool splits 40/35/25, with rolling jackpots!
              </p>
            </div>
            
            <div className="bg-zinc-950/80 p-8 rounded-3xl border border-zinc-800">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">3. Give Back</h3>
              <p className="text-zinc-400 leading-relaxed">
                A minimum of 10% of your subscription goes directly to the charity you choose. Play with purpose.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
