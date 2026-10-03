import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface SecureVideoPlayerProps {
  url: string;
  title: string;
}

export default function SecureVideoPlayer({ url, title }: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const cleanUrl = url ? url.trim() : '';
  const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be');
  const isValidUrl = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://');

  let youtubeEmbedUrl = '';
  if (isYouTube) {
    let videoId = '';
    if (cleanUrl.includes('v=')) {
      videoId = cleanUrl.split('v=')[1]?.split('&')[0];
    } else if (cleanUrl.includes('youtu.be/')) {
      videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0];
    }
    youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`;
  }

  if (!isValidUrl) {
    return (
      <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center text-white">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold">Invalid Video Link</h3>
        <p className="text-zinc-400">The link provided for this video is not a valid URL.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 
        We completely removed react-player because it has bugs with Vite rendering HTML5 players for YouTube links.
        We now use pure, indestructible native HTML5 and iFrames!
      */}
      {isYouTube ? (
        <iframe 
          src={youtubeEmbedUrl}
          className="w-full h-full border-none"
          allow="autoplay; fullscreen; encrypted-media"
          title={title}
        />
      ) : (
        <video 
          src={cleanUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full outline-none"
        />
      )}

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
