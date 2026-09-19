import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminLeaveBalance = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees/leave-balances');
      if (res.data.success) {
        setBalances(res.data.balances);
      }
    } catch (err) {
      console.error('Failed to fetch leave balances:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = balances.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.employeeName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      (b.department && b.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header-group">
          <h1 className="page-main-title">Leave Balance</h1>
          <p className="page-sub-title">View leave balance of all employees</p>
        </div>
        <div className="search-box-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card matching reference */}
      <div className="content-card table-card-container">
        {loading ? (
          <div className="loading-state">Loading leave balance metrics...</div>
        ) : filtered.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Total</th>
                  <th>Used</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{item.employeeName}</td>
                    <td>{item.total}</td>
                    <td className="text-warning font-semibold">{item.used}</td>
                    <td className="text-success font-semibold">{item.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <p className="empty-title">No balance records found</p>
            <p className="empty-subtitle">Try searching with a different name.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveBalance;
