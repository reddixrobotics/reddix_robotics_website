import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hero3D from './Hero3D';
import { supabase } from '@/lib/supabase';
import { ROUTES, buildPath } from '@/routes/routePaths';

type TickerItem = { label: string; href?: string };

const defaultUpdates: TickerItem[] = [
  { label: "New Intelligent Robotics Solutions Coming Soon", href: ROUTES.PRODUCTS },
  { label: "Explore Our Latest Autonomous Robotics Technology", href: ROUTES.PROJECTS },
  { label: "Reddix Robotics — Engineering the Future", href: ROUTES.ABOUT },
  { label: "New Robotics & Automation Solutions", href: ROUTES.PRODUCTS }
];

function NewsTicker() {
  const [updates, setUpdates] = useState<TickerItem[]>(defaultUpdates);

  useEffect(() => {
    async function fetchLatestWorkshops() {
      try {
        const { data, error } = await supabase
          .from('Workshop')
          .select('id, title')
          .eq('status', 'PUBLISHED')
          .order('createdAt', { ascending: false })
          .limit(3);
          
        if (!error && data && data.length > 0) {
          const workshopUpdates = data.map((w: any) => ({
            label: "New Workshop: " + w.title + " — Register Now!",
            href: buildPath(ROUTES.CAREERS_WORKSHOP_REGISTER, { id: w.id })
          }));
          setUpdates([...workshopUpdates, ...defaultUpdates]);
        }
      } catch (err) {
        console.error('Failed to fetch workshops for ticker:', err);
      }
    }
    fetchLatestWorkshops();
  }, []);

  return (
    <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] h-[40px] md:h-[48px] flex items-center overflow-hidden relative z-50 shadow-sm pointer-events-auto">
      {/* Fixed Label */}
      <div className="absolute left-0 top-0 bottom-0 z-50 flex items-center px-4 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] shadow-[4px_0_12px_rgba(0,0,0,0.05)] pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-[var(--color-brand)] mr-3 animate-pulse" />
        <span className="text-xs md:text-sm font-semibold tracking-wider text-nowrap whitespace-nowrap">LATEST UPDATES</span>
      </div>
      
      {/* Scrolling Content */}
      <div className="flex-1 overflow-hidden ml-[130px] md:ml-[160px] group relative h-full flex items-center motion-reduce:overflow-x-auto pointer-events-auto">
        <div className="animate-marquee motion-reduce:animate-none flex whitespace-nowrap group-hover:[animation-play-state:paused] pointer-events-auto" style={{ width: 'max-content' }}>
          {updates.concat(updates).map((item, i) => (
            item.href ? (
              <a 
                href={item.href}
                key={i} 
                onClick={(e) => {
                   e.preventDefault();
                   window.location.href = item.href!;
                }}
                className="mx-6 md:mx-8 text-sm md:text-base flex items-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer relative z-50 pointer-events-auto"
              >
                {item.label} <ArrowRight size={14} className="ml-2 text-[var(--color-brand)] pointer-events-none" />
              </a>
            ) : (
              <span key={i} className="mx-6 md:mx-8 text-sm md:text-base flex items-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                {item.label} <ArrowRight size={14} className="ml-2 text-[var(--color-brand)]" />
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      <NewsTicker />
      
      <div className="container-content relative z-10 w-full flex flex-col md:flex-row lg:flex-row items-center pt-[clamp(35px,4vw,55px)] pb-12 gap-8 lg:gap-4 xl:gap-8 min-h-[calc(100vh-136px)]">
        
        {/* Content (Left) */}
        <div className="w-full md:w-1/2 lg:w-[48%] flex flex-col items-center md:items-start lg:items-start text-center md:text-left lg:text-left md:pr-4 lg:pr-4">
          <p className="text-eyebrow mb-5 tracking-widest text-[var(--color-brand)]">REDDIX ROBOTICS</p>
          <h1 
            className="font-bold leading-[1.1] tracking-tight mb-7" 
            style={{ fontSize: 'clamp(42px, 4.5vw, 68px)', maxWidth: '750px' }}
          >
            Engineering the Future with <span className="text-gradient">Intelligent Robotics</span>
          </h1>
          <p 
            className="text-body-lg mb-8 text-[var(--text-secondary)] mx-auto md:mx-0 lg:mx-0"
            style={{ maxWidth: '640px', lineHeight: 1.6 }}
          >
            Building innovative robotic systems, automation solutions and intelligent technologies for the future.
          </p>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4 mt-2">
            <Button size="lg" className="w-full sm:w-auto px-8 min-h-[48px] bg-[var(--color-brand)] text-white hover:opacity-90 shadow-lg shadow-[var(--color-brand)]/20 transition-all hover:-translate-y-0.5" onClick={() => navigate('/products')}>
              Explore Products <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 min-h-[48px] bg-transparent backdrop-blur-sm border-[var(--color-brand)] text-[var(--text-primary)] hover:bg-[var(--color-brand)] hover:text-white transition-all hover:-translate-y-0.5" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>

        {/* 3D Background / Right side */}
        <div className="w-full md:w-1/2 lg:w-[52%] h-[400px] sm:h-[500px] lg:h-[calc(100vh-200px)] lg:max-h-[750px] relative z-0 flex items-center justify-center animate-float mt-8 md:mt-0 lg:mt-0">
          <div className="h-full w-[clamp(280px,78vw,420px)] md:w-[clamp(360px,50vw,550px)] lg:w-full lg:max-w-[760px] xl:max-w-[800px] relative z-10 drop-shadow-2xl mx-auto">
            <Hero3D />
          </div>
        </div>

      </div>
    </section>
  );
}
