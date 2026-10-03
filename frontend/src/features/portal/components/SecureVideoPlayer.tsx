import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SecureVideoPlayerProps {
  url: string;
  title: string;
}

export default function SecureVideoPlayer({ url, title }: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });

  // Move the watermark randomly every 5 seconds to prevent static cropping
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.random() * 80 + 10, // 10% to 90%
        left: Math.random() * 70 + 10, // 10% to 80%
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={url}
        controls
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>

      {/* Dynamic Anti-Piracy Watermark */}
      <div 
        className="absolute pointer-events-none select-none transition-all duration-1000 ease-in-out opacity-30 text-white font-bold text-lg lg:text-2xl z-50 mix-blend-difference drop-shadow-md"
        style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
      >
        {user?.email || 'Reddix Robotics'}
        <br />
        <span className="text-xs lg:text-sm font-normal">Property of Reddix Robotics</span>
      </div>

      {/* Invisible Overlay to block right-clicks on specific browser controls */}
      <div className="absolute inset-0 pointer-events-none z-40"></div>
    </div>
  );
}
