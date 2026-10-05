(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient('https://lxlkxbrtvnapqhoanarp.supabase.co', 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR');
  const { data, error } = await supabase.from('Workshop').select('id, title').order('created_at');
  console.log("Error:", error);
  console.log("Data:", data);
})();
