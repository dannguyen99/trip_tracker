import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { resizeImage } from '../utils/imageUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface UserManagementProps {
  tripId: string;
  users: User[];
  onAddUser: (name: string, avatar: string) => void;
  onEditUser: (id: string, name: string, avatar: string) => void;
  onDeleteUser: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_OPTIONS = ["👨🏻", "👩🏻", "👨🏼", "👩🏼", "🧑🏽", "👱🏻‍♂️", "👴🏻", "👵🏻", "🦁", "🐯", "🐶", "🐱"];

export const UserManagement: React.FC<UserManagementProps> = ({ tripId, users, onAddUser, onEditUser, onDeleteUser, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      // Check if invite exists
      const { data: existing } = await supabase
        .from('trip_invites')
        .select('token')
        .eq('trip_id', tripId)
        .single();

      let token = existing?.token;

      if (!token) {
        // Create new invite
        // We can't use default gen_random_bytes in client insert if we want to get it back immediately easily without return, 
        // but the table has defaults.
        // Let's insert and select.
        const { data: newInvite, error } = await supabase
          .from('trip_invites')
          .insert({ trip_id: tripId })
          .select('token')
          .single();

        if (error) throw error;
        token = newInvite.token;
      }

      // Construct link using BASE_URL to handle subpaths (e.g. /trip_tracker/)
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
      const link = `${window.location.origin}${baseUrl}join/${token}`;
      setInviteLink(link);
      navigator.clipboard.writeText(link);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Error generating link:', err);
      alert('Failed to generate invite link.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingId !== null) {
      onEditUser(editingId, name, avatar);
      setEditingId(null);
    } else {
      onAddUser(name, avatar);
    }
    setName('');
    setAvatar(AVATAR_OPTIONS[0]);
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setAvatar(user.avatar);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setAvatar(AVATAR_OPTIONS[0]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await resizeImage(e.target.files[0]);
        setAvatar(base64);
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("Failed to process image.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{t('user_management.title')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Invite Link Section */}
        <div className="mb-6 bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-purple-900">Invite via Link</h3>
            <p className="text-xs text-purple-600">Share a link to let friends join instantly.</p>
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {generatingLink ? 'Generating...' : (inviteLink ? 'Copy Again' : 'Copy Link')}
          </button>
        </div>

        {/* User List */}
        <div className="space-y-3 mb-8">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${user.bg} ${user.border} border-2 flex items-center justify-center text-lg overflow-hidden`}>
                  {user.avatar.startsWith('data:') ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.avatar
                  )}
                </div>
                <span className="font-bold text-slate-700">{user.name}</span>
              </div>
              <div className="flex gap-2">
                {user.userId ? (
                  <div className="px-2 py-1 bg-slate-100 rounded-lg text-slate-400 text-xs font-bold flex items-center gap-1 cursor-help" title={t('user_management.linked_desc')}>
                    <span>🔒</span>
                    <span className="hidden sm:inline">{t('user_management.linked')}</span>
                  </div>
                ) : (
                  <button onClick={() => startEdit(user)} className="text-xs font-bold text-sky-500 hover:text-sky-700 px-2 py-1 bg-sky-50 rounded-lg">{t('common.edit')}</button>
                )}
                <button onClick={() => onDeleteUser(user.id)} className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded-lg">{t('common.delete')}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">{editingId !== null ? t('user_management.edit_friend') : t('user_management.add_new')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('user_management.name')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('user_management.avatar')}</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
                >
                  📸 {t('user_management.upload_photo')}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvatar(opt)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition ${avatar === opt ? 'bg-white shadow-md border-2 border-purple-500 scale-110' : 'bg-slate-100 hover:bg-white'}`}
                  >
                    {opt}
                  </button>
                ))}
                {avatar.startsWith('data:') && (
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition bg-white shadow-md border-2 border-purple-500 scale-110 overflow-hidden"
                  >
                    <img src={avatar} alt="Custom" className="w-full h-full object-cover" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingId !== null && (
                <button type="button" onClick={cancelEdit} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50">{t('common.cancel')}</button>
              )}
              <button type="submit" className="flex-1 bg-slate-800 hover:bg-black text-white py-3 rounded-xl font-bold shadow-lg transition">
                {editingId !== null ? t('user_management.save_changes') : t('user_management.add_friend')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
