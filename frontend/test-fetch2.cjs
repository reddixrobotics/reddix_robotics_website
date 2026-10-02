const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function test() {
  const res = await fetch(`${supabaseUrl}/rest/v1/ContactMessage`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      name: 'Test',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'Test Subject',
      message: 'Test Message',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  });
  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Result:', data);
}
test();
