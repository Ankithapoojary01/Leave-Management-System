import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDateDisplay } from '../../utils/dateFormatter';

const LeaveHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/my-leaves');
      if (res.data.success) {
        setHistory(res.data.leaves);
      }
    } catch (err) {
      console.error('Failed to fetch leave history:', err);
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

  const approvedDays = history
    .filter(l => l.status === 'Approved')
    .reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

  const totalApplications = history.length;

  return (
    <div className="dashboard-content-area">
      <div className="page-header-group">
        <h1 className="page-main-title">Leave History</h1>
        <p className="page-sub-title">Complete archival log of your leave requests and decisions.</p>
      </div>

      {/* Summary Stat Mini-Row */}
      <div className="history-summary-row">
        <div className="history-metric-card">
          <span className="metric-num">{totalApplications}</span>
          <span className="metric-desc">Total Applications</span>
        </div>
        <div className="history-metric-card text-success">
          <span className="metric-num">{approvedDays}</span>
          <span className="metric-desc">Approved Leave Days Taken</span>
        </div>
        <div className="history-metric-card text-muted">
          <span className="metric-num">{history.filter(l => l.status === 'Pending').length}</span>
          <span className="metric-desc">Under Review</span>
        </div>
      </div>

      {/* History Table */}
      <div className="content-card table-card-container">
        {loading ? (
          <div className="loading-state">Loading leave history...</div>
        ) : history.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Decision / Remark</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{item.leaveType}</td>
                    <td>{formatDateDisplay(item.startDate)}</td>
                    <td>{formatDateDisplay(item.endDate)}</td>
                    <td>{item.duration || item.days || 1} { (item.duration || item.days || 1) === 1 ? 'day' : 'days'}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span className={`status-pill ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.adminRemark ? (
                        <span className="admin-remark-text">{item.adminRemark}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <p className="empty-title">No leave history recorded</p>
            <p className="empty-subtitle">Your past leave applications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
