import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ScoreForm from './ScoreForm'
import { Trophy, CalendarDays, Wallet, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase.from('users').select('*, charities(name)').eq('id', user.id).single()
  
  // Fetch scores
  const { data: scores } = await supabase.from('scores').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5)
  
  // Fetch active subscription
  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).in('status', ['active', 'trialing']).maybeSingle()

  // Fetch winnings
  const { data: winnings } = await supabase.from('winners').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  const totalWon = winnings?.reduce((acc: number, curr: any) => acc + Number(curr.prize_amount), 0) || 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Your Dashboard</h1>
          <p className="text-zinc-400 font-medium mt-1">Manage your scores, verify winnings, and track your charity impact.</p>
        </div>
        
        {subscription ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Subscriber
          </div>
        ) : (
          <Link href="#subscribe" className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
            Subscribe Now <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Scores */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Winnings Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 blur-[30px] rounded-full group-hover:bg-teal-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-2 text-teal-400">
                <Trophy className="w-5 h-5" />
                <h3 className="font-bold">Total Won</h3>
              </div>
              <p className="text-4xl font-black text-white">${totalWon.toFixed(2)}</p>
              <div className="mt-4 text-xs font-semibold text-zinc-500">
                {winnings && winnings.length > 0 ? `${winnings.length} prize(s) claimed` : 'No wins yet. Keep playing!'}
              </div>
            </div>

            {/* Impact Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 blur-[30px] rounded-full group-hover:bg-rose-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-2 text-rose-400">
                <Heart className="w-5 h-5 fill-rose-400/20" />
                <h3 className="font-bold">Charity Impact</h3>
              </div>
              <p className="text-xl font-bold text-white leading-tight">
                {profile?.charities?.name || 'No Charity Selected'}
              </p>
              <div className="mt-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                {profile?.contribution_percentage || 10}% Contribution
              </div>
            </div>
          </div>

          {/* Scores List */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Your Recent Scores</h3>
            {scores && scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((score, idx) => (
                  <div key={score.id} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-white font-bold">{score.score} pts</p>
                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> {new Date(score.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* Badge */}
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 font-medium">You haven't entered any scores yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Score Form & Billing */}
        <div className="space-y-6">
          <ScoreForm />
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
             <div className="flex items-center gap-2 mb-4">
               <Wallet className="w-5 h-5 text-zinc-400" />
               <h3 className="font-bold text-white">Subscription Status</h3>
             </div>
             
             {subscription ? (
               <div className="space-y-4">
                 <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 font-semibold text-sm">Plan</span>
                    <span className="text-white font-bold capitalize">{subscription.plan}</span>
                 </div>
                 <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 font-semibold text-sm">Renews</span>
                    <span className="text-white font-bold">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                 </div>
                 <form action="/api/billing" method="POST">
                   <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 text-sm">
                     Manage Billing
                   </button>
                 </form>
               </div>
             ) : (
               <div className="text-center py-6">
                 <p className="text-zinc-400 text-sm mb-4">You must be an active subscriber to participate in the draws.</p>
                 <Link id="subscribe" href="/api/checkout" className="inline-block w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm">
                   Subscribe / Reactivate
                 </Link>
               </div>
             )}
          </div>
        </div>
        
      </div>
    </div>
  )
}
