import React, { useState, useEffect } from 'react';
import {
  Mail,
  ArrowRight,
  Sparkles,
  Crown,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { AuthUser, ADMIN_EMAIL, AppSettings } from '../types';
import {
  sendEmailLinkLogin,
  completeEmailLinkSignIn
} from '../services/authService';
import { getYoutubeId } from '../utils/urlUtils';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
  currentUser?: AuthUser;
  settings?: AppSettings;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onCancel,
  currentUser,
  settings
}) => {
  const loginMedia = settings?.loginMedia;
  const youtubeId = loginMedia?.youtubeEnabled && loginMedia?.youtubeVideoUrl ? getYoutubeId(loginMedia.youtubeVideoUrl) : null;
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Check if landing with email link sign in
  useEffect(() => {
    completeEmailLinkSignIn().then(user => {
      if (user) {
        onLoginSuccess(user);
      }
    });
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor, informe seu endereço de e-mail.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const res = await sendEmailLinkLogin(email);
    setIsLoading(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: res.message
      });
    } else {
      setMessage({
        type: 'error',
        text: res.message
      });
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setIsLoading(true);
    setMessage(null);

    const res = await sendEmailLinkLogin(quickEmail);
    setIsLoading(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: res.message
      });
    } else {
      setMessage({
        type: 'error',
        text: res.message
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden select-none">
      {/* Background Architectural / Studio Moodboard Overlay */}
      {loginMedia?.youtubeEnabled && youtubeId ? (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&cc_load_policy=0&playsinline=1&loop=1&playlist=${youtubeId}&fs=0&disablekb=1&iv_load_policy=3`}
            className="absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            title="YouTube Background"
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : (
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-25 bg-cover bg-center"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(245, 197, 66, 0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(30, 41, 59, 0.4) 0%, transparent 50%), url('${loginMedia?.backgroundImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80'}')`
          }}
        />
      )}

      {/* Dark Ambient Grid & Blueprint Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Top Back Button if onCancel provided */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-gray-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold">Voltar ao App</span>
        </button>
      )}

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md bg-[#121216]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand / Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] mx-auto shadow-lg shadow-[#F5C542]/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Review Sincero</h1>
          <p className="text-xs text-gray-400">
            Autenticação segura Passwordless via Link de E-mail (Firebase Auth)
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />}
            <span className="leading-relaxed">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#18181c] border border-white/10 text-white placeholder-gray-500 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-extrabold rounded-2xl transition-all shadow-lg shadow-[#F5C542]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Enviando link de acesso...</span>
            ) : (
              <>
                <span>Enviar Link por E-mail</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access / Shortcuts if enabled */}
        {settings?.enableQuickLoginShortcuts !== false && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
              Acesso Rápido para Testes
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin(ADMIN_EMAIL)}
                className="p-2.5 rounded-xl bg-[#1c1c22] border border-[#F5C542]/30 hover:border-[#F5C542] text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5C542]">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Admin Master</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{ADMIN_EMAIL}</p>
              </button>

              <button
                onClick={() => handleQuickLogin('usuario.comum@gmail.com')}
                className="p-2.5 rounded-xl bg-[#1c1c22] border border-blue-500/30 hover:border-blue-500 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <User className="w-3.5 h-3.5" />
                  <span>Usuário Comum</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">usuario.comum@gmail.com</p>
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-[11px] text-gray-500 pt-2">
          Protegido por Firebase Authentication (Email Link Passwordless).
        </div>
      </div>
    </div>
  );
};
