import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReactPlayer from 'react-player';
import { Play, Pause } from 'lucide-react';

interface SecureVideoPlayerProps {
  url: string;
  title: string;
}

export default function SecureVideoPlayer({ url, title }: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Dynamic Watermark
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.random() * 70 + 10, // 10% to 80%
        left: Math.random() * 70 + 10, // 10% to 80%
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click
    >
      {/* 
        The actual YouTube Player is completely shielded from the user's mouse.
        pointer-events-none makes it impossible to click the YouTube Logo, Titles, or "Watch on YouTube" button!
      */}
      <div className="absolute inset-0 pointer-events-none scale-[1.05]">
        <ReactPlayer 
          url={url}
          playing={playing}
          width="100%"
          height="100%"
          onReady={() => setIsReady(true)}
          config={{
            youtube: {
              playerVars: { 
                controls: 0, 
                modestbranding: 1, 
                rel: 0, 
                disablekb: 1, 
                iv_load_policy: 3 
              }
            }
          }}
        />
      </div>

      {/* Custom Overlay Controls (This is what the user actually clicks) */}
      <div 
        className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
        onClick={() => setPlaying(!playing)}
      >
        {!playing && isReady && (
          <div className="w-20 h-20 bg-[var(--color-brand)]/90 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
            <Play size={40} className="ml-2" />
          </div>
        )}
      </div>

      {/* Dynamic Anti-Piracy Watermark */}
      <div 
        className="absolute pointer-events-none select-none transition-all duration-[6000ms] ease-linear opacity-25 text-white font-black text-lg lg:text-3xl z-30 mix-blend-overlay drop-shadow-lg"
        style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
      >
        {user?.email || 'Reddix Robotics'}
      </div>

      {/* Progress Bar (Fake minimal for aesthetics since controls are hidden) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-40">
         <div className="h-full bg-[var(--color-brand)] w-0 transition-all"></div>
      </div>
    </div>
  );
}
