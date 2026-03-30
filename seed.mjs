import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  const charities = [
    { name: 'Global Water Initiative', description: 'Providing clean water to remote villages.', image_url: 'https://images.unsplash.com/photo-1541888081682-1df8155d8fbf?w=500', is_featured: true },
    { name: 'Trees for Tomorrow', description: 'Reforestation efforts in critical ecosystems.', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500', is_featured: false },
    { name: 'Youth Golf Foundation', description: 'Bringing golf to underprivileged youth.', image_url: 'https://images.unsplash.com/photo-1593111774240-d529f12eb4fc?w=500', is_featured: true },
    { name: 'Cancer Support Society', description: 'Supporting patients and families through difficult times.', image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500', is_featured: false },
  ];
  const { data, error } = await supabase.from('charities').select('*');
  if (data && data.length > 0) {
    console.log('Charities already seeded.');
    return;
  }
  for (const c of charities) {
    const { error } = await supabase.from('charities').insert(c);
    if (error) console.error('Error seeding:', c.name, error);
  }
  console.log('Seeded successfully.');
}
seed();
