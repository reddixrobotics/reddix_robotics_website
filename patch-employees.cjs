const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/about/components/EmployeesSection.tsx', 'utf8');

const oldMap =           return {
            id: e.id,
            name: e.name,
            designation: e.role || '',
            bio: e.bio || '',
            image: photo,
            linkedin: e.linkedinUrl
          };;

const newMap =           return {
            id: e.id,
            name: e.name,
            designation: e.role || '',
            biography: e.bio || '',
            photoUrl: photo || '',
            skills: e.skills ? (typeof e.skills === 'string' ? JSON.parse(e.skills) : e.skills) : [],
            experience: e.experience || '',
            linkedinUrl: e.linkedinUrl || ''
          };;

code = code.replace(oldMap, newMap);
fs.writeFileSync('frontend/src/features/about/components/EmployeesSection.tsx', code);
