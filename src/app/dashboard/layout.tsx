import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center bg-zinc-950">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {children}
      </div>
    </div>
  )
}
