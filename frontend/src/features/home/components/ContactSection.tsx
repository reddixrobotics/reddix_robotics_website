import { Button } from '@/components/ui';

export default function ContactSection() {
  return (
    <section className="bg-white py-24 lg:py-32 border-b border-[var(--border-subtle)]">
      <div className="container-content">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <div className="w-full lg:w-1/2">
            <p className="text-eyebrow text-[var(--color-brand)] font-bold tracking-widest mb-4">GET IN TOUCH</p>
            <h2 className="text-display-sm lg:text-[3.5rem] font-display text-[var(--text-primary)] mb-8 leading-tight">
              Let's Build Something <span className="text-[var(--color-brand)]">Intelligent</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Whether you need custom automation solutions, want to integrate our platforms, or simply want to chat about the future of robotics.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[var(--text-primary)]">
                <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center font-bold">@</div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Email Us</p>
                  <p className="font-semibold">hello@reddixrobotics.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <form className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-subtle)] shadow-sm flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Name</label>
                  <input type="text" className="px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Company</label>
                  <input type="text" className="px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50" placeholder="Tech Corp" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-primary)]">Email</label>
                <input type="email" className="px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50" placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-primary)]">Message</label>
                <textarea rows={4} className="px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 resize-none" placeholder="Tell us about your project..."></textarea>
              </div>
              <Button size="lg" className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white mt-2">
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}


