import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import profileHeader from '../../assets/profile_header.png';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, language, currency')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.warn(error);
      } else if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
        if (data.language) setLanguage(data.language as 'en' | 'vi');
        if (data.currency) setCurrency(data.currency);
      }
    } catch (error) {
      console.error('Error loading user data!', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        });

      if (error) throw error;
      alert(t('profile.profile_updated'));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newLang?: string, newCurr?: string) => {
    try {
      const updates: any = {
        id: user?.id,
        updated_at: new Date(),
      };
      if (newLang) updates.language = newLang;
      if (newCurr) updates.currency = newCurr;

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      // Update local state immediately
      if (newLang) setLanguage(newLang as 'en' | 'vi');
      if (newCurr) setCurrency(newCurr);

    } catch (error: any) {
      console.error('Error updating settings:', error);
      alert(t('profile.failed_save_settings'));
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('profile.passwords_mismatch'));
      return;
    }
    if (newPassword.length < 6) {
      alert(t('profile.password_min_length'));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      alert(t('profile.password_updated'));
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setLoading(true);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);

      // Auto-save the new avatar URL to profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          avatar_url: data.publicUrl,
          updated_at: new Date(),
        });

      if (updateError) throw updateError;

    } catch (error: any) {
      alert(t('profile.error_uploading_avatar') + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Header with Parallax-like effect */}
      <div className="relative h-48 md:h-64 group mb-16 md:mb-20">
        {/* Image Container - Overflow Hidden for Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-b-[2rem] shadow-md">
          <img
            src={profileHeader}
            alt="Profile Header"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </div>

        {/* Avatar Container - Absolute positioned relative to the header, but allowed to overflow */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-6 md:px-8">
          <div className="flex items-end gap-4 md:gap-6 w-full max-w-4xl mx-auto">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                {avatarUrl && avatarUrl.startsWith('http') ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-4xl md:text-5xl">
                    {avatarUrl || '👤'}
                  </div>
                )}
              </div>
              <label
                className="absolute bottom-0 right-0 p-2 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-colors cursor-pointer"
                title="Change Avatar"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
            </div>
            <div className="mb-3 md:mb-4 text-slate-800 flex-1 pt-12 md:pt-16">
              <h1 className="text-2xl md:text-3xl font-bold">{fullName || 'Traveler'}</h1>
              <p className="text-slate-500 text-sm md:text-base">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'profile' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            {t('profile.title')}
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-full"></div>
            )}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'settings' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            onClick={() => setActiveTab('settings')}
          >
            {t('profile.settings')}
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-full"></div>
            )}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'security' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            onClick={() => setActiveTab('security')}
          >
            {t('profile.security')}
            {activeTab === 'security' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-full"></div>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">{t('profile.personal_info')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('profile.full_name')}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('profile.email')}</label>
                    <input
                      type="text"
                      value={user?.email}
                      disabled
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={updateProfile}
                      disabled={loading}
                      className="px-6 py-2.5 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? t('profile.saving') : t('profile.save_changes')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">{t('profile.preferences')}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div>
                      <h3 className="font-medium text-slate-800">{t('profile.language')}</h3>
                      <p className="text-sm text-slate-500">{t('profile.language_desc')}</p>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => updateSettings(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div>
                      <h3 className="font-medium text-slate-800">{t('profile.currency')}</h3>
                      <p className="text-sm text-slate-500">{t('profile.currency_desc')}</p>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => updateSettings(undefined, e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value="VND">VND (₫)</option>
                      <option value="USD">USD ($)</option>
                      <option value="THB">THB (฿)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">{t('profile.change_password')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('profile.new_password')}</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t('profile.confirm_password')}</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !newPassword}
                      className="px-6 py-2.5 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? t('profile.updating') : t('profile.update_password')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('profile.account_stats')}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t('profile.member_since')}</p>
                    <p className="font-medium text-slate-800">
                      {new Date(user?.created_at || '').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{t('profile.total_trips')}</p>
                    <p className="font-medium text-slate-800">--</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              {t('profile.sign_out')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
