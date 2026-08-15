import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Laptop,
  Trash2,
  Key,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  X,
  QrCode,
  Lock,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionInfo {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

interface AdminProfile {
  id: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

type SetupStep = 'idle' | 'qr' | 'verify' | 'backup-codes';
type FeedbackType = 'success' | 'error' | 'warning';

interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

import { FeedbackAlert } from '@/features/auth/components/TwoFASetupWizard';




// ─── 2FA Disable Modal ────────────────────────────────────────────────────────

function TwoFADisablePanel({
  onDisabled,
  onCancel,
}: {
  onDisabled: () => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Please enter a verification code or backup code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/api/admin/security/2fa/disable', { code });
      onDisabled();
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDisable} className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
          <ShieldOff size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Disable Two-Factor Authentication</h3>
          <p className="text-sm text-zinc-400">
            Enter your current 6-digit authenticator code or one of your 8-character backup codes to confirm. 
            This will remove 2FA protection from your account.
          </p>
        </div>
      </div>

      <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-lg">
        <p className="text-xs text-red-400 font-medium flex items-center gap-2">
          <AlertTriangle size={14} />
          Disabling 2FA significantly reduces your account security.
        </p>
      </div>

      {error && <FeedbackAlert message={{ type: 'error', text: error }} onDismiss={() => setError('')} />}

      <div>
        <label htmlFor="disable-2fa-code" className="block text-sm font-medium text-zinc-300 mb-2">
          Authenticator Code or Backup Code
        </label>
        <input
          id="disable-2fa-code"
          type="text"
          placeholder="6-digit code or 8-char backup code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
          disabled={loading}
          autoComplete="one-time-code"
          className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-center font-mono text-white tracking-widest focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50 placeholder:text-zinc-700 placeholder:tracking-normal placeholder:text-sm"
          required
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading || !code}
          className="flex-1 bg-red-700 hover:bg-red-600 border-red-600"
          id="btn-confirm-disable-2fa"
        >
          {loading ? (
            <><Loader2 className="animate-spin mr-2" size={16} /> Disabling...</>
          ) : (
            <><ShieldOff size={16} className="mr-2" /> Disable 2FA</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-zinc-700 text-zinc-400 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Regenerate Backup Codes Panel ────────────────────────────────────────────

function RegenerateCodesPanel({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState('');
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your admin password to confirm.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post<{ backupCodes: string[] }>(
        '/api/admin/security/backup-codes/regenerate',
        { password },
      );
      setNewCodes(res.data.backupCodes);
    } catch (err: any) {
      setError(err.message || 'Incorrect password. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const copyNewCodes = () => {
    navigator.clipboard.writeText(newCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  if (newCodes.length > 0) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-emerald-400 font-medium">New backup codes generated. Your old codes are now invalid.</p>
        </div>
        <div className="p-3 bg-yellow-950/30 border border-yellow-800/40 rounded-lg">
          <p className="text-xs text-yellow-400 font-medium flex items-center gap-2">
            <AlertTriangle size={14} />
            Save these codes now — they won't be shown again.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4 bg-black/50 border border-zinc-800 rounded-lg font-mono text-sm">
          {newCodes.map((code, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="text-zinc-600 text-xs w-4 text-right">{i + 1}.</span>
              <span className="text-zinc-300 tracking-wider">{code}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={copyNewCodes} className="flex-1 border-zinc-700 text-zinc-300">
            {copiedCodes ? <><CheckCircle size={16} className="mr-2 text-emerald-400" /> Copied!</> : <><Copy size={16} className="mr-2" /> Copy All</>}
          </Button>
          <Button onClick={onDone} className="flex-1" id="btn-regen-codes-done">
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegenerate} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Regenerate Backup Codes</h3>
        <p className="text-sm text-zinc-400">
          This will invalidate your existing 10 backup codes and generate 10 new ones.
          Enter your current admin password to confirm.
        </p>
      </div>
      {error && <FeedbackAlert message={{ type: 'error', text: error }} onDismiss={() => setError('')} />}
      <div>
        <label htmlFor="regen-password" className="block text-sm font-medium text-zinc-300 mb-2">Admin Password</label>
        <input
          id="regen-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50"
          required
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !password} className="flex-1" id="btn-confirm-regen-codes">
          {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Regenerating...</> : <><RefreshCw size={16} className="mr-2" /> Generate New Codes</>}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="border-zinc-700 text-zinc-400 hover:text-white">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main AdminSettings Component ─────────────────────────────────────────────

type ActivePanel = null | 'setup-2fa' | 'disable-2fa' | 'regen-codes';

export default function AdminSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsRes, profileRes] = await Promise.all([
        apiClient.get<SessionInfo[]>('/api/admin/security/sessions'),
        apiClient.get<AdminProfile>('/api/auth/profile'),
      ]);
      setSessions(sessionsRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Failed to load security settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTerminateSession = async (sessionId: string) => {
    setActionLoading(sessionId);
    setFeedback(null);
    try {
      await apiClient.delete(`/api/admin/security/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setFeedback({ type: 'success', text: 'Session terminated successfully.' });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to terminate session.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleTwoFAEnabled = async () => {
    setActivePanel(null);
    setFeedback({ type: 'success', text: 'Two-factor authentication has been enabled successfully.' });
    await fetchData();
  };

  const handleTwoFADisabled = async () => {
    setActivePanel(null);
    setFeedback({ type: 'warning', text: 'Two-factor authentication has been disabled. Your account is less secure.' });
    await fetchData();
  };

  const handleRegenDone = () => {
    setActivePanel(null);
    setFeedback({ type: 'success', text: 'Backup codes have been regenerated. Your old codes are now invalid.' });
  };

  const twoFactorEnabled = profile?.twoFactorEnabled ?? false;

  return (
    <div className="space-y-8 font-mono text-zinc-300">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Security Settings</h1>
        <p className="text-sm text-zinc-400">
          Manage two-factor authentication and your active administrative sessions.
        </p>
      </div>

      {feedback && (
        <FeedbackAlert message={feedback} onDismiss={() => setFeedback(null)} />
      )}

      {/* ── Two-Factor Authentication ────────────────────────────────────── */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${
              twoFactorEnabled
                ? 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400'
                : 'bg-red-950/50 border-red-900/50 text-red-500'
            }`}
          >
            {twoFactorEnabled ? <ShieldCheck size={24} /> : <Shield size={24} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-white">Two-Factor Authentication (2FA)</h2>
              {loading ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-zinc-800 text-zinc-500 border border-zinc-700 uppercase">
                  Loading...
                </span>
              ) : twoFactorEnabled ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase">
                  Disabled
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400">
              {twoFactorEnabled
                ? 'Your account is protected with a time-based one-time passcode (TOTP). You need your authenticator app to log in.'
                : 'Your account is not protected by 2FA. Enable it to add a critical layer of security to your admin account.'}
            </p>
          </div>
        </div>

        {/* Inline panels */}
        {activePanel === 'disable-2fa' && (
          <div className="border-t border-zinc-800 pt-6">
            <TwoFADisablePanel
              onDisabled={handleTwoFADisabled}
              onCancel={() => setActivePanel(null)}
            />
          </div>
        )}

        {activePanel === 'regen-codes' && (
          <div className="border-t border-zinc-800 pt-6">
            <RegenerateCodesPanel
              onDone={handleRegenDone}
              onCancel={() => setActivePanel(null)}
            />
          </div>
        )}

        {/* Action buttons — hidden when a panel is open */}
        {activePanel === null && !loading && (
          <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-4">
            {!twoFactorEnabled ? (
              <div className="text-sm text-zinc-500 italic">2FA is disabled. It will be set up upon your next login.</div>
            ) : (
              <>
                <Button
                  id="btn-regen-backup-codes"
                  variant="outline"
                  onClick={() => setActivePanel('regen-codes')}
                  className="border-zinc-700 text-zinc-300 hover:text-white flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Regenerate Backup Codes
                </Button>
                <Button
                  id="btn-disable-2fa"
                  variant="outline"
                  onClick={() => setActivePanel('disable-2fa')}
                  className="border-red-900/50 text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <ShieldOff size={16} />
                  Disable 2FA
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Active Sessions ──────────────────────────────────────────────── */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-red-500" />
            Active Administrative Sessions
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            These devices are currently logged into your admin account. Terminate any session you don't recognise.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-6 text-zinc-500 flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" /> Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-6 text-zinc-500">No active sessions found.</div>
        ) : (
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden bg-black/35">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <Laptop className="text-zinc-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-zinc-200">
                        {session.ipAddress || 'Unknown IP'}
                      </span>
                      {session.isCurrent && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 rounded uppercase font-bold">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">
                      {session.userAgent || 'Unknown Device / User Agent'}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      Started: {new Date(session.createdAt).toLocaleString()} ·{' '}
                      Expires: {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-950/50 hover:bg-red-500/10 h-8 self-start md:self-auto flex items-center gap-1.5"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={actionLoading === session.id}
                  id={`btn-terminate-session-${session.id}`}
                >
                  {actionLoading === session.id ? (
                    <><Loader2 size={14} className="animate-spin" /> Terminating...</>
                  ) : (
                    <><Trash2 size={14} /> Terminate</>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Account Info ─────────────────────────────────────────────────── */}
      {profile && (
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Lock size={18} className="text-red-500" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-3 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Admin Email</p>
              <p className="text-sm text-zinc-200 font-medium">{profile.email}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Role</p>
              <p className="text-sm text-zinc-200 font-medium">{profile.role.replace(/_/g, ' ')}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">2FA Status</p>
              <p className={`text-sm font-bold ${twoFactorEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                {twoFactorEnabled ? 'Enabled ✓' : 'Disabled — Enable for security!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
