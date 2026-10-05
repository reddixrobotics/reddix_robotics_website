const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/ProductDetailsPage.tsx', 'utf8');

const regex = /<tr key=\{key\} className=\{ order-b border-\[var\(--border-strong\)\] last:border-b-0 \}>/g;
const newStr = '<tr key={key} className={order-b border-[var(--border-strong)] last:border-b-0 }>';

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/pages/ProductDetailsPage.tsx', code);
