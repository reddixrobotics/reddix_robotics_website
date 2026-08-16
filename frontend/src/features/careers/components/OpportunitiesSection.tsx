import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeading, Card, Button, Badge } from '@/components/ui';
import { MapPin, Briefcase, Clock, Calendar, ArrowRight } from 'lucide-react';
import { workshops } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';

type Tab = 'jobs' | 'internships' | 'workshops';

export default function OpportunitiesSection() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsRes, internshipsRes] = await Promise.all([
          apiClient.get('/api/careers/jobs'),
          apiClient.get('/api/careers/internships')
        ]);
        setJobs(jobsRes.data);
        setInternships(internshipsRes.data);
      } catch (err) {
        console.error('Failed to load career opportunities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Section id="open-positions" className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="Opportunities" 
        title="Discover Your Next Role" 
      />
      
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12 border-b border-[var(--border-strong)] pb-4 max-w-3xl mx-auto">
        {(['jobs', 'internships', 'workshops'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-heading-sm capitalize px-4 py-2 transition-colors relative ${
              activeTab === tab ? 'text-[var(--color-brand)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[var(--color-brand)]" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto min-h-[600px]">
        {isLoading ? (
          <div className="py-20 text-center text-[var(--text-secondary)]">Loading opportunities...</div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {jobs.length === 0 ? (
                  <div className="py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                    No open positions available at the moment. Please check back later.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <Card key={job.id} className="border-[var(--border-strong)] hover:border-[var(--color-brand)] transition-colors p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-eyebrow text-[var(--color-brand)]">{job.department}</span>
                            <Badge variant="neutral" size="sm">{job.type}</Badge>
                          </div>
                          <h3 className="text-heading-lg mb-4">{job.title}</h3>
                          <p className="text-body-md text-[var(--text-secondary)] mb-6">{job.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-6 mb-6 text-body-sm text-[var(--text-tertiary)]">
                            <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
                            <div className="flex items-center gap-2"><Briefcase size={16} /> {job.experience} Experience</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {(job.skills || []).map((skill: string) => (
                              <Badge key={skill} variant="neutral" size="sm" className="bg-[var(--bg-secondary)]">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="md:w-32 flex-shrink-0 flex md:flex-col justify-end md:justify-start pt-2">
                          <Button className="w-full" onClick={() => navigate(`/careers/jobs/${job.id}/apply`)}>Apply Now</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'internships' && (
              <motion.div
                key="internships"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {internships.length === 0 ? (
                  <div className="py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                    No internship opportunities available at the moment. Please check back later.
                  </div>
                ) : (
                  internships.map((internship) => (
                    <Card key={internship.id} className="border-[var(--border-strong)] hover:border-[var(--color-brand)] transition-colors p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                      {internship.imageUrl && (
                        <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border-strong)]">
                          <img src={internship.imageUrl} alt={internship.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-grow w-full flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-eyebrow text-[var(--color-brand)] block">{internship.department}</span>
                            {internship.type && <Badge variant="neutral" size="sm">{internship.type}</Badge>}
                          </div>
                          
                          <h3 className="text-heading-lg mb-1">{internship.title}</h3>
                          {internship.company && <p className="text-body-lg text-[var(--text-primary)] mb-4 font-semibold">{internship.company}</p>}
                          
                          <p className="text-body-md text-[var(--text-secondary)] mb-6">{internship.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-6 mb-6 text-body-sm text-[var(--text-tertiary)]">
                            {internship.location && <div className="flex items-center gap-2"><MapPin size={16} /> {internship.location}</div>}
                            <div className="flex items-center gap-2"><Clock size={16} /> {internship.duration}</div>
                            {internship.stipend && <div className="flex items-center gap-2"><Briefcase size={16} /> Stipend: {internship.stipend}</div>}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {(internship.skills || []).map((skill: string) => (
                              <Badge key={skill} variant="neutral" size="sm" className="bg-[var(--bg-secondary)]">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="md:w-32 flex-shrink-0 flex md:flex-col justify-end md:justify-start pt-2">
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              if (internship.applicationLink) {
                                window.open(internship.applicationLink, '_blank', 'noopener,noreferrer');
                              } else {
                                navigate(`/careers/internships/${internship.id}/apply`);
                              }
                            }}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'workshops' && (
              <motion.div
                key="workshops"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {workshops.map((workshop) => (
                  <Card key={workshop.id} className="p-0 overflow-hidden border-[var(--border-strong)] flex flex-col">
                    <div className="h-48 w-full">
                      <img src={workshop.imageUrl} alt={workshop.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-heading-md mb-3">{workshop.title}</h3>
                      <p className="text-body-sm text-[var(--text-secondary)] mb-6 flex-grow">{workshop.description}</p>
                      
                      <div className="space-y-2 mb-6 text-body-sm text-[var(--text-tertiary)]">
                        <div className="flex items-center gap-2"><Calendar size={16} /> {workshop.date} ({workshop.duration})</div>
                        <div className="flex items-center gap-2"><MapPin size={16} /> {workshop.location}</div>
                      </div>
                      
                      <Button variant="outline" className="w-full justify-center" onClick={() => navigate(`/careers/workshops/${workshop.id}/register`)}>
                        Register <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Section>
  );
}
