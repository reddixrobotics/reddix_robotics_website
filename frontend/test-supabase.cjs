const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('ContactMessage').insert({
    name: 'Test',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'Test Subject',
    message: 'Test Message',
    updatedAt: new Date().toISOString()
  }).select().single();
  
  console.log('Result:', { data, error });
}
test();
