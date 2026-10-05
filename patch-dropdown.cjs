const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/admin/components/forms/WorkshopForm.tsx', 'utf8');

const regex = /<FormField label="External Website URL \(Optional\)">[\s\S]*?<\/FormField>/g;
const newStr = `<FormField label="Button Destination">
          <select 
            className={InputClass} 
            value={formData.externalUrl === '/workshops/ros2-industry-immersion' ? 'ROS2' : 'CUSTOM'}
            onChange={e => {
              if (e.target.value === 'ROS2') {
                setFormData({ ...formData, externalUrl: '/workshops/ros2-industry-immersion' });
              } else {
                setFormData({ ...formData, externalUrl: '' });
              }
            }}
          >
            <option value="ROS2">Link to ROS 2 Industry Immersion Landing Page</option>
            <option value="CUSTOM">Custom Link (Google Form, External Website, etc.)</option>
          </select>
        </FormField>

        {formData.externalUrl !== '/workshops/ros2-industry-immersion' && (
          <FormField label="Custom Link URL">
            <input 
              type="url" 
              className={InputClass} 
              value={formData.externalUrl || ''} 
              onChange={e => setFormData({ ...formData, externalUrl: e.target.value })} 
              placeholder="https://docs.google.com/forms/..."
            />
          </FormField>
        )}`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/features/admin/components/forms/WorkshopForm.tsx', code);
