/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Upload, Video, Image, Check, X, RefreshCw, ExternalLink } from 'lucide-react';
import { uploadFile } from '@/features/admin/services/apiService';
import apiClient from '@/services/apiClient';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface WorkshopMediaItem {
  id: string;
  sectionKey: string;
  title: string;
  mediaUrl: string | null;
  posterUrl: string | null;
  mediaType: 'video' | 'image';
  altText: string;
  isActive: boolean;
  displayOrder: number;
}

// ─── Section definitions (display order + human labels) ───────────────────────

const MEDIA_SLOTS = [
  { key: 'hero', label: 'Hero', description: 'Background video/image shown in the Hero section at top of the workshop page.' },
  { key: 'program', label: 'Program Highlights', description: 'Program highlights video shown in the Program section.' },
  { key: 'program-step-1', label: 'Step 1: Robot CAD Design', description: 'Video for Robot CAD Design step.' },
  { key: 'program-step-2', label: 'Step 2: RViz with TF', description: 'Video for RViz with TF step.' },
  { key: 'program-step-3', label: 'Step 3: Gazebo Sim', description: 'Video for Gazebo Sim step.' },
  { key: 'program-step-4', label: 'Step 4: Autonomous Docking', description: 'Video for Autonomous Docking step.' },
  { key: 'program-step-5', label: 'Step 5: Web Dashboard', description: 'Video for Web Dashboard step.' },
  { key: 'program-step-6', label: 'Step 6: SLAM Toolbox', description: 'Video for SLAM Toolbox step.' },
  { key: 'program-step-7', label: 'Step 7: Hardware', description: 'Video for Hardware step.' },
  { key: 'kushi', label: 'Kushi Robot', description: 'Video of the Kushi robot used in the Kushi Robot section.' },
  { key: 'curriculum-week-1', label: 'Week 1 — Foundations', description: 'Curriculum Week 1 video.' },
  { key: 'curriculum-week-2', label: 'Week 2 — Build The Robot', description: 'Curriculum Week 2 video.' },
  { key: 'curriculum-week-3', label: 'Week 3 — Autonomy', description: 'Curriculum Week 3 video.' },
  { key: 'curriculum-week-4', label: 'Week 4 — AI & Industrial', description: 'Curriculum Week 4 video.' },
  { key: 'experience-1', label: 'Experience 1: Building', description: 'Workshop experience media — Building.' },
  { key: 'experience-2', label: 'Experience 2: Testing', description: 'Workshop experience media — Testing.' },
  { key: 'experience-3', label: 'Experience 3: Debugging', description: 'Workshop experience media — Debugging.' },
  { key: 'experience-4', label: 'Experience 4: Demonstrating', description: 'Workshop experience media — Demonstrating.' },
];

// ─── API helpers ───────────────────────────────────────────────────────────────

const workshopMediaAdminApi = {
  async getAll(): Promise<WorkshopMediaItem[]> {
    try {
      const res = await apiClient.get<WorkshopMediaItem[]>('/api/admin/workshop-media');
      return res.data;
    } catch {
      return [];
    }
  },
  async upsert(key: string, data: Partial<WorkshopMediaItem>): Promise<WorkshopMediaItem> {
    const res = await apiClient.put<WorkshopMediaItem>(`/api/admin/workshop-media/${key}`, data);
    return res.data;
  },
  async remove(key: string): Promise<void> {
    await apiClient.delete(`/api/admin/workshop-media/${key}`);
  },
};

// ─── Media Card ────────────────────────────────────────────────────────────────

interface MediaCardProps {
  slot: typeof MEDIA_SLOTS[number];
  item: WorkshopMediaItem | undefined;
  onRefresh: () => void;
}

function MediaCard({ slot, item, onRefresh }: MediaCardProps) {
  const [uploading, setUploading] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editUrl, setEditUrl] = useState(item?.mediaUrl ?? '');
  const [editPoster, setEditPoster] = useState(item?.posterUrl ?? '');
  const [editAlt, setEditAlt] = useState(item?.altText ?? '');
  const [editType, setEditType] = useState<'video' | 'image'>(item?.mediaType ?? 'video');
  const fileRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);

  // Sync with fetched data
  useEffect(() => {
    setEditUrl(item?.mediaUrl ?? '');
    setEditPoster(item?.posterUrl ?? '');
    setEditAlt(item?.altText ?? '');
    setEditType(item?.mediaType ?? 'video');
  }, [item]);

  const flash = (type: 'success' | 'error') => {
    setStatus(type);
    setTimeout(() => setStatus('idle'), 2500);
  };

  const handleMediaUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setEditUrl(url);
      setEditType(file.type.startsWith('video') ? 'video' : 'image');
    } catch (error: any) {
      console.error('Upload Error:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
      flash('error');
    } finally {
      setUploading(false);
    }
  };

  const handlePosterUpload = async (file: File) => {
    setPosterUploading(true);
    try {
      const url = await uploadFile(file);
      setEditPoster(url);
    } catch {
      flash('error');
    } finally {
      setPosterUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await workshopMediaAdminApi.upsert(slot.key, {
        mediaUrl: editUrl || undefined,
        posterUrl: editPoster || undefined,
        altText: editAlt,
        mediaType: editType,
        isActive: true,
        title: slot.label,
      });
      flash('success');
      onRefresh();
    } catch {
      flash('error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove media for "${slot.label}"?`)) return;
    setRemoving(true);
    try {
      await workshopMediaAdminApi.remove(slot.key);
      setEditUrl('');
      setEditPoster('');
      flash('success');
      onRefresh();
    } catch {
      flash('error');
    } finally {
      setRemoving(false);
    }
  };

  const hasMedia = !!editUrl;

  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            {editType === 'video' ? (
              <Video size={15} className="text-[var(--color-brand)]" />
            ) : (
              <Image size={15} className="text-[var(--color-brand)]" />
            )}
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">{slot.key}</span>
          </div>
          <h3 className="mt-1 font-bold text-[var(--text-primary)]">{slot.label}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{slot.description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-4">
          {status === 'success' && <span className="flex items-center gap-1 text-green-500 text-xs font-semibold"><Check size={13} /> Saved</span>}
          {status === 'error' && <span className="flex items-center gap-1 text-red-500 text-xs font-semibold"><X size={13} /> Error</span>}
          {hasMedia && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">ACTIVE</span>
          )}
        </div>
      </div>

      {/* Preview */}
      {hasMedia && (
        <div className="px-5 pt-4">
          {editType === 'video' ? (
            <video
              src={editUrl}
              poster={editPoster || undefined}
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-video rounded-lg object-cover bg-black border border-[var(--border-primary)]"
            />
          ) : (
            <img
              src={editUrl}
              alt={editAlt || slot.label}
              className="w-full aspect-video rounded-lg object-cover border border-[var(--border-primary)]"
            />
          )}
        </div>
      )}

      {/* Form */}
      <div className="px-5 py-4 space-y-3">
        {/* Media URL + Upload */}
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Media URL (video or image)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
            />
            <input
              ref={fileRef}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f); e.target.value = ''; }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Poster URL */}
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Poster / Thumbnail (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={editPoster}
              onChange={(e) => setEditPoster(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <input
              ref={posterRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePosterUpload(f); e.target.value = ''; }}
            />
            <button
              onClick={() => posterRef.current?.click()}
              disabled={posterUploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
            >
              {posterUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              {posterUploading ? '…' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Alt text + Type */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Alt / Description</label>
            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Brief description for accessibility"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>
          <div className="w-28 shrink-0">
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">Type</label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value as 'video' | 'image')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
          {hasMedia && (
            <>
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
              >
                <ExternalLink size={13} /> View
              </a>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium transition-colors ml-auto disabled:opacity-50"
              >
                {removing ? <RefreshCw size={13} className="animate-spin" /> : <X size={13} />}
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminWorkshopMedia() {
  const [data, setData] = useState<WorkshopMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = async () => {
    setLoading(true);
    const items = await workshopMediaAdminApi.getAll();
    setData(items);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const getItem = (key: string) => data.find((d) => d.sectionKey === key);
  const activeCount = data.filter((d) => d.mediaUrl && d.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Workshop Media</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage videos and images for each section of the ROS 2 Industry Immersion workshop page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--color-brand)]">{activeCount}</span> / {MEDIA_SLOTS.length} slots active
          </span>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <a
            href="/workshops/ros2-industry-immersion"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
          >
            <ExternalLink size={14} /> View Workshop Page
          </a>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5 px-5 py-4 text-sm text-[var(--text-secondary)]">
        <p className="font-semibold text-[var(--text-primary)] mb-1">How it works</p>
        <p>
          Upload a video or image for each section. Click <strong>Save</strong> and the workshop page will immediately display the new media — no code changes required.
          Use the <strong>Upload</strong> button to upload to Cloudinary, or paste a direct URL.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[var(--text-secondary)]">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-[var(--color-brand)]" />
          Loading media slots…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {MEDIA_SLOTS.map((slot) => (
            <MediaCard
              key={slot.key}
              slot={slot}
              item={getItem(slot.key)}
              onRefresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
