import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export default function FeaturedRobotSection() {
  return (
    <section className="relative w-full py-32 lg:py-48 bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2940&auto=format&fit=crop" 
          alt="Featured Robot" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      
      <div className="container-content relative z-10 text-center">
        <h2 className="text-display-md lg:text-display-lg font-display text-white mb-6 leading-tight max-w-4xl mx-auto">
          Intelligent Robotics. <br/><span className="text-[var(--color-brand)]">Engineered for Tomorrow.</span>
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Discover our next generation of autonomous robotic systems, built with enterprise-grade durability and state-of-the-art AI.
        </p>
        <Button size="lg" className="px-10 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white border-none shadow-[0_0_20px_rgba(181,18,27,0.4)]">
          Explore Technology <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </section>
  );
}


