import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/all');
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      setMessage({ type: '', text: '' });

      const res = await api.put(`/leaves/${id}/status`, {
        status: newStatus,
        adminRemark: `Processed by Administrator on ${new Date().toLocaleDateString()}`
      });

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Leave request for ${res.data.leave.employeeName || 'employee'} marked as ${newStatus}!`
        });

        // Update list in place
        setLeaves(prev =>
          prev.map(item => (item._id === id ? res.data.leave : item))
        );
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update leave request status'
      });
    } finally {
      setActionLoadingId(null);
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

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === 'ALL') return true;
    return leave.status.toUpperCase() === filter;
  });

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-group">
        <h1 className="page-main-title">Leave Requests</h1>
        <p className="page-sub-title">Review and manage employee leave requests.</p>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          <span>{message.text}</span>
          <button
            className="alert-close-btn"
            onClick={() => setMessage({ type: '', text: '' })}
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <button
          className={`filter-tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Requests ({leaves.length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending ({leaves.filter(l => l.status === 'Pending').length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          Approved ({leaves.filter(l => l.status === 'Approved').length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected ({leaves.filter(l => l.status === 'Rejected').length})
        </button>
      </div>

      {/* Table Card matching reference */}
      <div className="content-card table-card-container">
        {loading ? (
          <div className="loading-state">Loading leave requests...</div>
        ) : filteredLeaves.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, index) => {
                  const isPending = leave.status === 'Pending';
                  const isProcessing = actionLoadingId === leave._id;

                  return (
                    <tr key={leave._id || index}>
                      <td>{index + 1}</td>
                      <td className="font-semibold">
                        {leave.employeeName || leave.employee?.name || 'Employee'}
                      </td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.duration}</td>
                      <td>
                        <span className={`status-pill ${getStatusBadgeClass(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <div className="table-actions-group">
                            <button
                              className="btn-action-approve"
                              disabled={isProcessing}
                              onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-action-reject"
                              disabled={isProcessing}
                              onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <p className="empty-title">No leave requests found</p>
            <p className="empty-subtitle">All requests processed or none match the filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
