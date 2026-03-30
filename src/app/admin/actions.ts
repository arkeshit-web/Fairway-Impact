'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateRandomDraw() {
  const nums = new Set<number>()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(nums)
}

export async function runMonthlyDraw() {
  const supabase = createAdminClient()

  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  // 1. Get total active subscribers to calculate prize pool
  const { count } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).in('status', ['active', 'trialing'])
  const activeSubs = count || 0
  
  // Assume $19.99 subscription, $10 goes to prize pool.
  const basePrizePool = activeSubs > 0 ? activeSubs * 10 : 1000 // default $1000 for demo if 0
  
  // Real logic would calculate previous rollover from past months
  const prizePool5 = basePrizePool * 0.40
  const prizePool4 = basePrizePool * 0.35
  const prizePool3 = basePrizePool * 0.25

  // 2. Generate Winning Numbers
  const winningNumbers = generateRandomDraw()

  // 3. Create Draw Record
  const { data: draw, error: drawErr } = await supabase.from('draws').insert({
    month,
    year,
    winning_numbers: winningNumbers,
    status: 'published'
  }).select().single()

  if (drawErr) throw new Error(drawErr.message)

  // 4. Fetch all user scores
  const { data: allScores } = await supabase.from('scores').select('user_id, score')
  
  // Group scores by user
  const userTickets: Record<string, number[]> = {}
  allScores?.forEach(row => {
    if (!userTickets[row.user_id]) userTickets[row.user_id] = []
    userTickets[row.user_id].push(row.score)
  })

  const winners3: string[] = []
  const winners4: string[] = []
  const winners5: string[] = []

  // 5. Match Scores
  Object.keys(userTickets).forEach(userId => {
    const scores = userTickets[userId]
    // Count how many scores match the winning numbers
    const matchCount = scores.filter(s => winningNumbers.includes(s)).length

    if (matchCount === 3) winners3.push(userId)
    if (matchCount === 4) winners4.push(userId)
    if (matchCount === 5) winners5.push(userId)
  })

  // 6. Distribute Prizes
  const payouts: any[] = []
  if (winners3.length > 0) {
    const split = prizePool3 / winners3.length
    winners3.forEach(uid => payouts.push({ draw_id: draw.id, user_id: uid, match_type: 3, prize_amount: split, status: 'pending' }))
  }
  if (winners4.length > 0) {
    const split = prizePool4 / winners4.length
    winners4.forEach(uid => payouts.push({ draw_id: draw.id, user_id: uid, match_type: 4, prize_amount: split, status: 'pending' }))
  }
  if (winners5.length > 0) {
    const split = prizePool5 / winners5.length
    winners5.forEach(uid => payouts.push({ draw_id: draw.id, user_id: uid, match_type: 5, prize_amount: split, status: 'pending' }))
  }

  if (payouts.length > 0) {
    // @ts-ignore
    await supabase.from('winners').insert(payouts)
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  
  return { success: true, draw: winningNumbers, totalWinners: payouts.length }
}

export async function approveWinner(winnerId: string) {
  const supabase = createAdminClient()
  await supabase.from('winners').update({ status: 'approved' }).eq('id', winnerId)
  revalidatePath('/admin')
}

export async function markPaid(winnerId: string) {
  const supabase = createAdminClient()
  await supabase.from('winners').update({ status: 'paid' }).eq('id', winnerId)
  revalidatePath('/admin')
}
