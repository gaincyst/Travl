import React, { useEffect, useRef, useState } from 'react';
import { FaEye, FaPencilAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { API_ENDPOINTS, getAuthHeaders } from '../utils/api';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfileAvatar.css';

function ProfileAvatar({ user, avatarUrl, displayName, onAvatarChange, size = 120 }) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const wrapperRef = useRef(null);
  const { updateUser } = useAuth();

  useEffect(() => {
    setCurrentAvatarUrl(avatarUrl || '');
  }, [avatarUrl]);

  useEffect(() => {
    if (!isDropdownOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const openFilePicker = () => {
    closeDropdown();
    fileInputRef.current?.click();
  };

  const openViewModal = () => {
    if (!currentAvatarUrl) {
      return;
    }

    closeDropdown();
    requestAnimationFrame(() => setIsModalOpen(true));
  };

  const handleDeleteAvatar = async () => {
    if (!currentAvatarUrl || isDeleting) {
      return;
    }

    closeDropdown();
    setErrorMessage('');
    setIsDeleting(true);

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_AVATAR, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete photo');
      }

      setCurrentAvatarUrl('');
      onAvatarChange?.('');
      updateUser?.({ avatarUrl: null, avatar_url: null });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadAvatar = async (file) => {
    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(API_ENDPOINTS.PROFILE_AVATAR, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to upload photo');
      }

      const nextAvatarUrl = result.data?.avatarUrl || '';
      if (!nextAvatarUrl) {
        throw new Error('Failed to upload photo');
      }

      setCurrentAvatarUrl(nextAvatarUrl);
      onAvatarChange?.(nextAvatarUrl);
      updateUser?.({ avatarUrl: nextAvatarUrl, avatar_url: nextAvatarUrl });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Only JPG, JPEG, and PNG images are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File size must be less than 2MB');
      return;
    }

    await uploadAvatar(file);
  };

  const hasAvatar = Boolean(currentAvatarUrl);
  const resolvedUser = {
    ...(user || {}),
    name: user?.name || displayName,
    avatarUrl: currentAvatarUrl || avatarUrl || user?.avatarUrl || user?.avatar_url || ''
  };

  return (
    <div
      className="profile-avatar-widget"
      ref={wrapperRef}
      style={{
        '--profile-avatar-size': `${size}px`
      }}
    >
      <div className="profile-avatar__shell">
        <Avatar user={resolvedUser} size={size} className="profile-avatar__display" />

        <button
          type="button"
          className="profile-avatar__edit-button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-label="Edit profile photo"
        >
          <FaPencilAlt />
        </button>

        <div className={`profile-avatar__overlay ${hasAvatar ? '' : 'is-visible'}`}>
          <span>{isUploading ? 'Uploading...' : 'Edit photo'}</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="profile-avatar__file-input"
      />

      <div className={`profile-avatar__dropdown ${isDropdownOpen ? 'is-open' : ''}`}>
        <button type="button" className="profile-avatar__dropdown-item" onClick={openFilePicker}>
          <FaPencilAlt />
          <span>Edit Photo</span>
        </button>
        <button
          type="button"
          className="profile-avatar__dropdown-item"
          onClick={openViewModal}
          disabled={!hasAvatar}
        >
          <FaEye />
          <span>View Photo</span>
        </button>
        <button
          type="button"
          className="profile-avatar__dropdown-item profile-avatar__dropdown-item--danger"
          onClick={handleDeleteAvatar}
          disabled={!hasAvatar || isDeleting}
        >
          <FaTrash />
          <span>{isDeleting ? 'Deleting...' : 'Delete Photo'}</span>
        </button>
      </div>

      {errorMessage && <div className="profile-avatar__error">{errorMessage}</div>}

      {isModalOpen && hasAvatar && (
        <div className="profile-avatar__modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="profile-avatar__modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="profile-avatar__modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close avatar preview"
            >
              <FaTimes />
            </button>
            <img className="profile-avatar__modal-image" src={currentAvatarUrl} alt="Full size profile avatar" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
