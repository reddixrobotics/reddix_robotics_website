import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxlkxbrtvnapqhoanarp.supabase.co';
const supabaseKey = 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
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
  
  const { data, error } = await supabase.from('Workshop').insert(payload).select().single();
  console.log('Error:', JSON.stringify(error, null, 2));
}
testInsert();
