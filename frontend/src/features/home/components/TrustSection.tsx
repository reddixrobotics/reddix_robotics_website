export default function TrustSection() {
  const stats = [
    { value: '10+', label: 'Robotics Projects' },
    { value: '5+', label: 'Industry Solutions' },
    { value: '10+', label: 'Automation Systems' },
    { value: '24/7', label: 'Intelligent Automation' },
  ];

  return (
    <section className="bg-white border-b border-[var(--border-subtle)] py-16">
      <div className="container-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--border-subtle)]">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <p className="text-4xl md:text-5xl font-bold font-display text-[var(--text-primary)] mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


