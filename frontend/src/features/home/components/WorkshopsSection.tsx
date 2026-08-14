import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkshopsSection() {
  const navigate = useNavigate();
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 border-[var(--border-strong)]">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 text-[var(--color-brand)]">
                <Calendar size={24} />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="text-heading-sm font-semibold mb-1">Advanced Path Planning</h4>
                <p className="text-body-sm text-[var(--text-secondary)] mb-3">Oct 15, 2026 • Virtual</p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/careers/workshops/ws-001/register')}>Register</Button>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 border-[var(--border-strong)]">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 text-[var(--color-brand)]">
                <Calendar size={24} />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="text-heading-sm font-semibold mb-1">Intro to ROS 2</h4>
                <p className="text-body-sm text-[var(--text-secondary)] mb-3">Nov 02, 2026 • In-Person (London)</p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/careers/workshops/ws-002/register')}>Register</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
