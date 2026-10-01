import { Factory, HeartPulse, Package, Truck, TestTube, Tractor } from 'lucide-react';

export default function SolutionsSection() {
  const industries = [
    { icon: Factory, name: 'Manufacturing' },
    { icon: HeartPulse, name: 'Healthcare' },
    { icon: Package, name: 'Warehousing' },
    { icon: Truck, name: 'Logistics' },
    { icon: TestTube, name: 'Research' },
    { icon: Tractor, name: 'Agriculture' }
  ];

  return (
    <section className="bg-white py-24 lg:py-32 border-b border-[var(--border-subtle)]">
      <div className="container-content">
        <div className="text-center mb-16">
          <p className="text-eyebrow text-[var(--color-brand)] font-bold tracking-widest mb-4">INDUSTRIES</p>
          <h2 className="text-heading-xl lg:text-display-sm font-display text-[var(--text-primary)]">
            Solutions Across Sectors
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
          {industries.map((ind, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 bg-[var(--bg-secondary)] rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[var(--border-subtle)] cursor-default">
              <div className="w-16 h-16 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-4 text-[var(--color-brand)]">
                <ind.icon size={32} strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-[var(--text-primary)]">{ind.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


