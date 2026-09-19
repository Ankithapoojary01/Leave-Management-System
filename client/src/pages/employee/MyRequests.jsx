import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatDateDisplay } from '../../utils/dateFormatter';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/my-leaves');
      if (res.data.success) {
        setRequests(res.data.leaves);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
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

  const filteredRequests = requests.filter((req) => {
    if (filter === 'ALL') return true;
    return req.status.toUpperCase() === filter;
  });

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header-group">
          <h1 className="page-main-title">My Leave Requests</h1>
          <p className="page-sub-title">View and track all your leave requests.</p>
        </div>
        <Link to="/employee/apply" className="btn-primary-action btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Apply New Leave
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <button
          className={`filter-tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Requests ({requests.length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending ({requests.filter(r => r.status === 'Pending').length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          Approved ({requests.filter(r => r.status === 'Approved').length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected ({requests.filter(r => r.status === 'Rejected').length})
        </button>
      </div>

      {/* Table Card */}
      <div className="content-card table-card-container">
        {loading ? (
          <div className="loading-state">Loading your leave requests...</div>
        ) : filteredRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, index) => (
                  <tr key={req._id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{req.leaveType}</td>
                    <td>{formatDateDisplay(req.startDate)}</td>
                    <td>{formatDateDisplay(req.endDate)}</td>
                    <td>{req.duration || req.days || 1} { (req.duration || req.days || 1) === 1 ? 'day' : 'days'}</td>
                    <td className="text-truncate-cell" title={req.reason}>
                      {req.reason}
                      {req.adminRemark && (
                        <span className="admin-remark-hint">
                          Remark: {req.adminRemark}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <p className="empty-title">No leave requests found</p>
            <p className="empty-subtitle">
              {filter === 'ALL'
                ? "You haven't applied for any leaves yet."
                : `No requests with status '${filter}'.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
