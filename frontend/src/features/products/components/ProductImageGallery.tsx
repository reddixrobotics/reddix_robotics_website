import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, PlayCircle } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full w-full min-w-0">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto custom-scrollbar pb-2 md:pb-0 md:pr-2 w-full md:w-28 lg:w-32 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={"relative flex-shrink-0 w-28 h-20 lg:w-32 lg:h-24 rounded-lg overflow-hidden border-2 transition-all " + (activeImage === idx ? 'border-[var(--color-brand)] shadow-md' : 'border-transparent hover:border-[var(--border-strong)] opacity-70 hover:opacity-100')}
            >
              {isVideo(img) ? (
                <>
                  <video src={img} className="w-full h-full object-cover bg-black" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="text-white opacity-80" size={24} />
                  </div>
                </>
              ) : (
                <img src={img} alt={"Thumbnail " + (idx + 1)} className="w-full h-full object-cover bg-white" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div 
        className="flex-1 min-w-0 w-full relative bg-white rounded-xl overflow-hidden cursor-pointer group shadow-sm flex items-center justify-center"
        onClick={() => !isVideo(images[activeImage]) && setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          {isVideo(images[activeImage]) ? (
            <motion.video
              key={activeImage + '-vid'}
              src={images[activeImage]}
              controls
              autoPlay
              muted
              loop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-auto bg-black"
            />
          ) : (
            <motion.img
              key={activeImage + '-img'}
              src={images[activeImage] || 'https://via.placeholder.com/800'}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-auto object-contain"
            />
          )}
        </AnimatePresence>
        
        {!isVideo(images[activeImage]) && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <ZoomIn size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

