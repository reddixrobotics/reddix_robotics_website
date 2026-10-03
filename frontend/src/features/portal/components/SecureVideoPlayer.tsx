import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReactPlayer from 'react-player';
import { Play, Pause, AlertTriangle } from 'lucide-react';

interface SecureVideoPlayerProps {
  url: string;
  title: string;
}

export default function SecureVideoPlayer({ url, title }: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Dynamic Watermark
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));

  if (!isValidUrl) {
    return (
      <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center text-white">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold">Invalid Video Link</h3>
        <p className="text-zinc-400">The link provided for this video is not a valid URL.</p>
        <p className="text-zinc-500 text-sm mt-2 text-center px-4 break-all">Provided: {url}</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none scale-[1.05]">
        <ReactPlayer 
          url={url}
          playing={playing}
          width="100%"
          height="100%"
          onError={(e) => {
            console.error("ReactPlayer Error:", e);
            setHasError(true);
          }}
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

      <div 
        className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
        onClick={() => setPlaying(!playing)}
      >
        {hasError ? (
          <div className="text-center bg-black/80 p-6 rounded-xl border border-red-500/30">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-2" />
            <p className="text-white font-bold">Video failed to load.</p>
            <p className="text-zinc-400 text-sm mt-1">Check the URL or try refreshing.</p>
          </div>
        ) : !playing ? (
          <div className="w-20 h-20 bg-[var(--color-brand)]/90 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
            <Play size={40} className="ml-2" />
          </div>
        ) : null}
      </div>

      <div 
        className="absolute pointer-events-none select-none transition-all duration-[6000ms] ease-linear opacity-25 text-white font-black text-lg lg:text-3xl z-30 mix-blend-overlay drop-shadow-lg"
        style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
      >
        {user?.email || 'Reddix Robotics'}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-40">
         <div className="h-full bg-[var(--color-brand)] w-0 transition-all"></div>
      </div>
    </div>
  );
}
