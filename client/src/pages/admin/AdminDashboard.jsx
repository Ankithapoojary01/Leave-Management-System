import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 10,
    pendingRequests: 4,
    approvedThisMonth: 8,
    rejectedThisMonth: 2
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, leavesRes] = await Promise.all([
        api.get('/employees/admin-stats'),
        api.get('/leaves/all')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (leavesRes.data.success) {
        setRecentLeaves(leavesRes.data.leaves.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-status-approved';
      case 'Rejected':
        return 'badge-status-rejected';
      case 'Pending':
      default:
        return 'badge-status-pending';
    }
  };

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-group">
        <h1 className="page-main-title">Admin Dashboard</h1>
        <p className="page-sub-title">Overview of leave management</p>
      </div>

      {/* 4 Stat Cards Grid matching reference mockup */}
      <div className="stat-cards-grid">
        {/* Total Employees */}
        <div className="stat-card stat-total-emp">
          <div className="stat-icon-wrapper icon-emp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Total Employees</span>
            <span className="stat-value">{stats.totalEmployees}</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="stat-card stat-pending-req">
          <div className="stat-icon-wrapper icon-pending">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Pending Requests</span>
            <span className="stat-value">{stats.pendingRequests}</span>
          </div>
        </div>

        {/* Approved This Month */}
        <div className="stat-card stat-approved-mo">
          <div className="stat-icon-wrapper icon-approved">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Approved This Month</span>
            <span className="stat-value">{stats.approvedThisMonth}</span>
          </div>
        </div>

        {/* Rejected This Month */}
        <div className="stat-card stat-rejected-mo">
          <div className="stat-icon-wrapper icon-rejected">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Rejected This Month</span>
            <span className="stat-value">{stats.rejectedThisMonth}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="content-card action-banner-card">
        <div className="action-banner-text">
          <h3>Review Pending Leave Requests</h3>
          <p>You have <strong>{stats.pendingRequests} pending requests</strong> awaiting managerial review.</p>
        </div>
        <Link to="/admin/requests" className="btn-primary-action">
          Manage Requests
        </Link>
      </div>

      {/* Recent Leave Activity */}
      <div className="content-card recent-requests-card">
        <div className="card-top-row">
          <h3 className="card-heading">Latest Leave Submissions</h3>
          <Link to="/admin/requests" className="table-action-link">
            View All
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.map((leave, index) => (
                <tr key={leave._id || index}>
                  <td>{index + 1}</td>
                  <td className="font-semibold">{leave.employeeName || leave.employee?.name}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.duration} {leave.duration === 1 ? 'day' : 'days'}</td>
                  <td>
                    <span className={`status-pill ${getStatusBadgeClass(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/admin/requests" className="table-action-link">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
