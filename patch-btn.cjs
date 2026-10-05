const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

const regex = /<Button\s+variant="outline"\s+className="w-full justify-center"\s+onClick=\{\(\) => \{\s+if \(workshop\.externalUrl\) \{\s+window\.open\(workshop\.externalUrl, '_blank'\);\s+\} else \{\s+navigate\(ROUTES\.WORKSHOP_ROS2_IMMERSION\);\s+\}\s+\}\}\s+>\s+View Workshop <ArrowRight size=\{16\} className="ml-2" \/>\s+<\/Button>/g;

const newStr = `{workshop.status === 'COMING_SOON' ? (
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
                        )}`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', code);
