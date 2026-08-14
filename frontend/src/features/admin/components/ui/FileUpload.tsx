import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  onChange?: (files: File[]) => void;
}

export function FileUpload({ label = 'Upload Files', multiple = false, accept = 'image/*', onChange }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = multiple ? [...selectedFiles, ...files] : [files[0]];
      setSelectedFiles(newFiles);
      if (onChange) onChange(newFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      const newFiles = multiple ? [...selectedFiles, ...files] : [files[0]];
      setSelectedFiles(newFiles);
      if (onChange) onChange(newFiles);
    }
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
    </div>
  );
}
