import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor, Html, useProgress } from '@react-three/drei';
import Hero3DFallback from './Hero3DFallback';
import { useReducedMotion } from 'framer-motion';

// Lazy load the model component so the main bundle is smaller
const RobotModel = lazy(() => import('./RobotModel'));

function HeroLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[var(--color-brand)] font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-md whitespace-nowrap shadow-[0_0_15px_rgba(255,51,51,0.2)] border border-[var(--color-brand)]/20 tracking-wide text-sm">
        INITIALIZING... {Math.round(progress)}%
      </div>
    </Html>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Simple WebGL Support Check
const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

export default function Hero3D() {
  const [dpr, setDpr] = useState(1.5);
  const [isSupported, setIsSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsSupported(isWebGLSupported());
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If WebGL fails, or if it's a mobile device with prefers-reduced-motion, show the fallback
  if (!isSupported || (isMobile && shouldReduceMotion)) {
    return <Hero3DFallback />;
  }

  return (
    <div className="w-full h-full relative">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        dpr={dpr} 
        className="w-full h-full opacity-80 lg:opacity-100"
        shadows
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        {/* Drop DPR if frame rate struggles */}
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        
        <ErrorBoundary fallback={<Html center><Hero3DFallback /></Html>}>
          <Suspense fallback={<HeroLoader />}>
            
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow shadow-bias={-0.0001} />
            <spotLight position={[5, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
            
            {/* Tomato-red accent lighting */}
            <pointLight position={[-5, 2, -5]} intensity={4} color="#ff3333" distance={15} />
            <pointLight position={[5, -2, -5]} intensity={3} color="#ff6347" distance={15} />

            <RobotModel />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={false} 
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}
