const fetch = require('node-fetch');

(async () => {
  const response = await fetch('https://lxlkxbrtvnapqhoanarp.supabase.co/rest/v1/LearningMaterial?select=*', {
    headers: {
      'apikey': 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR',
      'Authorization': 'Bearer sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR'
    }
  });
  const data = await response.json();
  console.log("LearningMaterial Data:", JSON.stringify(data, null, 2));
})();
