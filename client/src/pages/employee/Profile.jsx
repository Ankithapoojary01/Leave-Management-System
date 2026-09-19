import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return 'AP';
    if (user.avatarInitials) return user.avatarInitials;
    if (user.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return 'AP';
  };

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-group">
        <h1 className="page-main-title">My Profile</h1>
        <p className="page-sub-title">View and manage your profile information.</p>
      </div>

      {/* Profile Card matching reference design */}
      <div className="content-card profile-card-wrapper">
        <div className="profile-header-box">
          <div className="profile-large-avatar">
            {getInitials()}
          </div>
          <div className="profile-identity-info">
            <h2 className="profile-name-text">{user?.name || 'Ankitha Poojary'}</h2>
            <span className="profile-role-badge">{user?.role === 'admin' ? 'Administrator' : 'Employee'}</span>
          </div>
        </div>

        <div className="profile-details-table">
          <div className="profile-detail-row">
            <span className="profile-detail-label">Employee ID</span>
            <span className="profile-detail-value font-mono">{user?.employeeId || 'EMP001'}</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{user?.email || 'ankitha@example.com'}</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Department</span>
            <span className="profile-detail-value">{user?.department || 'Engineering'}</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Total Leave Allowance</span>
            <span className="profile-detail-value">{user?.totalLeave || 20} Days</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Leaves Consumed</span>
            <span className="profile-detail-value text-warning">{user?.usedLeave || 0} Days</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Available Balance</span>
            <span className="profile-detail-value text-success font-semibold">
              {user?.availableLeave !== undefined ? user.availableLeave : (user?.totalLeave || 20) - (user?.usedLeave || 0)} Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
