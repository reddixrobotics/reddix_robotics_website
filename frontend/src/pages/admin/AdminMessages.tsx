/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, useMemo } from 'react';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import type { ContactMessageData } from '@/features/admin/services/apiService';
import { contactMessageService } from '@/features/admin/services/apiService';
import { Search, Inbox, Calendar, Trash2, Reply, ChevronRight } from 'lucide-react';

export default function AdminMessages() {
  const [data, setData] = useState<ContactMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ContactMessageData | null>(null);
  
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ContactMessageData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await contactMessageService.getAll();
      setData(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    let unread = 0;
    let read = 0;
    let todayCount = 0;

    data.forEach(msg => {
      if (msg.status === 'NEW') unread++;
      else read++;

      if (new Date(msg.createdAt).toDateString() === today) todayCount++;
    });

    return { total: data.length, unread, read, today: todayCount };
  }, [data]);

  const [subjectFilter, setSubjectFilter] = useState('ALL');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Status filter
      if (filter === 'UNREAD' && item.status !== 'NEW') return false;
      if (filter === 'READ' && item.status === 'NEW') return false;

      // Subject filter
      if (subjectFilter !== 'ALL' && item.subject !== subjectFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(query);
        const emailMatch = item.email.toLowerCase().includes(query);
        const subjectMatch = item.subject.toLowerCase().includes(query);
        const msgMatch = item.message.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch && !subjectMatch && !msgMatch) return false;
      }

      return true;
    });
  }, [data, filter, searchQuery, subjectFilter]);

  const openView = async (item: ContactMessageData) => {
    setViewingItem(item);
    setIsModalOpen(true);
    setIsReplyOpen(false);
    setReplyMessage('');
    
    // Mark as read if it's NEW
    if (item.status === 'NEW') {
      try {
        await contactMessageService.updateStatus(item.id, 'READ');
        void loadData(); // Refresh to update badge and list
      } catch (err) {
        console.error('Failed to mark message as read', err);
      }
    }
  };


  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setIsDeleting(true);
    try {
      await contactMessageService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      void loadData();
    } catch (e: unknown) {
      alert((e as Error).message || 'Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = async () => {
    if (!viewingItem?.id || !replyMessage.trim()) return;
    setIsReplying(true);
    try {
      await contactMessageService.reply(viewingItem.id, replyMessage);
      setIsReplyOpen(false);
      setReplyMessage('');
      alert('Reply sent successfully!');
      void loadData(); // Refresh to get RESPONDED status
    } catch (e: unknown) {
      alert((e as Error).message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-content mb-1">Messages</h1>
          <p className="text-sm text-content-secondary">Manage and respond to messages received from website visitors.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card p-4 rounded-xl border border-[var(--border-strong)] flex flex-col justify-center">
          <div className="text-content-secondary text-sm font-medium mb-1">Total Messages</div>
          <div className="text-2xl font-black text-content">{stats.total}</div>
        </div>
        <div className="bg-surface-card p-4 rounded-xl border border-[var(--border-strong)] flex flex-col justify-center">
          <div className="text-content-secondary text-sm font-medium mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Unread
          </div>
          <div className="text-2xl font-black text-content">{stats.unread}</div>
        </div>
        <div className="bg-surface-card p-4 rounded-xl border border-[var(--border-strong)] flex flex-col justify-center">
          <div className="text-content-secondary text-sm font-medium mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Read
          </div>
          <div className="text-2xl font-black text-content">{stats.read}</div>
        </div>
        <div className="bg-surface-card p-4 rounded-xl border border-[var(--border-strong)] flex flex-col justify-center">
          <div className="text-content-secondary text-sm font-medium mb-1 flex items-center gap-2">
            <Calendar size={14} /> Today
          </div>
          <div className="text-2xl font-black text-content">{stats.today}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 max-w-xl w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-surface-secondary border border-[var(--border-strong)] rounded-lg pl-10 pr-4 py-2 text-sm text-content focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); }}
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => { setSubjectFilter(e.target.value); }}
            className="bg-surface-secondary border border-[var(--border-strong)] rounded-lg px-4 py-2 text-sm text-content focus:outline-none focus:border-[var(--color-brand)] transition-colors min-w-[160px]"
          >
            <option value="ALL">All Subjects</option>
            <option value="sales">Sales & Enterprise Solutions</option>
            <option value="support">Technical Support</option>
            <option value="partnerships">Partnerships</option>
            <option value="media">Media & Press</option>
            <option value="other">Other Inquiry</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setFilter('ALL'); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'ALL' ? 'bg-[var(--color-brand)] text-white' : 'bg-surface-secondary text-content-secondary hover:text-content hover:bg-surface-tertiary border border-[var(--border-strong)]'}`}
          >
            All
          </button>
          <button 
            onClick={() => { setFilter('UNREAD'); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'UNREAD' ? 'bg-[var(--color-brand)] text-white' : 'bg-surface-secondary text-content-secondary hover:text-content hover:bg-surface-tertiary border border-[var(--border-strong)]'}`}
          >
            Unread
          </button>
          <button 
            onClick={() => { setFilter('READ'); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'READ' ? 'bg-[var(--color-brand)] text-white' : 'bg-surface-secondary text-content-secondary hover:text-content hover:bg-surface-tertiary border border-[var(--border-strong)]'}`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-surface-card rounded-xl border border-[var(--border-strong)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-content-tertiary">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)] animate-spin mb-4" />
            Loading messages...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4 text-content-tertiary">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-bold text-content mb-1">No messages found</h3>
            <p className="text-content-secondary text-sm max-w-sm">
              {searchQuery || filter !== 'ALL' 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "Messages submitted through the Contact Us form will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-strong)]">
            {filteredData.map(msg => {
              const isUnread = msg.status === 'NEW';
              const subjectMap: Record<string, string> = {
                sales: 'Sales & Enterprise Solutions',
                support: 'Technical Support',
                partnerships: 'Partnerships',
                media: 'Media & Press',
                other: 'Other Inquiry'
              };
              const displaySubject = subjectMap[msg.subject] || msg.subject;

              return (
                <div 
                  key={msg.id} 
                  className={`p-4 md:p-5 hover:bg-surface-secondary transition-colors cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${isUnread ? 'bg-red-500/5' : ''}`}
                  onClick={() => { void openView(msg); }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {isUnread && <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" title="Unread"></span>}
                      <h4 className={`font-bold truncate ${isUnread ? 'text-content' : 'text-content-secondary'}`}>
                        {msg.name}
                      </h4>
                      <span className="text-xs text-content-tertiary font-medium px-2 py-0.5 rounded-full bg-surface-tertiary">
                        {msg.email}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-content truncate mb-1">
                      {displaySubject}
                    </div>
                    <div className="text-sm text-content-tertiary truncate">
                      {msg.message}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 flex-shrink-0">
                    <div className="text-xs font-medium text-content-tertiary whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })},{' '}
                      {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button 
                      className="text-xs font-bold text-[var(--color-brand)] flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title="Message Details"
      >
        {viewingItem && (
          <div className="space-y-6 p-2">
            <div className="bg-surface-secondary rounded-lg p-4 border border-[var(--border-strong)]">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-[var(--border-strong)]">
                <div>
                  <h3 className="text-lg font-bold text-content">{viewingItem.name}</h3>
                  <a href={`mailto:${viewingItem.email}`} className="text-[var(--color-brand)] hover:underline text-sm font-medium">
                    {viewingItem.email}
                  </a>
                  {viewingItem.phone && (
                    <div className="text-sm text-content-secondary mt-1">{viewingItem.phone}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-1">Received</div>
                  <div className="text-sm text-content font-medium">
                    {new Date(viewingItem.createdAt).toLocaleString('en-US')}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Subject</div>
                <div className="text-md font-bold text-content mb-4">
                  {{
                    sales: 'Sales & Enterprise Solutions',
                    support: 'Technical Support',
                    partnerships: 'Partnerships',
                    media: 'Media & Press',
                    other: 'Other Inquiry'
                  }[viewingItem.subject] || viewingItem.subject}
                </div>
                
                <div className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Message</div>
                <div className="text-sm text-content whitespace-pre-wrap leading-relaxed">
                  {viewingItem.message}
                </div>
              </div>
            </div>

            {isReplyOpen ? (
              <div className="bg-surface-secondary rounded-lg border border-[var(--border-strong)] overflow-hidden">
                <div className="bg-surface-tertiary px-4 py-2 border-b border-[var(--border-strong)] flex justify-between items-center">
                  <span className="text-sm font-bold text-content flex items-center gap-2">
                    <Reply size={14} /> Reply to {viewingItem.name}
                  </span>
                  <button onClick={() => { setIsReplyOpen(false); }} className="text-xs text-content-secondary hover:text-content font-medium">
                    Cancel
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <div className="text-xs text-content-tertiary mb-1">To:</div>
                    <div className="text-sm font-medium text-content">{viewingItem.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-content-tertiary mb-1">Subject:</div>
                    <div className="text-sm font-medium text-content">
                      Re: {{
                        sales: 'Sales & Enterprise Solutions',
                        support: 'Technical Support',
                        partnerships: 'Partnerships',
                        media: 'Media & Press',
                        other: 'Other Inquiry'
                      }[viewingItem.subject] || viewingItem.subject}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => { setReplyMessage(e.target.value); }}
                      placeholder="Write your reply here..."
                      className="w-full bg-surface-primary border border-[var(--border-strong)] rounded-lg p-3 text-sm text-content focus:outline-none focus:border-[var(--color-brand)] min-h-[120px] resize-y"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => { void handleReply(); }}
                      disabled={isReplying || !replyMessage.trim()}
                      className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isReplying ? (
                        <>Sending...</>
                      ) : (
                        <>Send Reply</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setIsReplyOpen(true); }}
                  className="bg-surface-secondary hover:bg-surface-tertiary border border-[var(--border-strong)] text-content px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Reply size={16} /> Reply
                </button>
                <button
                  onClick={() => {
                    setDeletingItem(viewingItem);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); }}
        onConfirm={() => { void handleDelete(); }}
        itemName="this message"
        isDeleting={isDeleting}
      />
    </div>
  );
}
