const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');

// Change query
code = code.replace(/\.eq\('status', 'PUBLISHED'\)/g, `.neq('status', 'DRAFT')`);

// Replace date badge block
const dateRegex = /<div className="absolute top-4 left-4[\s\S]*?<\/div>\s*<\/div>/g;
const newDateBlock = `{workshop.status === 'COMING_SOON' ? (
                        <div className="absolute top-4 left-4 bg-[var(--color-brand)]/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center shadow-lg border border-[var(--color-brand)]/20">
                          <div className="text-[10px] font-bold uppercase text-[var(--color-brand)] tracking-wider">
                            COMING
                          </div>
                          <div className="text-xl font-black text-[var(--color-brand)] leading-none mt-0.5">
                            SOON
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4 bg-white dark:bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center shadow-lg border border-[var(--border-primary)]">
                          <div className="text-[10px] font-bold uppercase text-[var(--color-brand)] tracking-wider">
                            {workshop.date ? new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' }) : 'TBA'}
                          </div>
                          <div className="text-xl font-black text-[var(--text-primary)] leading-none mt-0.5">
                            {workshop.date ? new Date(workshop.date).toLocaleDateString('en-US', { day: '2-digit' }) : '-'}
                          </div>
                        </div>
                      )}`;
code = code.replace(dateRegex, newDateBlock);

// Replace button logic
const buttonRegex = /<Button[\s\S]*?<\/Button>/g;
const newButtonBlock = `{workshop.status === 'COMING_SOON' ? (
                        <Button 
                          className="w-full transition-all opacity-50 cursor-not-allowed"
                          variant="outline"
                          disabled
                        >
                          Coming Soon
                        </Button>
                      ) : (
                        <Button 
                          className="w-full transition-all group-hover:bg-[var(--color-brand)] group-hover:text-white group-hover:border-[var(--color-brand)]"
                          variant="outline"
                          onClick={() => {
                            if (workshop.externalUrl && workshop.externalUrl.startsWith('http')) {
                              window.open(workshop.externalUrl, '_blank');
                            } else {
                              navigate('/careers?tab=workshops');
                            }
                          }}
                        >
                          {workshop.externalUrl ? 'Register Now' : 'View Details'}
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}`;
code = code.replace(buttonRegex, newButtonBlock);

fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', code);
