import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';
import { ImageCropperModal } from './ImageCropperModal';

interface FileUploadProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  onChange?: (files: File[]) => void;
  aspectRatio?: number;
}

export function FileUpload({ label = 'Upload Files', multiple = false, accept = 'image/*', onChange, aspectRatio = 1 }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');
  const [pendingFileIndex, setPendingFileIndex] = useState<number | null>(null);
  const [tempFiles, setTempFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files: File[]) => {
    const isImageUpload = accept.includes('image');
    if (isImageUpload && files.length > 0) {
      // Setup the cropper for the first image
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImageSrc(reader.result as string);
        setTempFiles(files); // Hold all files
        setPendingFileIndex(0); // Currently cropping the first one
        setCropperOpen(true);
      };
      reader.readAsDataURL(files[0]);
    } else {
      const newFiles = multiple ? [...selectedFiles, ...files] : [files[0]];
      setSelectedFiles(newFiles);
      if (onChange) onChange(newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
    e.target.value = ''; // Reset input
  };

  const handleCropComplete = (croppedFile: File) => {
    if (pendingFileIndex === null) return;

    // Replace the uncropped file with the cropped one
    const updatedTempFiles = [...tempFiles];
    updatedTempFiles[pendingFileIndex] = croppedFile;

    // Move to next file if multiple (for now we only crop the first image for simplicity, 
    // or we can just accept the rest as is to save admin time, but typically single uploads are used)
    const newFiles = multiple ? [...selectedFiles, ...updatedTempFiles] : [updatedTempFiles[0]];
    setSelectedFiles(newFiles);
    if (onChange) onChange(newFiles);
    
    setCropperOpen(false);
    setPendingFileIndex(null);
    setCurrentImageSrc('');
    setTempFiles([]);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setPendingFileIndex(null);
    setCurrentImageSrc('');
    setTempFiles([]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    if (onChange) onChange(newFiles);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>}
      <div
        className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${
          dragActive ? 'border-red-500 bg-red-500/5' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud size={32} className="text-zinc-500 mb-3" />
        <p className="text-sm text-zinc-300 font-medium">Drag and drop files here</p>
        <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <span className="text-sm text-zinc-300 truncate max-w-[200px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-zinc-400 hover:text-red-500 p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {cropperOpen && (
        <ImageCropperModal
          isOpen={cropperOpen}
          imageSrc={currentImageSrc}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}
