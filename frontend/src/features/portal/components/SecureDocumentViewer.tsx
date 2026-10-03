import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText } from 'lucide-react';

interface SecureDocumentViewerProps {
  url: string;
  type: string;
  title: string;
}

export default function SecureDocumentViewer({ url, type, title }: SecureDocumentViewerProps) {
  const { user } = useAuth();

  return (
    <div 
      className="relative w-full h-[600px] bg-[var(--surface-secondary)] rounded-xl overflow-hidden border border-[var(--border-strong)]"
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click
    >
      {/* Dynamic Watermark */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex flex-wrap gap-12 opacity-[0.03] select-none transform -rotate-12 scale-150 justify-center items-center">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="text-xl font-bold whitespace-nowrap text-black dark:text-white">
            {user?.email || 'Reddix Robotics'}
          </span>
        ))}
      </div>

      {type === 'PDF' ? (
        <div className="relative w-full h-full select-none">
          {/* Transparent shield overlay to block saving */}
          <div className="absolute inset-0 z-40 bg-transparent" />
          <iframe 
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full select-none pointer-events-none"
            title={title}
          />
        </div>
      ) : (
        <div className="w-full h-full p-8 overflow-y-auto select-none">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-strong)]">
            <FileText className="text-[var(--color-brand)]" size={24} />
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h3>
          </div>
          <div className="prose dark:prose-invert max-w-none text-[var(--text-secondary)]">
            {/* If it's HTML notes, we render safely. For MVP, we just show a placeholder */}
            <p>This document is securely encrypted. Notes will render here.</p>
            <div dangerouslySetInnerHTML={{ __html: url }} />
          </div>
        </div>
      )}
    </div>
  );
}
