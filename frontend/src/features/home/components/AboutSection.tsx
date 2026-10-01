import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function AboutSection() {
  return (
    <section className="bg-[var(--bg-secondary)] py-24 lg:py-32 overflow-hidden">
      <div className="container-content">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-[var(--color-brand)]/5 transform rotate-3 rounded-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2940&auto=format&fit=crop" 
              alt="Advanced Robotics Facility" 
              className="w-full h-auto aspect-[4/3] object-cover rounded-2xl shadow-xl relative z-10"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-[var(--color-brand)]"></span>
              <p className="text-eyebrow text-[var(--color-brand)] font-bold tracking-widest">ABOUT REDDIX</p>
            </div>
            <h2 className="text-heading-xl lg:text-display-sm font-display mb-8 text-[var(--text-primary)] leading-tight">
              Building Intelligent Machines for a Smarter Future
            </h2>
            <p className="text-body-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
              At Reddix Robotics, we sit at the intersection of mechanical engineering, artificial intelligence, and advanced automation. Our mission is to seamlessly integrate intelligent systems into industrial workflows.
            </p>
            <ul className="grid grid-cols-2 gap-4 mb-10">
              {['Robotics', 'Automation', 'AI Systems', 'Industrial Solutions', 'Research', 'Innovation'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]"></div>
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="group">
              Read Our Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


