import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import { X, Check, Plus, Minus, Upload as UploadIcon } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
}

export function ImageCropperModal({ 
  isOpen, 
  imageSrc: initialImageSrc, 
  onClose, 
  onCropComplete,
  aspectRatio = 1
}: ImageCropperModalProps) {
  const [localImageSrc, setLocalImageSrc] = useState(initialImageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLocalImageSrc(initialImageSrc);
  }, [initialImageSrc]);

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(localImageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
      // onClose is called by parent upon completion
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReupload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLocalImageSrc(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0b0f19] text-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#0b0f19] border-b border-white/10 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-content/80 hover:text-content"
          >
            <X size={24} />
          </button>
          <span className="font-medium text-[15px] text-content/90">Drag the image to adjust</span>
        </div>
        <div>
          <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-sm font-medium text-content/80 hover:text-content">
            <UploadIcon size={16} />
            <span>Upload</span>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/jpg, image/webp" 
              className="hidden" 
              onChange={handleReupload}
            />
          </label>
        </div>
      </div>

      {/* Cropper Workspace */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <Cropper
          image={localImageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          showGrid={true}
          zoomSpeed={1.2}
          restrictPosition={false} 
          objectFit="contain" // Ensures image starts zoomed out and fits natively
        />

        {/* Floating Zoom Controls (Right) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-surface-overlay backdrop-blur-sm backdrop-blur-md rounded-full p-1.5 border border-white/10 z-20 shadow-xl">
          <button 
            onClick={() => setZoom(Math.min(3, zoom + 0.1))} 
            className="p-2.5 hover:bg-white/20 rounded-full transition-colors text-content"
            title="Zoom In"
          >
            <Plus size={20} />
          </button>
          <div className="w-full h-[1px] bg-white/20 my-0.5" />
          <button 
            onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} 
            className="p-2.5 hover:bg-white/20 rounded-full transition-colors text-content"
            title="Zoom Out"
          >
            <Minus size={20} />
          </button>
        </div>

        {/* Floating Confirm Button (Bottom Right) */}
        <button 
          onClick={handleSave} 
          disabled={isProcessing}
          className="absolute bottom-8 right-8 w-16 h-16 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center text-content shadow-2xl z-20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Crop & Save"
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check size={32} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}
