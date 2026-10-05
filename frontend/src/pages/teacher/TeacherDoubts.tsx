import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Doubt = {
  id: string;
  question: string;
  user_email: string;
  status: string;
  answer: string | null;
  created_at: string;
};

type FilterTab = 'open' | 'answered' | 'all';

export default function TeacherDoubts() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('open');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const fetchDoubts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Doubt')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setDoubts(data as Doubt[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const filteredDoubts = doubts.filter((d) => {
    if (tab === 'open') return d.status !== 'RESOLVED';
    if (tab === 'answered') return d.status === 'RESOLVED';
    return true;
  });

  const handleReply = async (doubtId: string) => {
    const answer = replies[doubtId]?.trim();
    if (!answer) return;
    setSubmitting((prev) => ({ ...prev, [doubtId]: true }));
    const { error } = await supabase
      .from('Doubt')
      .update({ answer, status: 'RESOLVED' })
      .eq('id', doubtId);
    if (!error) {
      setDoubts((prev) =>
        prev.map((d) =>
          d.id === doubtId ? { ...d, answer, status: 'RESOLVED' } : d
        )
      );
      setReplies((prev) => ({ ...prev, [doubtId]: '' }));
    }
    setSubmitting((prev) => ({ ...prev, [doubtId]: false }));
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const getEmailPrefix = (email: string) => email.split('@')[0];

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'open', label: 'Open Questions' },
    { key: 'answered', label: 'Answered' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Doubt Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage and respond to student questions
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg mb-6 w-fit"
        style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-strong)' }}
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key
                ? 'text-[var(--color-brand)] bg-[var(--color-brand)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--color-brand)' }}
          />
        </div>
      ) : filteredDoubts.length === 0 ? (
        <div
          className="text-center py-20 rounded-xl border"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-secondary)',
          }}
        >
          <p className="text-lg font-medium">No doubts here</p>
          <p className="text-sm mt-1">
            {tab === 'open' ? 'All questions have been answered!' : 'Nothing to show.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => {
            const isResolved = doubt.status === 'RESOLVED';
            return (
              <div
                key={doubt.id}
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  borderColor: 'var(--border-strong)',
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold leading-relaxed"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {doubt.question}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isResolved
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-yellow-500/15 text-yellow-400'
                    }`}
                  >
                    {isResolved ? 'Resolved' : 'Open'}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <span>👤 {getEmailPrefix(doubt.user_email)}</span>
                  <span>•</span>
                  <span>🕒 {formatDate(doubt.created_at)}</span>
                </div>

                {/* Reply area */}
                {isResolved ? (
                  <div
                    className="pl-4 py-3 pr-4 rounded-r-lg text-sm"
                    style={{
                      borderLeft: '3px solid #22c55e',
                      backgroundColor: 'rgba(34,197,94,0.07)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <p className="text-xs font-semibold text-green-400 mb-1">Your Reply</p>
                    <p>{doubt.answer}</p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replies[doubt.id] ?? ''}
                      onChange={(e) =>
                        setReplies((prev) => ({ ...prev, [doubt.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(doubt.id);
                        }
                      }}
                      className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-primary)',
                      }}
                      disabled={submitting[doubt.id]}
                    />
                    <button
                      onClick={() => handleReply(doubt.id)}
                      disabled={submitting[doubt.id] || !replies[doubt.id]?.trim()}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--color-brand)',
                        color: '#fff',
                      }}
                    >
                      {submitting[doubt.id] ? 'Sending…' : 'Send Reply'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
