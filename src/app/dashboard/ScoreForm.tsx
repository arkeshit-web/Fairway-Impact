'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitScore } from './actions'
import { Target } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 mt-4 flex items-center justify-center gap-2"
    >
      <Target className="w-5 h-5" />
      {pending ? 'Saving...' : 'Add Score'}
    </button>
  )
}

export default function ScoreForm() {
  const [state, formAction] = useFormState(submitScore, null)

  return (
    <form action={formAction} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />
      
      <h3 className="text-xl font-bold text-white mb-1">Enter Latest Score</h3>
      <p className="text-sm text-zinc-400 mb-6 font-medium">Your last 5 Stableford scores enter the monthly draw.</p>

      <div className="space-y-4 relative z-10">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Score (1-45)</label>
          <input
            type="number"
            name="score"
            min="1"
            max="45"
            required
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600"
            placeholder="e.g. 36"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Date Played</label>
          <input
            type="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition-all [color-scheme:dark]"
          />
        </div>

        {state?.error && (
          <div className="text-red-400 text-sm font-medium bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20">
            {state.error}
          </div>
        )}
        
        {state?.success && (
          <div className="text-emerald-400 text-sm font-medium bg-emerald-400/10 py-2 px-3 rounded-md border border-emerald-400/20">
            Score successfully added!
          </div>
        )}

        <SubmitButton />
      </div>
    </form>
  )
}
