import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Send, MessageCircle, CheckCircle2 } from 'lucide-react';

export default function PortalDoubts() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  async function fetchDoubts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('Doubt')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setDoubts(data);
    if (error) console.error('Doubt fetch error:', error);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !user?.email) return;
    setSending(true);

    const { error } = await supabase.from('Doubt').insert({
      lesson_id: null,
      user_email: user.email,
      question: question.trim(),
      status: 'OPEN'
    });

    if (!error) {
      setQuestion('');
      fetchDoubts();
    } else {
      alert('Failed to post question. Please contact support if this persists.\n\nError: ' + error.message);
    }
    setSending(false);
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 flex items-center gap-3">
        <MessageCircle className="text-[var(--color-brand)]" />
        Doubt Forum
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">Ask your questions — our instructors will reply directly here.</p>

      {/* Ask a Question */}
      <div className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-strong)] p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Ask a Question</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="What would you like to know?"
            className="flex-1 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none"
          />
          <button
            type="submit"
            disabled={sending || !question.trim()}
            className="px-6 py-4 bg-[var(--color-brand)] text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {sending ? 'Sending...' : <><Send size={18} /> Ask</>}
          </button>
        </form>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading questions...</p>
        ) : doubts.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface-secondary)] rounded-2xl border border-dashed border-[var(--border-strong)]">
            <MessageCircle size={48} className="mx-auto text-[var(--text-secondary)]/30 mb-3" />
            <h3 className="text-[var(--text-primary)] font-bold text-lg">No questions yet</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Be the first to ask!</p>
          </div>
        ) : (
          doubts.map(doubt => (
            <div key={doubt.id} className="bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)] p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-[var(--text-primary)] mr-2">{doubt.user_email?.split('@')[0]}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{new Date(doubt.created_at).toLocaleString()}</span>
                </div>
                {doubt.status === 'RESOLVED' ? (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Answered
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs font-bold rounded-full">Open</span>
                )}
              </div>

              <p className="text-[var(--text-primary)] mb-3">{doubt.question}</p>

              {doubt.answer && (
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg border-l-4 border-[var(--color-brand)]">
                  <span className="text-xs font-bold text-[var(--color-brand)] mb-1 block">Instructor Reply</span>
                  <p className="text-[var(--text-secondary)]">{doubt.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
