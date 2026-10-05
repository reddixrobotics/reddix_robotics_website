const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

const regex = /<h3 className="text-heading-md mb-3">\{workshop\.title\}<\/h3>[\s\S]*?<\/Card>/g;
const newStr = `<h3 className="text-heading-md mb-3">{workshop.title}</h3>
                        <p className="text-body-sm text-[var(--text-secondary)] mb-6 flex-grow">{workshop.description}</p>
                        
                        <div className="space-y-2 mb-6 text-body-sm text-[var(--text-tertiary)]">
                          {workshop.status === 'COMING_SOON' ? (
                            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                              <Calendar size={16} className="text-[var(--color-brand)]" /> 
                              Coming Soon {workshop.date ? \`- \${new Date(workshop.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'})}\` : ''} ({workshop.duration})
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} /> 
                              {workshop.date ? new Date(workshop.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Date TBD'} ({workshop.duration})
                            </div>
                          )}
                          <div className="flex items-center gap-2"><MapPin size={16} /> {workshop.location}</div>
                        </div>
                        
                        {workshop.status === 'COMING_SOON' ? (
                          <Button 
                            variant="outline" 
                            className="w-full justify-center opacity-50 cursor-not-allowed" 
                            disabled
                          >
                            Coming Soon
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full justify-center" 
                            onClick={() => {
                              if (workshop.externalUrl) {
                                if (workshop.externalUrl.startsWith('/')) {
                                  navigate(workshop.externalUrl);
                                } else if (workshop.externalUrl.includes('reddixrobotics.com/workshops')) {
                                  const path = new URL(workshop.externalUrl).pathname;
                                  navigate(path);
                                } else {
                                  window.open(workshop.externalUrl, '_blank');
                                }
                              } else {
                                navigate(ROUTES.WORKSHOP_ROS2_IMMERSION);
                              }
                            }}
                          >
                            View Workshop <ArrowRight size={16} className="ml-2" />
                          </Button>
                        )}
                      </div>
                    </Card>`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', code);
