import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div 
        className="relative aspect-square w-full bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-strong)] overflow-hidden cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            alt={`${productName} view ${activeImage + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === idx ? 'border-[var(--color-brand)]' : 'border-transparent hover:border-[var(--border-strong)]'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} />
            </button>
            <img 
              src={images[activeImage]} 
              alt={productName} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
