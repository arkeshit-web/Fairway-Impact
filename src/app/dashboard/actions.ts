'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitScore(prevState: any, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const score = parseInt(formData.get('score') as string)
  const dateStr = formData.get('date') as string
  
  if (isNaN(score) || score < 1 || score > 45) {
    return { error: 'Invalid score. Must be between 1 and 45.' }
  }

  // Fetch existing scores for user
  const { data: scores } = await supabase
    .from('scores')
    .select('id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // PRD: Store last 5 scores only. New score replaces oldest automatically.
  if (scores && scores.length >= 5) {
    // Determine how many we need to delete to make room for 1 more (cap at 5 max total)
    const excessCount = (scores.length - 5) + 1;
    const idsToDelete = scores.slice(0, excessCount).map(s => s.id)
    
    await supabase.from('scores').delete().in('id', idsToDelete)
  }

  // Insert new score
  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    score,
    date: dateStr || new Date().toISOString()
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
