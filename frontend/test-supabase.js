import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://lxlkxbrtvnapqhoanarp.supabase.co', 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR');
async function test() {
  const { data: d1, error: e1 } = await supabase.from('FeaturedProject').select('*').limit(1);
  console.log('FeaturedProject:', e1 ? e1.message : 'SUCCESS');
  
  const { data: d2, error: e2 } = await supabase.from('featured_projects').select('*').limit(1);
  console.log('featured_projects:', e2 ? e2.message : 'SUCCESS');

  const { data: d3, error: e3 } = await supabase.from('featured_project').select('*').limit(1);
  console.log('featured_project:', e3 ? e3.message : 'SUCCESS');
}
test();
