import { createAdminClient } from '@/lib/supabase/server'
import DrawButton from './DrawButton'
import { Users, DollarSign, Gift, CheckCircle } from 'lucide-react'
import { approveWinner, markPaid } from './actions'

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  // High-level analytics
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: subsCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).in('status', ['active', 'trialing'])
  
  // Current Prize Pool Estimation ($10 from each $19.99 goes to pool)
  const activeSubs = subsCount || 0
  const prizePool = activeSubs > 0 ? activeSubs * 10 : 1000

  // Recent Winners requiring Verification
  const { data: winners } = await supabase
    .from('winners')
    .select('*, users(email)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Recent Draws
  const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(5)

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Command Center</h1>
          <p className="text-zinc-400 font-medium mt-1">Manage users, run draws, and verify charity payouts.</p>
        </div>
        <DrawButton />
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2 text-zinc-400">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold">Total Users</h3>
          </div>
          <p className="text-3xl font-black text-white">{usersCount || 0}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2 text-zinc-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Active Subs</h3>
          </div>
          <p className="text-3xl font-black text-white">{subsCount || 0}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:col-span-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full" />
          <div className="flex items-center gap-3 mb-2 text-zinc-400">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold">Estimated Prize Pool</h3>
          </div>
          <p className="text-3xl font-black text-white">${prizePool.toFixed(2)}</p>
          <p className="text-xs text-zinc-500 mt-2">Assuming $19.99 plan (50% to prize, 10% charity)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Winners Verification Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" /> Winner Verification Queue
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Match</th>
                  <th className="p-4 font-semibold">Prize</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {winners?.map((w) => (
                  <tr key={w.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 text-sm text-zinc-300">{w.users?.email}</td>
                    <td className="p-4 text-sm text-zinc-300 font-bold">{w.match_type} Numbers</td>
                    <td className="p-4 text-sm text-emerald-400 font-bold">${Number(w.prize_amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        w.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        w.status === 'approved' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {w.status === 'pending' && (
                        <form action={approveWinner.bind(null, w.id)}>
                          <button className="text-xs font-bold text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 px-3 py-1.5 rounded-md transition-colors">Approve Proof</button>
                        </form>
                      )}
                      {w.status === 'approved' && (
                        <form action={markPaid.bind(null, w.id)}>
                          <button className="text-xs font-bold text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-md transition-colors">Mark Paid</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {(!winners || winners.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-600 font-medium">No winners recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Draws */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Historical Draws
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            {draws?.map((d) => (
              <div key={d.id} className="border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                <div className="text-sm font-semibold text-zinc-400 mb-1">Month {d.month} / {d.year}</div>
                <div className="flex gap-2">
                  {d.winning_numbers.map((n: number, i: number) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-black text-sm">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(!draws || draws.length === 0) && (
              <div className="text-zinc-600 text-sm font-medium">No draws have been executed yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
