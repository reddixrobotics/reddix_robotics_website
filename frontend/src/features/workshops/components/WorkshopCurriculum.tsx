import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useWorkshopMedia } from '@/hooks/useWorkshopMedia';
import { cn } from '@/utils';

const WEEKS = [
  {
    id: 'week-1',
    label: 'Week 01',
    title: 'FOUNDATIONS',
    mediaKey: 'curriculum-week-1',
    days: [
      { day: '01', title: 'Robotics Industry Orientation' },
      { day: '02', title: 'Linux for Robotics' },
      { day: '03', title: 'ROS 2 Architecture' },
      { day: '04', title: 'Python/C++ ROS 2 Nodes' },
      { day: '05', title: 'ROS 2 Engineering Workflow' },
      { day: '06', title: 'Debugging Day' },
      { day: '07', title: 'Engineering Review' },
    ],
  },
  {
    id: 'week-2',
    label: 'Week 02',
    title: 'BUILD THE ROBOT',
    mediaKey: 'curriculum-week-2',
    days: [
      { day: '08', title: 'Robot Architecture' },
      { day: '09', title: 'URDF / Xacro' },
      { day: '10', title: 'TF2' },
      { day: '11', title: 'Gazebo Simulation' },
      { day: '12', title: 'Robot Control' },
      { day: '13', title: 'Sensor Integration' },
      { day: '14', title: 'Hardware Bring-Up' },
    ],
  },
  {
    id: 'week-3',
    label: 'Week 03',
    title: 'AUTONOMY',
    mediaKey: 'curriculum-week-3',
    days: [
      { day: '15', title: 'Odometry and Localization' },
      { day: '16', title: 'SLAM' },
      { day: '17', title: 'SLAM Debugging' },
      { day: '18', title: 'Localization' },
      { day: '19', title: 'Nav2 Architecture' },
      { day: '20', title: 'Costmaps' },
      { day: '21', title: 'Autonomous Navigation' },
    ],
  },
  {
    id: 'week-4',
    label: 'Week 04',
    title: 'AI + INDUSTRIAL ENGINEERING',
    mediaKey: 'curriculum-week-4',
    days: [
      { day: '22', title: 'Navigation Engineering' },
      { day: '23', title: 'Computer Vision' },
      { day: '24', title: 'YOLO + ROS 2' },
      { day: '25', title: 'Robot Intelligence' },
      { day: '26', title: 'Industrial Mission' },
      { day: '27', title: 'Deployment Engineering' },
      { day: '28', title: 'Reliability and Testing' },
      { day: '29', title: 'Final Engineering Challenge' },
      { day: '30', title: 'REDDIX DEMO DAY' },
    ],
  },
];

export function WorkshopCurriculum() {
  const [activeWeek, setActiveWeek] = useState(WEEKS[0]);
  const { getMedia } = useWorkshopMedia();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const activeMedia = getMedia(activeWeek.mediaKey);

  return (
    <section
      ref={ref}
      id="curriculum"
      style={{ scrollMarginTop: '72px' }}
      className="py-24 md:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">Curriculum</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">THE 30-DAY SPRINT.</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Week Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 shrink-0 hide-scrollbar"
          >
            {WEEKS.map((week) => (
              <button
                key={week.id}
                onClick={() => setActiveWeek(week)}
                className={cn(
                  'flex flex-col items-start px-6 py-4 rounded-xl text-left transition-all duration-200 min-w-[160px]',
                  activeWeek.id === week.id
                    ? 'bg-[var(--color-brand)] text-white shadow-lg'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--color-brand)]'
                )}
              >
                <span className={cn('text-xs font-bold tracking-widest uppercase', activeWeek.id === week.id ? 'text-white/80' : 'text-[var(--text-muted)]')}>
                  {week.label}
                </span>
                <span className={cn('mt-1 font-bold text-sm lg:text-base', activeWeek.id === week.id ? 'text-white' : 'text-[var(--text-primary)]')}>
                  {week.title}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeek.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-10"
              >
                {/* Days List */}
                <div>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <span className="text-[var(--color-brand)]">{activeWeek.label}</span>
                    <span className="text-[var(--text-muted)] font-normal text-lg">/</span>
                    {activeWeek.title}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {activeWeek.days.map((day) => (
                      <div key={day.day} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-primary)] transition-colors">
                        <span className="text-[var(--text-muted)] font-mono text-sm font-bold w-16">DAY {day.day}</span>
                        <span className="text-[var(--text-primary)] font-semibold">{day.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Player */}
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] relative">
                    {activeMedia?.mediaUrl ? (
                      <video
                        src={activeMedia.mediaUrl}
                        poster={activeMedia.posterUrl ?? undefined}
                        controls
                        playsInline
                        className="w-full h-full object-cover bg-black"
                        aria-label={`Preview of ${activeWeek.label}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center">
                        <span className="text-[var(--text-muted)] font-mono text-sm">[ {activeWeek.label.toUpperCase()} MEDIA PREVIEW ]</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
