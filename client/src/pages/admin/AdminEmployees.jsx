import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.department && emp.department.toLowerCase().includes(q)) ||
      (emp.employeeId && emp.employeeId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header-group">
          <h1 className="page-main-title">Employees</h1>
          <p className="page-sub-title">View all employees</p>
        </div>
        <div className="search-box-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card matching reference */}
      <div className="content-card table-card-container">
        {loading ? (
          <div className="loading-state">Loading employee directory...</div>
        ) : filtered.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Leave Balance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, index) => (
                  <tr key={emp.id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{emp.name}</td>
                    <td className="text-secondary">{emp.email}</td>
                    <td>{emp.department || 'Engineering'}</td>
                    <td>
                      <span className="balance-highlight font-semibold">
                        {emp.availableLeave !== undefined ? emp.availableLeave : emp.totalLeave - emp.usedLeave}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <p className="empty-title">No employees found</p>
            <p className="empty-subtitle">Try searching with a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployees;
