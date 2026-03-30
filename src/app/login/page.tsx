'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login } from '@/app/auth/actions'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null)

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-8 font-medium">Log in to track your scores and impact.</p>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-all"
              placeholder="golfer@example.com"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="text-red-400 text-sm font-medium bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20">
              {state.error}
            </div>
          )}

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        <p className="text-zinc-400 mt-8 text-sm font-medium">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Subscribe & Play
          </Link>
        </p>
      </div>
    </div>
  )
}
