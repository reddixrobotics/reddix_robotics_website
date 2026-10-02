import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function WorkshopsSection() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data, error } = await supabase
          .from('Workshop')
          .select('*')
          .neq('status', 'DRAFT')
          .order('date', { ascending: true })
          .limit(3);
          
        if (error) throw error;
        setWorkshops(data || []);
      } catch (err) {
        console.error('Failed to load workshops:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  return (
    <section className="bg-[var(--bg-primary)] py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-brand)]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="container-content relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-heading-xl mb-4 text-[var(--text-primary)]">Upcoming Workshops</h2>
          <p className="text-body-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Learn directly from our engineering team in these intensive, hands-on sessions designed to accelerate your robotics journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {isLoading ? (
             <div className="col-span-full text-center text-[var(--text-secondary)] py-10">Loading workshops...</div>
          ) : workshops.length === 0 ? (
             <div className="col-span-full text-center text-[var(--text-secondary)] py-10">No upcoming workshops scheduled at the moment.</div>
          ) : (
            workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex"
              >
                <Card className="flex flex-col h-full w-full border-[var(--border-strong)] hover:border-[var(--color-brand)] hover:shadow-xl transition-all duration-300 group bg-[var(--bg-secondary)] p-3 rounded-xl">
                  
                  <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-tertiary)] rounded-lg">
                    {workshop.posterUrl ? (
                      <img 
                          src={workshop.posterUrl} 
                          alt={workshop.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-brand)] opacity-50">
                        <Calendar size={48} strokeWidth={1.5} />
                      </div>
                    )}
                    {workshop.status === 'COMING_SOON' ? (
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
                      )}
                  </div>
                  
                  <div className="flex flex-col flex-grow pt-4 px-1 pb-2">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors">
                      {workshop.title}
                    </h4>
                    
                    <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-3 flex-grow">
                      {workshop.description || 'Join us for this exciting workshop to learn more about the latest developments in robotics and automation.'}
                    </p>
                    
                    <div className="flex flex-col gap-2.5 mt-auto pt-5 border-t border-[var(--border-primary)] mb-6">
                      <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
                        <Clock size={15} className="mr-2.5 text-[var(--color-brand)] shrink-0" />
                        <span className="truncate">{workshop.duration || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
                        <MapPin size={15} className="mr-2.5 text-[var(--color-brand)] shrink-0" />
                        <span className="truncate">{workshop.location || 'Online'}</span>
                      </div>
                    </div>
                    
                    {workshop.status === 'COMING_SOON' ? (
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
                      )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
