import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Crown,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';
import {
  loginWithEmailAccount,
  loginWithGoogleAccount,
  recordUserInDirectory
} from '../services/authService';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
  currentUser?: AuthUser;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onCancel,
  currentUser
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; role?: string } | null>(null);

  // Live check if the typed email is the Administrator
  const isInputAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase().trim();

  const handleSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const isAdmin = trimmedEmail === ADMIN_EMAIL.toLowerCase().trim();

      const user = loginWithEmailAccount(
        trimmedEmail,
        name.trim() || (isAdmin ? 'Renato Nardin' : undefined)
      );

      // Explicit role notification
      if (isAdmin) {
        setMessage({
          type: 'success',
          text: 'Identificado: Administrador Master! Acesso total concedido.',
          role: 'admin'
        });
      } else {
        setMessage({
          type: 'success',
          text: mode === 'signup'
            ? 'Cadastro realizado! Usuário Comum com acesso às ferramentas gratuitas.'
            : 'Identificado: Usuário Comum! Acesso liberado.',
          role: 'user'
        });
      }

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
      }, 700);
    }, 600);
  };

  const handleGoogleLogin = (customEmail?: string, customName?: string) => {
    setIsLoading(true);
    setMessage(null);

    setTimeout(() => {
      const user = loginWithGoogleAccount(customEmail, customName);
      const isAdmin = user.role === 'admin';

      if (isAdmin) {
        setMessage({
          type: 'success',
          text: 'Login via Google: Administrador Master autenticado.',
          role: 'admin'
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Login via Google: Usuário Comum autenticado.',
          role: 'user'
        });
      }

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
      }, 700);
    }, 500);
  };

  const handleQuickFill = (targetRole: 'admin' | 'user') => {
    if (targetRole === 'admin') {
      setEmail(ADMIN_EMAIL);
      setName('Renato Nardin');
      setPassword('adminMaster@2026');
    } else {
      setEmail('cliente.comum@gmail.com');
      setName('Lucas Silva');
      setPassword('comum123456');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden select-none">
      {/* Background Architectural / Studio Moodboard Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 bg-cover bg-center"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, rgba(245, 197, 66, 0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(30, 41, 59, 0.4) 0%, transparent 50%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      {/* Dark Ambient Grid & Blueprint Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Top Back / Close Button if onCancel provided */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131620]/80 border border-white/10 hover:border-white/20 text-[#A0AEC0] hover:text-white transition-all text-xs font-semibold backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Sistema</span>
        </button>
      )}

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        
        {/* Custom Project Logo: 3D Metallic Shield/Star Emblem (Replacing the FD logo) */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            {/* Ambient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-b from-[#F5C542]/20 via-[#D99A26]/10 to-transparent rounded-3xl blur-xl transition-all group-hover:from-[#F5C542]/35" />
            
            {/* 3D Brushed Metal Emblem */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#2C2F38] via-[#151821] to-[#0D0F16] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center p-1">
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#1E222D] to-[#0A0C11] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Diagonal Metallic Sheen */}
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent transform rotate-45 pointer-events-none" />
                
                {/* Emblem Symbol (Review Sincero Star / Shield) */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5C542] via-[#E2A92E] to-[#B37A17] p-0.5 shadow-lg shadow-[#F5C542]/20 flex items-center justify-center">
                    <div className="w-full h-full bg-[#10131B] rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#F5C542] drop-shadow-[0_2px_8px_rgba(245,197,66,0.6)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <h2 className="text-sm font-extrabold tracking-widest text-white/90 uppercase flex items-center justify-center gap-1.5 font-display">
              <span>Review</span>
              <span className="text-[#F5C542] drop-shadow-[0_0_12px_rgba(245,197,66,0.4)]">Sincero</span>
            </h2>
          </div>
        </div>

        {/* The Frosted Login Card */}
        <div className="w-full bg-[#11141D]/90 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#F5C542]/50 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {mode === 'signin' ? (
                <>
                  Welcome{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] via-[#EAB308] to-[#CA8A04]">
                    Back
                  </span>
                </>
              ) : (
                <>
                  Create{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] via-[#EAB308] to-[#CA8A04]">
                    Account
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1.5">
              {mode === 'signin'
                ? 'Sign in to continue your engineering journey'
                : 'Cadastre-se para acessar as ferramentas e conteúdos'}
            </p>
          </div>

          {/* Status / Role Recognition Feedback Alert */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 ${
                message.type === 'success'
                  ? message.role === 'admin'
                    ? 'bg-[#231A05] border-[#F5C542]/50 text-[#FCD34D]'
                    : 'bg-[#0B2117] border-[#10B981]/50 text-[#6EE7B7]'
                  : 'bg-[#291212] border-[#EF4444]/50 text-[#FCA5A5]'
              }`}
            >
              {message.type === 'success' ? (
                message.role === 'admin' ? (
                  <Crown className="w-4 h-4 text-[#F5C542] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                )
              ) : (
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
              )}
              <span className="font-medium leading-relaxed">{message.text}</span>
            </div>
          )}

          {/* Live Admin Recognition Indicator (while typing) */}
          {email && (
            <div className="mb-4">
              {isInputAdmin ? (
                <div className="p-2.5 rounded-xl bg-[#211A06] border border-[#F5C542]/40 flex items-center justify-between text-[11px] text-[#F5C542]">
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-[#F5C542]" />
                    <span className="font-bold">E-mail Administrativo Detectado</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#F5C542] text-black font-extrabold text-[9px] uppercase">
                    Admin Master
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#131B2A] border border-[#3B82F6]/30 flex items-center justify-between text-[11px] text-[#93C5FD]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#60A5FA]" />
                    <span>Perfil de Usuário Comum</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD] font-bold text-[9px] uppercase">
                    Acesso Gratuito
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (Only in Sign Up mode) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#CBD5E1] block">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181C26] border border-white/10 rounded-2xl pl-13 pr-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 focus:bg-[#1A1F2C] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#CBD5E1] block">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181C26] border border-white/10 rounded-2xl pl-13 pr-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 focus:bg-[#1A1F2C] transition-all font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#CBD5E1] block">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#181C26] border border-white/10 rounded-2xl pl-13 pr-11 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 focus:bg-[#1A1F2C] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#64748B] hover:text-white transition-colors cursor-pointer p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            {mode === 'signin' && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMessage({
                      type: 'info',
                      text: 'Para redefinir a senha do Administrador, use a chave master ou login via Google.'
                    });
                  }}
                  className="text-[11px] text-[#94A3B8] hover:text-[#F5C542] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Main Gradient Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-2xl py-3.5 px-6 font-semibold text-sm text-white transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer mt-2 disabled:opacity-60"
            >
              {/* Golden metallic gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#241E15] via-[#7F612B] to-[#C79A45] group-hover:from-[#2F271B] group-hover:via-[#997635] group-hover:to-[#DBAA4E] transition-all duration-300" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center gap-2 text-[#FFF7ED]">
                <span>{isLoading ? 'Processando...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          {/* Social / Divider */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#11141D] text-[11px] text-[#64748B]">
                or continue with
              </span>
            </div>

            {/* 3 Social Buttons as shown in the design */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleLogin(ADMIN_EMAIL, 'Renato Nardin')}
                disabled={isLoading}
                title="Entrar com Google (Admin Master)"
                className="h-12 rounded-2xl bg-[#181C26] border border-white/10 hover:border-white/20 hover:bg-[#1F2432] flex items-center justify-center transition-all cursor-pointer group"
              >
                {/* SVG Google 4 colors logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.5 0 12.8s.6 4.5 1.6 6.4l3.7-2.9c0-.6 0-1 0-1.6z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"
                  />
                </svg>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => handleGoogleLogin('usuario.github@gmail.com', 'GitHub User')}
                disabled={isLoading}
                title="Entrar com GitHub (Usuário Comum)"
                className="h-12 rounded-2xl bg-[#181C26] border border-white/10 hover:border-white/20 hover:bg-[#1F2432] flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button>

              {/* LinkedIn / Admin 1-Click Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                title="Preencher credenciais de Administrador Master"
                className="h-12 rounded-2xl bg-[#181C26] border border-white/10 hover:border-[#0A66C2]/40 hover:bg-[#1F2432] flex items-center justify-center transition-all cursor-pointer text-[#0A66C2] font-bold text-sm"
              >
                <span className="font-extrabold text-base tracking-tighter">in</span>
              </button>
            </div>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-[#94A3B8]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setMessage(null);
                  }}
                  className="font-semibold text-[#F5C542] hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#94A3B8]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setMessage(null);
                  }}
                  className="font-semibold text-[#F5C542] hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Quick Demo Credentials Footer Helper for Testing */}
        <div className="mt-6 w-full max-w-sm p-3.5 rounded-2xl bg-[#0D1017]/80 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#F5C542]" />
              <span>Atalhos de Teste Rápido:</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2.5 py-1.5 rounded-xl bg-[#1C1809] border border-[#F5C542]/30 hover:border-[#F5C542] text-[10px] font-bold text-[#F5C542] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>Preencher Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="px-2.5 py-1.5 rounded-xl bg-[#131B2A] border border-[#3B82F6]/30 hover:border-[#3B82F6] text-[10px] font-bold text-[#93C5FD] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span>Preencher Comum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
