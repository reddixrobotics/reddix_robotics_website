import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function WorkshopsSection() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await apiClient.get('/api/workshops');
        // Get the first two for the home page or all if needed
        setWorkshops(response.data.slice(0, 2));
      } catch (err) {
        console.error('Failed to load workshops:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  return (
    <section className="bg-[var(--bg-primary)] py-24">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-heading-xl mb-4">Upcoming Workshops</h2>
          <p className="text-body-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Learn directly from our engineering team in these intensive, hands-on sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {isLoading ? (
             <div className="col-span-2 text-center text-[var(--text-secondary)] py-10">Loading workshops...</div>
          ) : workshops.length === 0 ? (
             <div className="col-span-2 text-center text-[var(--text-secondary)] py-10">No upcoming workshops scheduled at the moment.</div>
          ) : (
            workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 border-[var(--border-strong)]">
                  {workshop.posterUrl ? (
                    <img 
                      src={workshop.posterUrl} 
                      alt={workshop.title} 
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-[var(--border-primary)] shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 text-[var(--color-brand)]">
                      <Calendar size={24} />
                    </div>
                  )}
                  <div className="flex-grow text-center sm:text-left">
                    <h4 className="text-heading-sm font-semibold mb-1">{workshop.title}</h4>
                    <p className="text-body-sm text-[var(--text-secondary)] mb-3">
                      {new Date(workshop.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} • {workshop.location}
                    </p>
                    <Button size="sm" variant="secondary" onClick={() => navigate('/workshops/ros2-industry-immersion')}>View Workshop</Button>
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
