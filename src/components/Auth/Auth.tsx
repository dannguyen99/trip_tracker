import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import authHero from '../../assets/auth_hero.png';
import authPattern from '../../assets/auth_pattern.png';

export function Auth() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        alert(t('auth.check_email'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative bg-slate-900">
      {/* Background Image for Mobile */}
      <div className="absolute inset-0 lg:hidden z-0">
        <img
          src={authHero}
          alt="Travel Adventure"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-900/90"></div>
      </div>

      {/* Left Side - Hero Image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-purple-600/20 z-10"></div>
        <img
          src={authHero}
          alt="Travel Adventure"
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-fade-in"
        />
        <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full pb-24 animate-slide-up">
          <div className="mb-6">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Journey Logo" className="w-20 h-20 rounded-2xl shadow-2xl" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Journey<br />
            <span className="text-sky-400">{t('auth.hero_subtitle')}</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-md leading-relaxed">
            {t('auth.hero_desc')}
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 relative z-20"
        style={{
          // Only apply pattern on desktop where background is solid
          backgroundImage: window.innerWidth >= 1024 ? `url(${authPattern})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: window.innerWidth >= 1024 ? '#f8fafc' : 'transparent'
        }}
      >
        <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 animate-slide-up">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Journey Logo" className="w-12 h-12 rounded-xl shadow-lg" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isSignUp ? t('auth.create_account') : t('auth.welcome_back')}
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              {isSignUp
                ? t('auth.sign_up_desc')
                : t('auth.sign_in_desc')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            <div className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.full_name')}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('auth.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-sky-500/30 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isSignUp ? t('auth.sign_up') : t('auth.sign_in')
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/50 text-slate-500 font-medium rounded-full">
                  {isSignUp ? t('auth.have_account') : t('auth.no_account')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sky-600 hover:text-sky-500 font-bold text-sm transition-colors hover:underline"
              >
                {isSignUp ? t('auth.sign_in_link') : t('auth.create_account_link')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
