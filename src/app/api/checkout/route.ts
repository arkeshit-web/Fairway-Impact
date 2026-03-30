import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
})

export async function GET(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  // Auto-provision product for simplified developer experience
  const products = await stripe.products.search({ query: `name:'Golf Charity'` })
  let priceId = ''
  
  if (products.data.length > 0) {
    const prices = await stripe.prices.list({ product: products.data[0].id })
    priceId = prices.data[0].id
  } else {
    // Create product and price on the fly
    const product = await stripe.products.create({ name: 'Golf Charity Subscription' })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1999, // $19.99
      currency: 'usd',
      recurring: { interval: 'month' },
    })
    priceId = price.id
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard`,
    client_reference_id: user.id, // Store supabase user id to link in webhook
    customer_email: user.email,
  })

  return NextResponse.redirect(session.url as string)
}
