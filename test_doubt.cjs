const fetch = require('node-fetch');

(async () => {
  const response = await fetch('https://lxlkxbrtvnapqhoanarp.supabase.co/rest/v1/Doubt?select=*', {
    headers: {
      'apikey': 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR',
      'Authorization': 'Bearer sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR'
    }
  });
  if (response.ok) {
    console.log("Doubt table EXISTS");
  } else {
    console.log("Doubt table DOES NOT EXIST or Error:", response.status, await response.text());
  }
})();
