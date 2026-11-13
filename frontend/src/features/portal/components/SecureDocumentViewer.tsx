import React, { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText, Maximize, Minimize, ExternalLink, Download, RefreshCw } from 'lucide-react';

interface SecureDocumentViewerProps {
  url: string;
  type: string;
  title: string;
}

export default function SecureDocumentViewer({ url, type, title }: SecureDocumentViewerProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerEngine, setViewerEngine] = useState<'google' | 'office'>('google');

  if (!url) {
    return (
      <div className="w-full h-[600px] p-8 overflow-y-auto select-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] flex flex-col items-center justify-center text-center">
        <FileText className="text-[var(--text-muted)] mb-3" size={48} />
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">No document attachment available.</p>
      </div>
    );
  }

  const cleanUrl = url.trim();

  // 1. Google Drive view link -> embed preview
  const isGoogleDrive = cleanUrl.includes('drive.google.com/file/d/');
  // 2. Google Slides link -> embed presentation
  const isGoogleSlides = cleanUrl.includes('docs.google.com/presentation/d/');
  // 3. Google Docs link -> embed preview
  const isGoogleDocs = cleanUrl.includes('docs.google.com/document/d/');
  // 4. Canva link
  const isCanva = cleanUrl.includes('canva.com/design/');
  // 5. Native PDF check (check extension in URL before anything else)
  const isExplicitPdf = cleanUrl.match(/\.pdf(\?.*)?$/i) !== null;
  const isPdfType = (type || '').toUpperCase().includes('PDF');
  const isPdf = isExplicitPdf || (isPdfType && !cleanUrl.match(/\.(pptx|ppt|docx|doc)(\?.*)?$/i));
  // 6. Presentation / Office doc
  const isOfficeDoc = cleanUrl.match(/\.(pptx|ppt|docx|doc|xlsx|xls)(\?.*)?$/i) !== null;
  const isPpt = (type || '').toUpperCase().includes('PPT') || cleanUrl.match(/\.(pptx|ppt)(\?.*)?$/i) !== null;

  const getEmbedUrl = () => {
    if (isGoogleDrive) {
      return cleanUrl.replace(/\/view(\?.*)?$/i, '/preview');
    }
    if (isGoogleSlides) {
      return cleanUrl.replace(/\/edit(\?.*)?$/i, '/embed');
    }
    if (isGoogleDocs) {
      return cleanUrl.replace(/\/edit(\?.*)?$/i, '/preview');
    }
    if (isCanva) {
      return cleanUrl.includes('/view') ? cleanUrl : `${cleanUrl}/view`;
    }
    if (isPdf) {
      return `${cleanUrl}#toolbar=0&navpanes=0`;
    }
    if (isOfficeDoc || isPpt) {
      if (viewerEngine === 'office') {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
      }
      // Google Docs Viewer (fast, reliable for cloud storage public URLs)
      return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
    }
    // Fallback: direct with hash parameters
    return `${cleanUrl}#toolbar=0&navpanes=0`;
  };

  const embedUrl = getEmbedUrl();
  const showEngineSwitcher = (isOfficeDoc || isPpt) && !isGoogleSlides && !isGoogleDocs && !isGoogleDrive && !isPdf;

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
      className={`relative w-full bg-[var(--surface-secondary)] overflow-hidden border border-[var(--border-strong)] ${isFullscreen ? 'h-screen rounded-none' : 'h-[750px] rounded-xl'}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[9999] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Fullscreen Button */}
          <button 
            type="button"
            onClick={toggleFullscreen}
            className="bg-[var(--bg-primary)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--color-brand)] hover:text-white transition-all flex items-center gap-2 cursor-pointer text-xs font-bold"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>

          {/* Engine Switcher (for PPT / Office docs) */}
          {showEngineSwitcher && (
            <div className="bg-[var(--bg-primary)] p-1 rounded-xl shadow-lg border border-[var(--border-strong)] flex items-center gap-1 text-xs">
              <span className="px-2 font-bold text-[var(--text-secondary)] hidden sm:inline">Engine:</span>
              <button
                type="button"
                onClick={() => setViewerEngine('google')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewerEngine === 'google'
                    ? 'bg-[var(--color-brand)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Google Docs Cloud Viewer (Fast & Reliable)"
              >
                Google Viewer
              </button>
              <button
                type="button"
                onClick={() => setViewerEngine('office')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewerEngine === 'office'
                    ? 'bg-[var(--color-brand)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Microsoft Office Online Viewer"
              >
                Office Viewer
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--bg-primary)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title="Open Document in New Tab"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Open in New Tab</span>
          </a>

          <a
            href={cleanUrl}
            download={title || 'presentation'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--bg-primary)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title="Download Document"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Dynamic Watermark */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex flex-wrap gap-12 opacity-[0.04] select-none transform -rotate-12 scale-150 justify-center items-center">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="text-xl font-bold whitespace-nowrap text-black dark:text-white drop-shadow-md">
            {user?.email || 'Reddix Robotics'}
          </span>
        ))}
      </div>

      {/* Main Document Frame */}
      <div className="relative w-full h-full select-none pt-14">
        <iframe 
          key={`${embedUrl}_${viewerEngine}`}
          src={embedUrl}
          className="w-full h-full select-none bg-white border-0"
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
        />
      </div>

      {/* Bottom helper tip if viewing presentation */}
      {showEngineSwitcher && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-[var(--bg-primary)]/90 backdrop-blur px-3 py-1 rounded-full border border-[var(--border-strong)] text-[11px] text-[var(--text-secondary)] shadow-md flex items-center gap-2 pointer-events-auto">
          <span>Having trouble loading slides?</span>
          <button 
            type="button" 
            onClick={() => setViewerEngine(v => v === 'google' ? 'office' : 'google')}
            className="text-[var(--color-brand)] font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCw size={11} /> Switch to {viewerEngine === 'google' ? 'Office Viewer' : 'Google Viewer'}
          </button>
        </div>
      )}
    </div>
  );
}
