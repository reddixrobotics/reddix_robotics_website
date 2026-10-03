import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface DoubtsPanelProps {
  lessonId: string;
}

export default function DoubtsPanel({ lessonId }: DoubtsPanelProps) {
  const [doubtText, setDoubtText] = useState('');
  const [doubts, setDoubts] = useState<any[]>([]);

  // We will hook this up to Supabase later
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    
    // Optimistic UI update
    setDoubts([{ id: Date.now(), text: doubtText, status: 'OPEN', created_at: new Date() }, ...doubts]);
    setDoubtText('');
  };

  return (
    <div className="bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)] p-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <MessageCircle className="text-[var(--color-brand)]" />
        Q&A / Doubts
      </h3>

      {/* Submit Doubt Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Ask a question about this lesson..."
            className="flex-1 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none transition-colors"
          />
          <button 
            type="submit" 
            className="px-6 py-4 bg-[var(--color-brand)] text-white rounded-xl font-bold hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            Ask <Send size={18} />
          </button>
        </div>
      </form>

      {/* List Doubts */}
      <div className="space-y-4">
        {doubts.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            No questions asked yet. Be the first to ask!
          </div>
        ) : (
          doubts.map(d => (
            <div key={d.id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[var(--text-primary)]">You</span>
                <span className="text-xs text-[var(--text-muted)]">{new Date(d.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-[var(--text-secondary)]">{d.text}</p>
              
              {/* Fake Admin Reply for visual layout */}
              {d.status === 'ANSWERED' && (
                <div className="mt-4 p-4 rounded-lg bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20">
                  <span className="font-bold text-[var(--color-brand)] text-sm block mb-1">Instructor Reply</span>
                  <p className="text-[var(--text-primary)] text-sm">We are processing this question!</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
