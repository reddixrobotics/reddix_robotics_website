const fs = require('fs');
let text = fs.readFileSync('frontend/src/pages/admin/AdminCompany.tsx', 'utf8');

const search = '<Building size={18} className="text-red-500" />\n              General Information\n            </h2>\n\n            <div className="space-y-3">\n              <label className="block text-xs font-bold text-content-secondary uppercase">Company Name</label>';

const replace = \<Building size={18} className="text-red-500" />
              General Information
            </h2>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-content-secondary uppercase">Company Photo (Public)</label>
              <div className="flex items-center gap-4">
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Company" className="w-32 h-20 object-cover rounded border border-border" />
                )}
                <div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-500 file:text-white cursor-pointer" />
                  {uploadingImage && <span className="text-xs text-red-400 ml-2 animate-pulse">Uploading...</span>}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-content-secondary uppercase">Company Name</label>\;

// Handle both CRLF and LF safely by using regex
const regex = /<Building size=\{18\} className="text-red-500" \/>\r?\n\s*General Information\r?\n\s*<\/h2>\r?\n\r?\n\s*<div className="space-y-3">\r?\n\s*<label className="block text-xs font-bold text-content-secondary uppercase">Company Name<\/label>/;

if (regex.test(text)) {
  fs.writeFileSync('frontend/src/pages/admin/AdminCompany.tsx', text.replace(regex, replace));
  console.log('Success');
} else {
  console.log('Regex did not match');
}
