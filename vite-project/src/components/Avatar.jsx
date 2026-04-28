import { useEffect, useMemo, useState } from 'react';
import { generateAvatar, getAvatarUrl } from '../utils/avatar';
import '../styles/Avatar.css';

function Avatar({ user, size = 'medium', className = '', onClick }) {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setImageSrc(getAvatarUrl(user));
  }, [user]);

  const avatarData = useMemo(() => generateAvatar(user), [user]);

  const sizeClass = typeof size === 'string' ? `avatar--${size}` : '';
  const resolvedSize = typeof size === 'number' ? `${size}px` : undefined;
  const shouldShowImage = Boolean(imageSrc);

  return (
    <div
      className={`avatar ${sizeClass} ${className}`.trim()}
      style={{
        '--avatar-size': resolvedSize
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {shouldShowImage ? (
        <img
          className="avatar__image"
          src={imageSrc}
          alt={user?.name ? `${user.name} avatar` : 'User avatar'}
          onError={() => setImageSrc('')}
        />
      ) : (
        <div className="avatar__fallback" style={{ background: avatarData.background }}>
          <span className="avatar__letter">{avatarData.letter}</span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
