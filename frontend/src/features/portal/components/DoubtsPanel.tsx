import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface DoubtsPanelProps {
  lessonId: string;
}

export default function DoubtsPanel({ lessonId }: DoubtsPanelProps) {
  const { user } = useAuth();
  const [doubtText, setDoubtText] = useState('');
  const [doubts, setDoubts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoubts();
  }, [lessonId]);

  const fetchDoubts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('Doubt')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });
    
    if (data) setDoubts(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || !user?.email) return;
    
    const newDoubt = {
      lesson_id: lessonId,
      user_email: user.email,
      question: doubtText,
      status: 'OPEN'
    };

    const { data, error } = await supabase
      .from('Doubt')
      .insert(newDoubt)
      .select()
      .single();

    if (!error && data) {
      setDoubts([data, ...doubts]);
      setDoubtText('');
    } else {
      alert("Failed to post doubt. Have you run the SQL migration?");
    }
  };

  return (
    <div className="bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)] p-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <MessageCircle className="text-[var(--color-brand)]" />
        Q&A / Doubts
      </h3>

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

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-[var(--text-secondary)] text-center py-8">Loading doubts...</p>
        ) : doubts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-strong)] border-dashed">
            <MessageCircle size={40} className="mx-auto text-[var(--text-secondary)]/50 mb-3" />
            <h4 className="text-[var(--text-primary)] font-bold">No questions yet</h4>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Be the first to ask a question!</p>
          </div>
        ) : (
          doubts.map(doubt => (
            <div key={doubt.id} className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-strong)]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-[var(--text-primary)] mr-2">{doubt.user_email?.split('@')[0]}</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(doubt.created_at).toLocaleDateString()}
                  </span>
                </div>
                {doubt.status === 'RESOLVED' && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded flex items-center gap-1">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                )}
              </div>
              
              <p className="text-[var(--text-secondary)] mb-4">{doubt.question}</p>
              
              {doubt.answer && (
                <div className="bg-[var(--surface-tertiary)] p-4 rounded-lg border-l-4 border-[var(--color-brand)]">
                  <span className="text-xs font-bold text-[var(--color-brand)] mb-1 block">Instructor Reply</span>
                  <p className="text-[var(--text-primary)] text-sm">{doubt.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
