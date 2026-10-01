const url = 'https://lxlkxbrtvnapqhoanarp.supabase.co/rest/v1';
const headers = { 'apikey': 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR' };

async function check(table) {
  const res = await fetch(url + '/' + table + '?select=*&limit=1', { headers });
  const text = await res.text();
  console.log(table + ':', res.status, text);
}

async function run() {
  await check('FeaturedProject');
  await check('featured_projects');
  await check('featured_project');
}
run();
