import { motion } from 'framer-motion';
import { Section, SectionHeading, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';

export function WorkshopsSection() {
  const navigate = useNavigate();

  return (
    <Section className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <SectionHeading
        eyebrow="WORKSHOPS"
        title="REDDIX ROS 2 INDUSTRY IMMERSION"
        description="30 DAYS. ONE ROBOT. FULL ROS 2 ENGINEERING STACK."
      />

      <div className="mt-16 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Stop watching tutorials. Start building robots. Join our intensive 30-day engineering workshop designed to take you from a Linux terminal to deploying an autonomous robot using the real Reddix Robotics engineering stack.
          </p>

          <div className="flex flex-wrap gap-2 pt-4">
            {['ROS 2', 'Linux', 'Python / C++', 'Gazebo', 'RViz2', 'TF2', 'SLAM', 'Nav2', 'Computer Vision', 'YOLO', 'Git', 'Docker'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-full text-xs text-[var(--text-secondary)] font-mono">
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-8">
            <Button 
              size="lg" 
              variant="primary" 
              onClick={() => navigate(ROUTES.WORKSHOP_ROS2_IMMERSION)}
              className="bg-red-600 hover:bg-red-700 text-white border-none text-lg px-8 py-6 rounded-none shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all"
            >
              EXPLORE PROGRAM &rarr;
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border-strong)] shadow-lg group">
            {/* Fallback image if video fails or is loading */}
            <img 
              src="/robot2.jpeg" 
              alt="Kushi Robot" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay to make text pop if we put any */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h4 className="text-xl font-bold tracking-tight mb-2 text-white">Real Robot Experience</h4>
              <p className="text-sm text-gray-200">Master the Reddix Robotics engineering stack.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
