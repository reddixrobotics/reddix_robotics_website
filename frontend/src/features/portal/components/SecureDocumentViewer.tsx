import React, { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText, Maximize, Minimize } from 'lucide-react';

interface SecureDocumentViewerProps {
  url: string;
  type: string;
  title: string;
}

export default function SecureDocumentViewer({ url, type, title }: SecureDocumentViewerProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const getEmbedUrl = (rawUrl: string, docType: string) => {
    if (!rawUrl) return '';
    const cleanUrl = rawUrl.trim();

    // 1. Google Drive view link -> embed preview
    if (cleanUrl.includes('drive.google.com/file/d/')) {
      return cleanUrl.replace(/\/view(\?.*)?$/i, '/preview');
    }
    // 2. Google Slides link -> embed presentation
    if (cleanUrl.includes('docs.google.com/presentation/d/')) {
      return cleanUrl.replace(/\/edit(\?.*)?$/i, '/embed');
    }
    // 3. Google Docs link -> embed preview
    if (cleanUrl.includes('docs.google.com/document/d/')) {
      return cleanUrl.replace(/\/edit(\?.*)?$/i, '/preview');
    }

    // 4. Office Documents (PPT, PPTX, DOCX, DOC, XLSX, XLS)
    const isOfficeDoc = cleanUrl.match(/\.(pptx|ppt|docx|doc|xlsx|xls)(\?.*)?$/i);
    const isPptType = (docType || '').toUpperCase().includes('PPT');

    if (isOfficeDoc || isPptType) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
    }

    // 5. PDF or general document: suppress Chrome/viewer toolbar & navigation buttons
    return `${cleanUrl}#toolbar=0&navpanes=0`;
  };

  const embedUrl = getEmbedUrl(url, type);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => console.error(err));
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-[var(--surface-secondary)] overflow-hidden border border-[var(--border-strong)] ${isFullscreen ? 'h-screen rounded-none' : 'h-[700px] rounded-xl'}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Custom Fullscreen Button (Max Z-Index to guarantee it stays on top) */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 left-4 z-[9999] bg-[var(--bg-primary)] p-3 rounded-xl shadow-2xl border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--color-brand)] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        <span className="text-sm font-black">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
      </button>

      {/* Dynamic Watermark */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex flex-wrap gap-12 opacity-[0.04] select-none transform -rotate-12 scale-150 justify-center items-center">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="text-xl font-bold whitespace-nowrap text-black dark:text-white drop-shadow-md">
            {user?.email || 'Reddix Robotics'}
          </span>
        ))}
      </div>

      {url ? (
        <div className="relative w-full h-full select-none pt-16">
          {/* Top Right Shield (Blocks Chrome Native PDF Download/Print Buttons) */}
          <div className="absolute top-0 right-0 w-64 h-24 bg-transparent z-[9998]"></div>
          
          {/* Bottom Right Shield (Blocks Microsoft Office Download/Menu/Fullscreen Buttons) */}
          <div className="absolute bottom-0 right-0 w-48 h-16 bg-transparent z-[9998]" title="Action disabled for security"></div>
          
          {/* Bottom Left Shield (Blocks Microsoft Office Logo External Link) */}
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-transparent z-[9998]" title="Action disabled for security"></div>

          <iframe 
            src={embedUrl}
            className="w-full h-full select-none bg-white"
            title={title}
          />
        </div>
      ) : (
        <div className="w-full h-full p-8 overflow-y-auto select-none pt-20 flex flex-col items-center justify-center text-center">
          <FileText className="text-[var(--text-muted)] mb-3" size={48} />
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)]">No document attachment available.</p>
        </div>
      )}
    </div>
  );
}
