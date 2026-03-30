import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  
  // Basic authorization: user must have role 'admin'
  if (profile?.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
          <p className="text-zinc-400">You do not have permission to view the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {children}
      </div>
    </div>
  )
}
