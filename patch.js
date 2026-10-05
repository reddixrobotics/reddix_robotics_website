const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminCompany.tsx', 'utf8');

code = code.replace(/const payload = \{[\s\S]*?longitude: formData\.longitude !== null \? Number\(formData\.longitude\) : null,\r?\n\s*\};\r?\n\r?\n\s*try \{\r?\n\s*const \{ supabase \} = await import\('@\/lib\/supabase'\);\r?\n\s*const \{ data: existing \} = await supabase\.from\('CompanyInformation'\)\.select\('id, socialLinks'\)\.single\(\);/, 
\    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: existing } = await supabase.from('CompanyInformation').select('id, socialLinks').single();
      
      const payload: any = {
        ...formData,
        latitude: formData.latitude !== null ? Number(formData.latitude) : null,
        longitude: formData.longitude !== null ? Number(formData.longitude) : null,
        socialLinks: { ...(existing?.socialLinks || {}), imageUrl: formData.imageUrl }
      };
      delete payload.imageUrl;\);

fs.writeFileSync('frontend/src/pages/admin/AdminCompany.tsx', code);
