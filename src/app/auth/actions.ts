'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  
  if (authData.user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', authData.user.id).single()
    if (profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const charityId = formData.get('charity_id') as string

  if (!charityId) {
    return { error: "Please select a charity to support." }
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Update chosen charity using admin client to bypass RLS in case email confirm is ON
  if (data.user) {
    const adminSupabase = createAdminClient()
    
    // We might need to wait a second for the DB trigger to create the public.users record
    // In a robust app, you'd use a webhook, but for this demo a simple retry or delay is fine.
    await new Promise(res => setTimeout(res, 800));
    
    await adminSupabase.from('users').update({ selected_charity_id: charityId }).eq('id', data.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
