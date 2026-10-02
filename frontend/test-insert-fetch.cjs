const supabaseUrl = 'https://lxlkxbrtvnapqhoanarp.supabase.co';
const supabaseKey = 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR';

const payload = {
  id: `w_${Date.now()}`,
  title: 'Test',
  description: 'Test',
  date: null,
  time: '10:00 AM',
  duration: '30 Days',
  location: 'Remote',
  posterUrl: '',
  externalUrl: '',
  capacity: 50,
  status: 'PUBLISHED',
  updatedAt: new Date().toISOString(),
};

fetch(`${supabaseUrl}/rest/v1/Workshop`, {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
