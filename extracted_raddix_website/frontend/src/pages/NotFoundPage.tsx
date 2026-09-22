import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';

/** NotFoundPage — 404 fallback */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="font-mono text-8xl font-bold text-brand-500/20">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-white/50">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
