import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, CheckCircle2, Search, Send } from 'lucide-react';

export default function AdminDoubts() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('OPEN');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchDoubts();
  }, [filter]);

  async function fetchDoubts() {
    setLoading(true);
    let query = supabase
      .from('Doubt')
      .select('*, Lesson(title, Module(title, Workshop(title)))')
      .order('created_at', { ascending: false });

    if (filter !== 'ALL') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (data) setDoubts(data);
    setLoading(false);
  }

  async function handleReply(doubtId: string) {
    const text = replyText[doubtId];
    if (!text?.trim()) return;

    setSubmitting(doubtId);
    const { error } = await supabase
      .from('Doubt')
      .update({ answer: text, status: 'RESOLVED' })
      .eq('id', doubtId);

    if (!error) {
      setReplyText(prev => ({ ...prev, [doubtId]: '' }));
      fetchDoubts();
    } else {
      alert("Failed to save reply.");
    }
    setSubmitting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Student Q&A Forum</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('OPEN')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'OPEN' ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Open Questions
          </button>
          <button 
            onClick={() => setFilter('RESOLVED')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'RESOLVED' ? 'bg-green-600 text-white' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Resolved
          </button>
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'ALL' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading questions...</p>
        ) : doubts.length === 0 ? (
          <div className="text-center py-20 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)]">
            <MessageCircle size={48} className="mx-auto text-[var(--text-secondary)]/50 mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">No questions found</h3>
            <p className="text-[var(--text-secondary)] mt-2">Students haven't asked any {filter.toLowerCase()} questions yet.</p>
          </div>
        ) : (
          doubts.map(doubt => (
            <div key={doubt.id} className="bg-[var(--surface-secondary)] p-6 rounded-xl border border-[var(--border-strong)]">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--border-strong)]">
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-lg mb-1">{doubt.question}</h4>
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)] font-medium">
                    <span className="text-[var(--color-brand)]">{doubt.user_email}</span>
                    <span>•</span>
                    <span>{doubt.Lesson?.Module?.Workshop?.title} - {doubt.Lesson?.title}</span>
                    <span>•</span>
                    <span>{new Date(doubt.created_at).toLocaleString()}</span>
                  </div>
                </div>
                {doubt.status === 'RESOLVED' ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs font-bold rounded-full">
                    Needs Reply
                  </span>
                )}
              </div>

              {doubt.answer ? (
                <div className="bg-[var(--surface-tertiary)] p-4 rounded-lg border-l-4 border-green-500">
                  <span className="text-xs font-bold text-green-500 mb-2 block">Instructor Reply</span>
                  <p className="text-[var(--text-primary)]">{doubt.answer}</p>
                </div>
              ) : (
                <div className="mt-4 flex gap-3">
                  <input 
                    type="text" 
                    value={replyText[doubt.id] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                    placeholder="Type your reply here..."
                    className="flex-1 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none"
                  />
                  <button 
                    onClick={() => handleReply(doubt.id)}
                    disabled={submitting === doubt.id || !replyText[doubt.id]?.trim()}
                    className="px-6 py-3 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {submitting === doubt.id ? 'Sending...' : <>Reply <Send size={16} /></>}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
