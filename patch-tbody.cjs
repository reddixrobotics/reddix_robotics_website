const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/ProductDetailsPage.tsx', 'utf8');

const regex = /<tbody>[\s\S]*?<\/tbody>/g;
const newStr = '<tbody>\n' +
'                          {Object.entries(product.specifications).map(([key, value], idx) => (\n' +
'                            <tr key={key} className={`border-b border-[var(--border-strong)] last:border-b-0 ${idx % 2 === 0 ? "bg-[var(--bg-primary)]/50" : ""}`}>\n' +
'                              <th className="py-4 px-6 text-sm font-medium text-[var(--text-primary)] w-1/3">{key}</th>\n' +
'                              <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">{String(value)}</td>\n' +
'                            </tr>\n' +
'                          ))}\n' +
'                        </tbody>';

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/pages/ProductDetailsPage.tsx', code);
