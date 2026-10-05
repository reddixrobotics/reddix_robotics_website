const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/PaymentPage.tsx', 'utf8');

code = code.replace(
  /<h3 className="text-heading-sm mb-4">Payment Method \(Mock\)<\/h3>[\s\S]*?<\/Button>\s*<\/div>/,
  \<h3 className="text-heading-sm mb-4">Online Payments Unavailable</h3>
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-start gap-3 text-yellow-500">
                  <AlertCircle className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Testing Phase</h4>
                    <p className="text-sm">Online payments are right now not available pending eKYC verification. If you would like to proceed with an order, please message us directly from the Contact page.</p>
                  </div>
                </div>
                
                <Link to={ROUTES.CONTACT}>
                  <Button 
                    size="lg" 
                    className="w-full" 
                  >
                    Message Us to Order
                  </Button>
                </Link>
              </div>\
);

fs.writeFileSync('frontend/src/pages/PaymentPage.tsx', code);
