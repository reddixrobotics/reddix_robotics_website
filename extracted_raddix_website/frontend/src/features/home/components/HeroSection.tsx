import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hero3D from './Hero3D';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--bg-primary)]">
      {/* 3D Background / Right side */}
      <div className="absolute inset-0 z-0 lg:left-1/2 lg:w-1/2">
        <Hero3D />
      </div>

      {/* Content */}
      <div className="container-content relative z-10 w-full pt-32 pb-16 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-eyebrow mb-4 tracking-widest text-[var(--color-brand)]">REDDIX ROBOTICS</p>
          <h1 className="text-display-lg mb-6 leading-tight">
            Engineering the Future with <span className="text-gradient">Intelligent Robotics</span>
          </h1>
          <p className="text-body-lg mb-10 text-[var(--text-secondary)]">
            Building innovative robotic systems, automation solutions and intelligent technologies for the future.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="px-8" onClick={() => navigate('/products')}>
              Explore Products <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-transparent backdrop-blur-sm" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
      
      {/* Removed bottom fade for a cleaner layout */}
    </section>
  );
}

