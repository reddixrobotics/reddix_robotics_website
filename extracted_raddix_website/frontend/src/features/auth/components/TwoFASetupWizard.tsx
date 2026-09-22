import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  X,
  QrCode,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui';

type SetupStep = 'idle' | 'qr' | 'verify' | 'success';
type FeedbackType = 'success' | 'error' | 'warning';

interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

export function FeedbackAlert({ message, onDismiss }: { message: FeedbackMessage; onDismiss?: () => void }) {
  const styles: Record<FeedbackType, string> = {
    success: 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400',
    error: 'bg-red-950/30 border-red-800/50 text-red-400',
    warning: 'bg-yellow-950/30 border-yellow-800/50 text-yellow-400',
  };
  const icons: Record<FeedbackType, React.ReactNode> = {
    success: <CheckCircle size={18} />,
    error: <AlertTriangle size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 border ${styles[message.type]}`}>
      <span className="flex-shrink-0 mt-0.5">{icons[message.type]}</span>
      <p className="text-sm font-medium flex-1">{message.text}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function TwoFASetupWizard({
  onEnabled,
  onCancel,
}: {
  onEnabled: () => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState<SetupStep>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Automatically start setup when component mounts if not already started
    startSetup();
  }, []);

  const startSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post<{ secret: string; qrCodeUrl: string }>(
        '/api/admin/security/2fa/setup',
      );
      setQrCodeUrl(res.data.qrCodeUrl);
      setSecret(res.data.secret);
      setStep('qr');
    } catch (err: any) {
      setError(err.message || 'Failed to start 2FA setup. Please try again.');
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length !== 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post(
        '/api/admin/security/2fa/verify',
        { token: verifyCode },
      );
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please check your authenticator app and try again.');
      setVerifyCode('');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'idle') {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-950/50 border border-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-500 flex-shrink-0">
            <QrCode size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Set Up Two-Factor Authentication</h3>
            <p className="text-sm text-zinc-400">
              Initializing 2FA setup...
            </p>
          </div>
        </div>

        {error && <FeedbackAlert message={{ type: 'error', text: error }} onDismiss={() => setError('')} />}

        {error && (
          <div className="flex gap-3">
            <Button
              id="btn-retry-2fa-setup"
              onClick={startSetup}
              disabled={loading}
              className="flex-1"
            >
              <RefreshCw size={16} className="mr-2" /> Retry Setup
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="border-zinc-700 text-zinc-400 hover:text-white">
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (step === 'qr') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Set up Microsoft Authenticator</h3>
          <p className="text-sm text-zinc-400">
            Scan this QR code using Microsoft Authenticator or Google Authenticator to protect your account.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl inline-block">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        </div>

        {/* Manual entry fallback */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest font-bold">Can't scan? Enter this key manually:</p>
          <div className="flex items-center gap-3">
            <code className="text-sm font-mono text-zinc-300 tracking-widest break-all flex-1">{secret}</code>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(secret); }}
              className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
              title="Copy secret key"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            id="btn-2fa-qr-next"
            onClick={() => setStep('verify')}
            className="flex-1"
          >
            Next — Enter Code <ChevronRight size={16} className="ml-1" />
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="border-zinc-700 text-zinc-400 hover:text-white">
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <form onSubmit={verifyAndActivate} className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Verify & Continue</h3>
          <p className="text-sm text-zinc-400">
            Enter the 6-digit code shown in the app.
          </p>
        </div>

        {error && <FeedbackAlert message={{ type: 'error', text: error }} onDismiss={() => setError('')} />}

        <div>
          <input
            id="totp-verify-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={6}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={loading}
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-mono text-white tracking-[0.5em] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50 placeholder:text-zinc-700 placeholder:tracking-normal"
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || verifyCode.length < 6} className="flex-1" id="btn-2fa-verify-submit">
            {loading ? (
              <><Loader2 className="animate-spin mr-2" size={16} /> Verifying...</>
            ) : (
              <><ShieldCheck size={16} className="mr-2" /> Verify & Continue</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('qr')}
            disabled={loading}
            className="border-zinc-700 text-zinc-400 hover:text-white"
          >
            Back
          </Button>
        </div>
      </form>
    );
  }

  // success
  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-lg flex items-start gap-3">
        <ShieldCheck className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-emerald-400">Two-Factor Authentication Setup Complete!</p>
          <p className="text-xs text-emerald-600 mt-1">
            You'll be asked for a code from your authenticator app on every login.
          </p>
        </div>
      </div>

      <Button
        type="button"
        id="btn-2fa-setup-done"
        onClick={onEnabled}
        className="w-full"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
