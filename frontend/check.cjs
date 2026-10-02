const supabaseUrl = 'https://lxlkxbrtvnapqhoanarp.supabase.co';
fetch(`${supabaseUrl}/rest/v1/Workshop?select=*`, {
  headers: {
    // We don't have the key, but maybe anon reads are allowed?
  }
}).then(r => r.json()).then(console.log).catch(console.error);
