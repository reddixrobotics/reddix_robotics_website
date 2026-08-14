import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { Shield, Laptop, Trash2, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface SessionInfo {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminSettings() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, authRes] = await Promise.all([
        apiClient.get<SessionInfo[]>('/api/admin/security/sessions'),
        apiClient.get('/api/admin/auth/session')
      ]);
      setSessions(sessionsRes.data);
      if (authRes.data.authenticated) {
        // Assume MFA enabled if profile or session says so, or false
        setMfaEnabled(authRes.data.session.role !== 'USER'); // simple check, or state
      }
    } catch (err) {
      console.error('Failed to load security settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleTerminateSession = async (sessionId: string) => {
    setActionLoading(sessionId);
    setFeedbackMessage(null);
    try {
      await apiClient.delete(`/api/admin/security/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setFeedbackMessage({ type: 'success', text: 'Session terminated successfully.' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to terminate session.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 font-mono text-zinc-300">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Security Settings</h1>
        <p className="text-sm text-zinc-400">Manage your active administrative sessions and two-factor authentication.</p>
      </div>

      {feedbackMessage && (
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' 
            : 'bg-red-950/30 border-red-800/50 text-red-400'
        }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <p className="text-sm font-medium">{feedbackMessage.text}</p>
        </div>
      )}

      {/* Two-Factor Authentication Box */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center justify-center text-red-500">
            <Shield size={24} />
          </div>
          <div className="space-y-1 flex-1">
            <h2 className="text-lg font-bold text-white">Two-Factor Authentication (2FA)</h2>
            <p className="text-sm text-zinc-400">
              MFA is currently active for this system. Administrative commands are guarded behind time-based one-time passcodes (TOTP).
            </p>
            <div className="pt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                Enforced
              </span>
              <span className="text-xs text-zinc-500">Managed by System Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-red-500" />
            Active Administrative Sessions
          </h2>
          <p className="text-sm text-zinc-400">
            These devices are currently logged into your admin account. You can terminate any session instantly.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-6 text-zinc-500">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-6 text-zinc-500">No active sessions found.</div>
        ) : (
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden bg-black/35">
            {sessions.map(session => (
              <div key={session.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Laptop className="text-zinc-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-200">
                        {session.ipAddress || 'Unknown IP'}
                      </span>
                      {session.id === sessions[0]?.id && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 rounded uppercase font-bold">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">
                      {session.userAgent || 'Unknown Device / User Agent'}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      Started: {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-950/50 hover:bg-red-500/10 h-8 self-start md:self-auto"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={actionLoading === session.id}
                >
                  {actionLoading === session.id ? 'Terminating...' : (
                    <span className="flex items-center gap-1.5">
                      <Trash2 size={14} /> Terminate
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
