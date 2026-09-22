import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useWorkshopMedia } from '@/hooks/useWorkshopMedia';
import { cn } from '@/utils';
import { Cpu, Code2, Box, Settings, Compass, Brain, Wrench, Scan, Map, Navigation, Eye, Terminal } from 'lucide-react';

const JOURNEY_STEPS = ['LEARN', 'BUILD', 'BREAK', 'DEBUG', 'INTEGRATE', 'TEST', 'DEPLOY', 'DEMONSTRATE'];

const PROJECTS = [
  { num: '01', title: 'Robot CAD Design', desc: 'Design and assemble the physical structure of the robot.', icon: Box, cmd: '$ view_cad_model --robot kushi', mediaKey: 'program-step-1' },
  { num: '02', title: 'RViz with TF', desc: 'Visualize robot transformations and sensor data.', icon: Eye, cmd: '$ ros2 run rviz2 rviz2 -d kushi.rviz', mediaKey: 'program-step-2' },
  { num: '03', title: 'Gazebo Sim', desc: 'Simulate the robot environment and physics.', icon: Cpu, cmd: '$ ros2 launch kushi_gazebo simulation.launch.py', mediaKey: 'program-step-3' },
  { num: '04', title: 'Autonomous Docking', desc: 'Implement precision docking using IR and vision.', icon: Navigation, cmd: '$ ros2 action send_goal /docking kushi_msgs/action/Dock "{}"', mediaKey: 'program-step-4' },
  { num: '05', title: 'Web Dashboard', desc: 'Monitor and control the robot from a web interface.', icon: Settings, cmd: '$ npm run start:dashboard', mediaKey: 'program-step-5' },
  { num: '06', title: 'SLAM Toolbox', desc: 'Generate 2D maps of the environment in real-time.', icon: Map, cmd: '$ ros2 launch slam_toolbox online_async_launch.py', mediaKey: 'program-step-6' },
  { num: '07', title: 'Hardware', desc: 'Deploy code to physical hardware and microcontrollers.', icon: Wrench, cmd: '$ ros2 launch kushi_bringup hardware.launch.py', mediaKey: 'program-step-7' },
];

function MediaPlayer({ mediaUrl, posterUrl, altText, placeholder, mediaType = 'video' }: { mediaUrl?: string | null; posterUrl?: string | null; altText?: string; placeholder: string; mediaType?: string }) {
  if (!mediaUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center gap-3">
        <div className="text-[var(--text-muted)] text-sm font-mono">{placeholder}</div>
        <div className="text-[var(--text-tertiary)] text-xs">Media not yet configured — upload from Admin Dashboard</div>
      </div>
    );
  }
  
  if (mediaType === 'image') {
    return (
      <img
        src={mediaUrl}
        alt={altText || 'Workshop media'}
        className="w-full aspect-video rounded-2xl border border-[var(--border-primary)] object-cover bg-black"
      />
    );
  }

  return (
    <video
      src={mediaUrl}
      poster={posterUrl ?? undefined}
      controls
      playsInline
      preload="metadata"
      className="w-full aspect-video rounded-2xl border border-[var(--border-primary)] object-cover bg-black"
      aria-label={altText || 'Workshop video'}
    />
  );
}

export function WorkshopProgram() {
  const [activeProject, setActiveProject] = useState(0);
  const { getMedia } = useWorkshopMedia();
  const programMedia = getMedia('program');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="program"
      style={{ scrollMarginTop: '72px' }}
      className="py-24 md:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden"
    >
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[var(--color-brand)]/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">Program</span>
        </motion.div>

        {/* Hero text */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]">
            THIS IS NOT A<br />
            <span className="text-[var(--color-brand)]">NORMAL COURSE.</span>
          </h2>
          <p className="mt-6 text-xl md:text-2xl font-semibold text-[var(--text-secondary)] max-w-2xl">
            Stop watching tutorials. Start building robots.
          </p>
        </motion.div>

        {/* Journey steps */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="mt-16">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-6">The Engineering Journey</p>
          <div className="flex flex-wrap gap-2">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  className="px-4 py-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-sm font-bold tracking-wide"
                >
                  {step}
                </motion.span>
                {i < JOURNEY_STEPS.length - 1 && <span className="text-[var(--color-brand)] font-bold text-lg">→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="mt-20">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-6">What You'll Learn</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Core Robotics', icon: Cpu, items: ['ROS 2', 'Linux', 'TF2'] },
              { name: 'Languages', icon: Code2, items: ['Python / C++'] },
              { name: 'Simulation & Viz', icon: Box, items: ['Gazebo', 'RViz2'] },
              { name: 'Hardware', icon: Settings, items: ['Sensors'] },
              { name: 'Navigation', icon: Compass, items: ['SLAM', 'Nav2'] },
              { name: 'AI & Vision', icon: Brain, items: ['Computer Vision', 'YOLO'] },
              { name: 'Dev Tools', icon: Wrench, items: ['Git', 'Docker'] },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + (i * 0.05) }}
                  className="p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--color-brand)]/50 hover:shadow-[0_0_20px_rgba(255,51,51,0.05)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--color-brand)] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm tracking-wide text-[var(--text-primary)]">{cat.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span key={item} className="px-2.5 py-1 text-xs font-bold rounded-md bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--color-brand)]/30 transition-colors">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* What You'll Build */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="mt-20">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-8">From Empty Workspace To Autonomous Robot</p>
          
          {/* Interactive Command Center */}
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 mt-12">
            {/* Left Column: Navigation Tabs */}
            <div className="flex flex-col gap-3">
              {PROJECTS.map((proj, idx) => {
                const isActive = activeProject === idx;
                const Icon = proj.icon;
                const stepMedia = getMedia(proj.mediaKey);
                const displayDesc = stepMedia?.altText || proj.desc;
                return (
                  <button
                    key={proj.num}
                    onClick={() => setActiveProject(idx)}
                    className={cn(
                      "flex items-center text-left gap-4 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                      isActive 
                        ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)]/50" 
                        : "bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--color-brand)]/30 hover:bg-[var(--bg-primary)]"
                    )}
                  >
                    {isActive && (
                      <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-brand)]" />
                    )}
                    <div className={cn(
                      "w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg border transition-colors duration-300",
                      isActive ? "bg-[var(--color-brand)] text-white border-transparent shadow-[0_0_15px_rgba(255,51,51,0.3)]" : "bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--color-brand)] group-hover:text-[var(--text-primary)]"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-lg leading-none mb-1 transition-colors", isActive ? "text-[var(--color-brand)]" : "text-[var(--text-primary)]")}>
                        {proj.num}. {proj.title}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-1">{displayDesc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Visualizer Window */}
            <div className="relative rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden shadow-2xl h-[600px] flex flex-col">
              {/* Fake Window Header */}
              <div className="flex items-center px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-[var(--text-tertiary)] flex items-center justify-center gap-2">
                  <Terminal className="w-3 h-3" /> system_architecture_v1.sh
                </div>
              </div>

              {/* Window Body */}
              <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col h-full"
                  >
                    {(() => {
                      const proj = PROJECTS[activeProject];
                      const Icon = proj.icon;
                      return (
                        <>
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                            {(() => {
                              const stepMedia = getMedia(proj.mediaKey);
                              const displayDesc = stepMedia?.altText || proj.desc;
                              if (stepMedia?.mediaUrl) {
                                return (
                                  <>
                                    <div className="w-full max-w-md mx-auto mb-4">
                                      <MediaPlayer 
                                        mediaUrl={stepMedia.mediaUrl} 
                                        posterUrl={stepMedia.posterUrl} 
                                        altText={stepMedia.altText} 
                                        mediaType={stepMedia.mediaType}
                                        placeholder="[ MEDIA ]" 
                                      />
                                    </div>
                                    <h3 className="mt-1 text-3xl font-black text-[var(--text-primary)] tracking-tight">{proj.title}</h3>
                                    <p className="mt-2 text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">{displayDesc}</p>
                                  </>
                                );
                              }
                              return (
                                <>
                                  <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-[var(--color-brand)]/20 blur-[50px] rounded-full" />
                                    <Icon className="w-24 h-24 text-[var(--color-brand)] relative z-10 mx-auto" />
                                  </div>
                                  <h3 className="mt-1 text-3xl font-black text-[var(--text-primary)] tracking-tight">{proj.title}</h3>
                                  <p className="mt-2 text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">{displayDesc}</p>
                                </>
                              );
                            })()}
                          </div>
                          
                          {/* Simulated Terminal Output */}
                          <div className="mt-4 p-4 rounded-xl bg-black border border-white/10 font-mono text-sm text-green-400 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
                            <div className="flex items-center gap-3">
                              <span className="text-green-500/50">root@kushi:~$</span>
                              <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "linear" }}
                                className="block overflow-hidden whitespace-nowrap border-r-2 border-green-400"
                              >
                                {proj.cmd}
                              </motion.span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Program Video */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} className="mt-20">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-6">Program Highlights</p>
          <MediaPlayer mediaUrl={programMedia?.mediaUrl} posterUrl={programMedia?.posterUrl} altText={programMedia?.altText} mediaType={programMedia?.mediaType} placeholder="[ PROGRAM VIDEO ]" />
        </motion.div>
      </div>
    </section>
  );
}
