import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 300;
const FRAME_URL = (index: number) => `/ezgif-18460ee51e7fb8cc-jpg/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

interface RobotHoverAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

export function RobotHoverAnimation({ className, style }: RobotHoverAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(FRAME_COUNT); // Start at fully assembled (frame 300)
  const animationRef = useRef<number | null>(null);
  const targetFrameRef = useRef(FRAME_COUNT);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    
    // Load the initial frame (300) FIRST so it appears instantly
    const initialImg = new Image();
    initialImg.src = FRAME_URL(FRAME_COUNT);
    initialImg.onload = () => {
      drawFrame(FRAME_COUNT, initialImg);
      
      // Once the initial frame is loaded and visible, queue the rest in the background
      for (let i = 1; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = FRAME_URL(i);
        loadedImages[i] = img;
      }
    };
    loadedImages[FRAME_COUNT] = initialImg;
    
    imagesRef.current = loadedImages;
  }, []);

  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);

  const drawFrame = (index: number, img?: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let imageToDraw = img || imagesRef.current[index];
    
    if (!imageToDraw || !imageToDraw.complete) {
      // Fallback to the last successfully drawn image to prevent flickering/jumping while loading
      if (lastDrawnImageRef.current) {
        imageToDraw = lastDrawnImageRef.current;
      } else {
        return;
      }
    } else {
      lastDrawnImageRef.current = imageToDraw;
    }
    
    // Calculate object-cover dimensions to fill the container
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = imageToDraw.width / imageToDraw.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;
    
    if (canvasRatio > imgRatio) {
      // Canvas is wider than image, so scale image to fit canvas width
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image, so scale image to fit canvas height
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageToDraw, offsetX, offsetY, drawWidth, drawHeight);
  };

  const animate = () => {
    if (frameRef.current === targetFrameRef.current) {
      animationRef.current = null;
      return;
    }

    if (frameRef.current < targetFrameRef.current) {
      frameRef.current++;
    } else {
      frameRef.current--;
    }

    drawFrame(frameRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  const [isExploded, setIsExploded] = useState(false);

  // Sync state to target frame
  useEffect(() => {
    targetFrameRef.current = isExploded ? 1 : FRAME_COUNT;
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isExploded]);

  const isTouchDevice = () => {
    return typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches;
  };

  const handleMouseEnter = () => {
    if (isTouchDevice()) return;
    setIsExploded(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice()) return;
    setIsExploded(false);
  };

  const handleClick = () => {
    setIsExploded(!isExploded);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        // Match actual display size
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawFrame(frameRef.current);
      }
    };
    
    // Initial size
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-pointer md:cursor-default z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className={className || "w-full h-full block"}
        style={style}
      />
    </div>
  );
}
