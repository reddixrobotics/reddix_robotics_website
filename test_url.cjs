const fetch = require('node-fetch'); // or native fetch in Node 18+

(async () => {
  const response = await fetch('https://lxlkxbrtvnapqhoanarp.supabase.co/rest/v1/LearningMaterial?select=title,material_type,file_path', {
    headers: {
      'apikey': 'sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR',
      'Authorization': 'Bearer sb_publishable_LCZesqt_rrXKWSVWRgu2gA_Iej1R7PR'
    }
  });
  const data = await response.json();
  console.log("Data:", JSON.stringify(data, null, 2));
})();
