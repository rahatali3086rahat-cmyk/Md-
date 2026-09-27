import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../services/api/authApi';
import { MailCheck, CheckCircle2, RotateCw, ArrowRight } from 'lucide-react';

export const VerifyEmailView: React.FC = () => {
  const { setCurrentView, addToast, currentUser } = useApp();

  const [code, setCode] = useState('749215');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyEmail(code);
      setVerified(true);
      addToast('success', 'Email Verified', 'Your business account is verified and fully operational.');
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 700);
    } catch (err: any) {
      addToast('error', 'Verification Failed', err?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    addToast('info', 'Code Resent', 'A fresh 6-digit confirmation code has been dispatched.');
  };

  return (
    <AuthLayout
      title="Verify Business Email"
      subtitle="We sent a 6-digit verification code to your email address to confirm ownership"
      badgeText="Identity Confirmation"
    >
      {verified ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Account Confirmed</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your ScaleUp Gulf AI workspace is initialized. Proceed to connect WhatsApp and test your AI agent.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
          >
            <span>Enter Client Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="text-center pb-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/80 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <MailCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300">
              Enter the security code sent to{' '}
              <span className="text-emerald-400 font-semibold">{currentUser?.email || 'your business email'}</span>
            </p>
          </div>

          <div>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="749215"
              className="w-full py-3 px-4 text-center text-xl tracking-[0.5em] font-mono font-bold bg-slate-950/80 border border-slate-700/80 rounded-xl text-emerald-400 placeholder-slate-600 focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirm & Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('dashboard');
              addToast('info', 'Workspace Ready', 'Directly accessing your business dashboard.');
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/60 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Skip Verification & Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={handleResend}
              className="hover:text-emerald-400 flex items-center gap-1 font-semibold"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Resend Code</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="hover:text-white font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
