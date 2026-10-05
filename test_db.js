import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxlkxbrtvnapqhoanarp.supabase.co';
const supabaseKey = 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('CompanyInformation').select('*').limit(1);
  if (error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}
check();
