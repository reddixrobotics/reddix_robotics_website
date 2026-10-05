const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminWorkshops.tsx', 'utf8');

const regex = /\{ header: 'Title', accessor: 'title' as const \},/g;
const newStr = `{ header: 'Title', accessor: 'title' as const },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      cell: (item: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${item.status === 'COMING_SOON' ? 'bg-yellow-500/10 text-yellow-500' : item.status === 'DRAFT' ? 'bg-gray-500/10 text-gray-500' : 'bg-green-500/10 text-green-500'}\`}>
          {item.status?.replace('_', ' ') || 'PUBLISHED'}
        </span>
      )
    },`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/pages/admin/AdminWorkshops.tsx', code);
