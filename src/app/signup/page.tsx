import { createClient } from '@/lib/supabase/server'
import SignupForm from './SignupForm'

export default async function SignupPage() {
  const supabase = createClient()
  
  // Fetch charities for the user to select
  const { data: charities } = await supabase.from('charities').select('*').order('name')

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 relative min-h-[calc(100vh-80px)]">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3">Join the Movement</h1>
          <p className="text-zinc-400 text-lg font-medium">Subscribe, track your Stableford scores, and win big—while giving back.</p>
        </div>

        <SignupForm charities={charities || []} />
        
      </div>
    </div>
  )
}
