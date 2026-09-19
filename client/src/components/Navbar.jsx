import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return 'U';
    if (user.avatarInitials) return user.avatarInitials;
    if (user.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return user.role === 'admin' ? 'AD' : 'EM';
  };

  const roleDisplay = user?.role === 'admin' ? 'Administrator' : 'Employee';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="navbar-right">
        <div className="user-profile-badge">
          <div className="avatar-circle">
            {getInitials()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{roleDisplay}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
