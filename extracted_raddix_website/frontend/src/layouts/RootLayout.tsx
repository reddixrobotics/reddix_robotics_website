import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';

export default function RootLayout() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar />

      <main
        id="main-content"
        className="flex-1"
        // Push content below the fixed navbar
        style={{ paddingTop: 'var(--header-height)' }}
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
