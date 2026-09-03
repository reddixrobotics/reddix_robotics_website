import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/routes/routePaths';

export default function Ros2SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-content flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        className="w-full max-w-2xl text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-status-success-bg text-status-success rounded-full flex items-center justify-center mx-auto mb-8 border border-status-success/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4">WELCOME TO THE JOURNEY.</h1>
        <p className="text-xl text-content-secondary mb-12 tracking-wide">YOUR APPLICATION HAS BEEN RECEIVED.</p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => navigate(ROUTES.WORKSHOP_ROS2_IMMERSION)}
            className="w-full sm:w-auto px-8 py-4 bg-surface-secondary border border-border-strong hover:bg-surface-tertiary text-content font-bold tracking-widest text-sm transition-colors"
          >
            BACK TO PROGRAM
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 border border-border-subtle hover:bg-surface-secondary text-content font-bold tracking-widest text-sm transition-colors"
          >
            VISIT REDDIX ROBOTICS
          </button>
        </div>
      </motion.div>
    </div>
  );
}
