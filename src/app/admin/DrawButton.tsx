'use client'

import { useTransition } from 'react'
import { runMonthlyDraw } from './actions'
import { Play } from 'lucide-react'

export default function DrawButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(async () => {
        try {
          const res = await runMonthlyDraw()
          if (res.success) {
            alert(`Draw successful! Numbers: ${res.draw.join(', ')} | Winners generated: ${res.totalWinners}`)
          }
        } catch (err: any) {
          alert(`Draw failed: ${err.message}`)
        }
      })}
      disabled={isPending}
      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
    >
      <Play className="w-5 h-5" />
      {isPending ? 'Running Draw Algorithm...' : 'Trigger Monthly Draw'}
    </button>
  )
}
