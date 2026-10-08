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
  
  const isOfficeDoc = url.match(/\.(pptx|ppt|docx|doc|xlsx|xls)(\?.*)?$/i);
  
  // SWITCHED to Microsoft Office Web Viewer because Google Docs viewer (gview) 
  // has a known bug where it randomly fails and forces a "gview" file download.
  // Microsoft's viewer is native for PPTX/DOCX and much more reliable.
  const embedUrl = isOfficeDoc 
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    : `${url}#toolbar=0&navpanes=0`;

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

      {type === 'PDF' ? (
        <div className="relative w-full h-full select-none pt-16">
          {/* Top Right Shield (Blocks Google Docs Pop-Out & PDF Download buttons) */}
          <div className="absolute top-0 right-0 w-64 h-24 bg-transparent z-[9998]"></div>
          
          <iframe 
            src={embedUrl}
            className="w-full h-full select-none bg-white"
            title={title}
          />
        </div>
      ) : (
        <div className="w-full h-full p-8 overflow-y-auto select-none pt-20">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-strong)]">
            <FileText className="text-[var(--color-brand)]" size={24} />
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h3>
          </div>
          <div className="prose dark:prose-invert max-w-none text-[var(--text-secondary)]">
            <p>This document is securely encrypted.</p>
          </div>
        </div>
      )}
    </div>
  );
}
