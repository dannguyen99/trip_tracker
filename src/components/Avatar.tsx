import React from 'react';

interface AvatarProps {
  avatar: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, name, size = 'md', className = '' }) => {
  const isImage = avatar.startsWith('data:') || avatar.startsWith('http') || avatar.includes('/');

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-3xl',
    xl: 'w-20 h-20 text-5xl',
  };

  const containerClass = `rounded-full flex items-center justify-center overflow-hidden bg-slate-100 shadow-sm ${sizeClasses[size]} ${className}`;

  if (isImage) {
    return (
      <div className={containerClass}>
        <img src={avatar} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <span className="leading-none select-none">{avatar}</span>
    </div>
  );
};
