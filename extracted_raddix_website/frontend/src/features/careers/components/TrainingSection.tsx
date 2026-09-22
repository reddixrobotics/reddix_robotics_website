import { motion } from 'framer-motion';
import { Section, SectionHeading, Card } from '@/components/ui';
import { BookOpen, Trophy, Users } from 'lucide-react';

export default function TrainingSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
      <SectionHeading 
        eyebrow="Development" 
        title="Training & Growth" 
        description="We invest heavily in the continual development of our team members."
      />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full border-none shadow-none bg-transparent flex flex-col items-center text-center p-0">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
              <BookOpen size={32} className="text-[var(--color-brand)]" />
            </div>
            <h4 className="text-heading-sm mb-3">Reddix Academy</h4>
            <p className="text-body-sm text-[var(--text-secondary)]">
              Access to hundreds of proprietary courses covering advanced robotics, computer vision, and leadership skills.
            </p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-none shadow-none bg-transparent flex flex-col items-center text-center p-0">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
              <Trophy size={32} className="text-[var(--color-brand)]" />
            </div>
            <h4 className="text-heading-sm mb-3">Conference Sponsorships</h4>
            <p className="text-body-sm text-[var(--text-secondary)]">
              We sponsor our engineers to attend and present at major global conferences like ICRA and NeurIPS.
            </p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-none shadow-none bg-transparent flex flex-col items-center text-center p-0">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
              <Users size={32} className="text-[var(--color-brand)]" />
            </div>
            <h4 className="text-heading-sm mb-3">Mentorship Program</h4>
            <p className="text-body-sm text-[var(--text-secondary)]">
              Pair with senior industry leaders who guide you through complex technical challenges and career progression.
            </p>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
