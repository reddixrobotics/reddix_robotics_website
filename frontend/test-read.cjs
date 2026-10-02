const supabaseUrl = 'https://lxlkxbrtvnapqhoanarp.supabase.co';
const supabaseKey = 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR';

fetch(`${supabaseUrl}/rest/v1/Workshop?select=*&limit=1`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
