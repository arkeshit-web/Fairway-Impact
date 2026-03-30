'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { Heart, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 text-lg rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-2 mt-6"
    >
      {pending ? 'Creating Impact...' : 'Subscribe & Make an Impact'}
    </button>
  )
}

export default function SignupForm({ charities }: { charities: any[] }) {
  const [state, formAction] = useFormState(signup, null)
  const [selectedCharity, setSelectedCharity] = useState<string>('')

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none transition-all"
            placeholder="hero@example.com"
          />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          <h2 className="text-xl font-bold text-white">Choose Your Cause</h2>
        </div>
        <p className="text-zinc-400 text-sm mb-4">A portion of your subscription directly supports the charity of your choice.</p>
        
        <input type="hidden" name="charity_id" value={selectedCharity} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {charities.map((charity) => (
            <div 
              key={charity.id}
              onClick={() => setSelectedCharity(charity.id)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all p-4 ${
                selectedCharity === charity.id 
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/20' 
                : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-600'
              }`}
            >
              {selectedCharity === charity.id && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
              <h3 className="font-bold text-white mb-1 pr-6">{charity.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2">{charity.description}</p>
            </div>
          ))}
        </div>
      </div>

      {state?.error && (
        <div className="text-red-400 text-sm font-medium bg-red-400/10 py-3 px-4 rounded-xl border border-red-400/20 mt-4">
          {state.error}
        </div>
      )}

      <SubmitButton />

      <p className="text-zinc-400 mt-6 text-center text-sm font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
          Log in
        </Link>
      </p>
    </form>
  )
}
