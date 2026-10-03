import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ReactPlayer from 'react-player';
import { AlertTriangle } from 'lucide-react';

interface SecureVideoPlayerProps {
  url: string;
  title: string;
}

export default function SecureVideoPlayer({ url, title }: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
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

  const isYouTube = url && (url.includes('youtube.com') || url.includes('youtu.be'));
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
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-50">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <p className="text-white font-bold">Video failed to load.</p>
          <p className="text-zinc-400 text-sm mt-1">Make sure the link is correct.</p>
        </div>
      ) : null}

      {/* 
        We use native controls because custom React Play buttons get blocked by browser Autoplay policies.
        Instead, we just put physical shields over the areas where YouTube puts external links!
      */}
      <ReactPlayer 
        url={url}
        width="100%"
        height="100%"
        controls={true} // Use native controls to avoid Autoplay blocking
        onError={() => setHasError(true)}
        config={{
          youtube: {
            playerVars: { 
              modestbranding: 1, 
              rel: 0, 
            }
          },
          file: {
            attributes: {
              controlsList: 'nodownload' // Disables download button for raw MP4s
            }
          }
        }}
      />

      {isYouTube && (
        <>
          {/* Block YouTube Title at the top */}
          <div className="absolute top-0 left-0 w-full h-16 bg-transparent z-40"></div>
          {/* Block YouTube "Watch on YouTube" Logo at the bottom right */}
          <div className="absolute bottom-0 right-0 w-40 h-16 bg-transparent z-40"></div>
        </>
      )}

      {/* Dynamic Anti-Piracy Watermark */}
      <div 
        className="absolute pointer-events-none select-none transition-all duration-[6000ms] ease-linear opacity-25 text-white font-black text-lg lg:text-3xl z-30 mix-blend-overlay drop-shadow-lg"
        style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
      >
        {user?.email || 'Reddix Robotics'}
      </div>
    </div>
  );
}
