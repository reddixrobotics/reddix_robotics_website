import { motion } from 'framer-motion';
import { Section } from '@/components/ui';
import { Cpu, Wifi, Brain, FlaskConical, Layers, Code2, BarChart3, Globe, Server, Bolt } from 'lucide-react';

// ── Inline SVG brand icons ──────────────────────────────────────────────────

const RosIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2"/>
    <circle cx="16" cy="16" r="4" fill="#22C55E"/>
    <line x1="16" y1="2" x2="16" y2="8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="24" x2="16" y2="30" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="2" y1="16" x2="8" y2="16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="16" x2="30" y2="16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M16 2C10 2 8 5 8 9v3h8v1H6C3 13 2 15.5 2 19s1.5 7 4 7h2v-4c0-3 2-4 4-4h8c3 0 4-2 4-4V9c0-3-2-7-8-7z" fill="#3B82F6"/>
    <path d="M16 30c6 0 8-3 8-7v-3h-8v-1h10c3 0 4-2.5 4-6s-1.5-7-4-7h-2v4c0 3-2 4-4 4H12c-3 0-4 2-4 4v5c0 3 2 7 8 7z" fill="#60A5FA"/>
    <circle cx="11.5" cy="7.5" r="1.5" fill="white"/>
    <circle cx="20.5" cy="24.5" r="1.5" fill="white"/>
  </svg>
);

const TensorflowIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M16 2L4 9v6l8-4.5V19l-4-2.3v4.6L16 26l12-6.7V8L16 2z" fill="#F97316"/>
    <path d="M16 2v24l12-6.7V8L16 2z" fill="#EA580C"/>
    <path d="M16 2L4 9v6l8-4.5V17" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
  </svg>
);

const OpenCVIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="10" cy="10" r="6" fill="#7C1014"/>
    <circle cx="22" cy="10" r="6" fill="#16803C"/>
    <circle cx="16" cy="22" r="6" fill="#1D6FA4"/>
    <circle cx="10" cy="10" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="22" cy="10" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="16" cy="22" r="3" fill="white" fillOpacity="0.4"/>
  </svg>
);

const ArduinoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect x="2" y="8" width="28" height="16" rx="8" fill="#06B6D4"/>
    <text x="8.5" y="21" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="white">∞</text>
  </svg>
);

const RpiIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="16" r="13" fill="#C2185B"/>
    <path d="M11 12 Q16 8 21 12 Q24 16 21 20 Q16 24 11 20 Q8 16 11 12Z" fill="#E91E63" stroke="white" strokeWidth="0.5"/>
    <circle cx="16" cy="16" r="4" fill="white"/>
    <circle cx="16" cy="16" r="2" fill="#C2185B"/>
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect x="2" y="14" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="7" y="14" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="12" y="14" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="17" y="14" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="7" y="9" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="12" y="9" width="4" height="4" rx="1" fill="#60A5FA"/>
    <rect x="12" y="4" width="4" height="4" rx="1" fill="#60A5FA"/>
    <path d="M27 15.5c-1-1.5-3-1.5-4-1.5H2s0 8 10 8h10c3 0 5-2 5-4.5 0 0 1 0 1.5-1L28 16l-1-.5z" fill="#2563EB"/>
    <circle cx="25" cy="12" r="2" fill="#60A5FA"/>
  </svg>
);

const UbuntuIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="16" r="13" fill="#E8622A"/>
    <circle cx="16" cy="7" r="3" fill="white"/>
    <circle cx="24.5" cy="21.5" r="3" fill="white"/>
    <circle cx="7.5" cy="21.5" r="3" fill="white"/>
    <path d="M16 10 L23 19 L9 19 Z" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

const GazeboIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <polygon points="16,3 28,10 28,22 16,29 4,22 4,10" fill="none" stroke="#EAB308" strokeWidth="2"/>
    <polygon points="16,9 23,13 23,21 16,25 9,21 9,13" fill="#EAB308" fillOpacity="0.3" stroke="#EAB308" strokeWidth="1.5"/>
    <circle cx="16" cy="17" r="3" fill="#EAB308"/>
  </svg>
);

const YoloIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect x="4" y="4" width="24" height="24" rx="3" stroke="#F43F5E" strokeWidth="2"/>
    <rect x="9" y="9" width="10" height="10" rx="2" fill="none" stroke="#F43F5E" strokeWidth="1.5"/>
    <circle cx="14" cy="14" r="2" fill="#F43F5E"/>
    <line x1="19" y1="9" x2="25" y2="9" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="21" y1="12" x2="25" y2="12" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── Technology data ────────────────────────────────────────────────────────

const technologies = [
  { SvgIcon: RosIcon,        LucideIcon: null,       name: 'ROS / ROS2',       category: 'Robotics',         color: '#22C55E' },
  { SvgIcon: PythonIcon,     LucideIcon: null,       name: 'Python',           category: 'Programming',      color: '#3B82F6' },
  { SvgIcon: TensorflowIcon, LucideIcon: null,       name: 'TensorFlow',       category: 'AI / ML',          color: '#F97316' },
  { SvgIcon: OpenCVIcon,     LucideIcon: null,       name: 'OpenCV',           category: 'Computer Vision',  color: '#7C1014' },
  { SvgIcon: ArduinoIcon,    LucideIcon: null,       name: 'Arduino',          category: 'Embedded',         color: '#06B6D4' },
  { SvgIcon: RpiIcon,        LucideIcon: null,       name: 'Raspberry Pi',     category: 'Edge Computing',   color: '#EC4899' },
  { SvgIcon: DockerIcon,     LucideIcon: null,       name: 'Docker',           category: 'DevOps',           color: '#60A5FA' },
  { SvgIcon: UbuntuIcon,     LucideIcon: null,       name: 'Ubuntu',           category: 'OS',               color: '#E8622A' },
  { SvgIcon: null,           LucideIcon: Brain,      name: 'Deep Learning',    category: 'AI / ML',          color: '#A855F7' },
  { SvgIcon: null,           LucideIcon: Cpu,        name: 'SLAM',             category: 'Navigation',       color: '#7C1014' },
  { SvgIcon: null,           LucideIcon: Wifi,       name: 'Industrial IoT',   category: 'Connectivity',     color: '#14B8A6' },
  { SvgIcon: GazeboIcon,     LucideIcon: null,       name: 'Gazebo Sim',       category: 'Simulation',       color: '#EAB308' },
  { SvgIcon: null,           LucideIcon: Layers,     name: 'PCB Design',       category: 'Hardware',         color: '#10B981' },
  { SvgIcon: null,           LucideIcon: Code2,      name: 'C / C++',          category: 'Programming',      color: '#6366F1' },
  { SvgIcon: YoloIcon,       LucideIcon: null,       name: 'YOLOv8',           category: 'Object Detection', color: '#F43F5E' },
  { SvgIcon: null,           LucideIcon: Globe,      name: 'MQTT / ROS Bridge',category: 'Communication',    color: '#0EA5E9' },
  { SvgIcon: null,           LucideIcon: Server,     name: 'Embedded Linux',   category: 'OS',               color: '#8B5CF6' },
  { SvgIcon: null,           LucideIcon: Bolt,       name: 'RTOS',             category: 'Real-Time OS',     color: '#F59E0B' },
  { SvgIcon: null,           LucideIcon: BarChart3,  name: 'Data Analytics',   category: 'Insights',         color: '#34D399' },
  { SvgIcon: null,           LucideIcon: FlaskConical, name: 'Research & Dev', category: 'Innovation',       color: '#FB7185' },
];

// Split into two rows for dual marquee
const row1 = technologies.slice(0, 10);
const row2 = technologies.slice(10);

function TechCard({ tech }: { tech: typeof technologies[0] }) {
  const SvgIcon = tech.SvgIcon;
  const LucideIcon = tech.LucideIcon;
  return (
    <div
      className="group relative flex-shrink-0 w-[160px] h-[130px] bg-[var(--surface-card)] border border-[var(--border-primary)] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default mx-2"
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1.5px ${tech.color}66` }}
      />
      {/* Top shimmer bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)` }}
      />
      {/* Bg glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${tech.color}14 0%, transparent 70%)` }}
      />
      {/* Icon */}
      <div className="relative z-10 w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] group-hover:bg-transparent flex items-center justify-center transition-colors duration-300">
        {SvgIcon ? (
          <div className="transition-transform duration-300 group-hover:scale-110"><SvgIcon /></div>
        ) : LucideIcon ? (
          <LucideIcon size={24} className="transition-transform duration-300 group-hover:scale-110" style={{ color: tech.color }} />
        ) : null}
      </div>
      {/* Text */}
      <div className="relative z-10 text-center">
        <p className="text-[12px] font-bold text-[var(--text-primary)] leading-tight">{tech.name}</p>
        <p className="text-[10px] font-semibold mt-0.5 tracking-wide" style={{ color: tech.color + 'BB' }}>{tech.category}</p>
      </div>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-[80px]" />

      {/* Header */}
      <div className="text-center mb-14 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5 mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
          <span className="text-xs font-bold tracking-[0.18em] text-[var(--color-brand)] uppercase">
            Technologies We Use
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-display-sm font-bold text-[var(--text-primary)] mb-4"
        >
          Powered by Industry&#8209;Leading Tools
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-body-md text-[var(--text-secondary)]"
        >
          At Reddix Robotics, we leverage cutting-edge frameworks, platforms, and tools
          to build intelligent, scalable, and reliable robotic systems.
        </motion.p>
      </div>

      {/* Marquee rows */}
      <div className="relative w-full overflow-hidden">

        {/* Edge fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent" />

        {/* Row 1 — scrolls left */}
        <div className="flex mb-4 [--duration:35s] group">
          <div className="flex animate-marquee-left group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((tech, i) => <TechCard key={`r1a-${i}`} tech={tech} />)}
          </div>
          <div className="flex animate-marquee-left group-hover:[animation-play-state:paused]" aria-hidden>
            {[...row1, ...row1].map((tech, i) => <TechCard key={`r1b-${i}`} tech={tech} />)}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="flex [--duration:40s] group">
          <div className="flex animate-marquee-right group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((tech, i) => <TechCard key={`r2a-${i}`} tech={tech} />)}
          </div>
          <div className="flex animate-marquee-right group-hover:[animation-play-state:paused]" aria-hidden>
            {[...row2, ...row2].map((tech, i) => <TechCard key={`r2b-${i}`} tech={tech} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}
