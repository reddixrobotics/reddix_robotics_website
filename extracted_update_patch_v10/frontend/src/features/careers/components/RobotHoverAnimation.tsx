import React, { useRef } from 'react';

interface RobotHoverAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

export function RobotHoverAnimation({ className, style }: RobotHoverAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isTouchDevice = () => {
    return typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches;
  };

  const handleMouseEnter = () => {
    if (isTouchDevice() || !videoRef.current) return;
    videoRef.current.play().catch((e) => console.log('Video play failed:', e));
  };

  const handleMouseLeave = () => {
    if (isTouchDevice() || !videoRef.current) return;
    videoRef.current.pause();
  };

  const handleClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((e) => console.log('Video play failed:', e));
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="absolute inset-0 w-full h-full cursor-pointer md:cursor-default z-10 bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src="/exploded-robot.mp4"
        loop
        muted
        playsInline
        className={className || "w-full h-full object-cover"}
        style={style}
      />
    </div>
  );
}
