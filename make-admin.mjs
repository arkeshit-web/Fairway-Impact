import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeAdmin() {
  // Update all current test users to be 'admin' to save the user time
  const { data, error } = await supabase.from('users').update({ role: 'admin' }).neq('id', '00000000-0000-0000-0000-000000000000').select()
  if (error) { 
    console.error('Error:', error)
  } else {
    console.log(`Successfully upgraded ${data.length} user(s) to Admin!`)
  }
}
makeAdmin()
