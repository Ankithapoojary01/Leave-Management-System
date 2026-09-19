import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ApplyLeave = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Compute today's date in YYYY-MM-DD for min attribute
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = getTodayString();

  // Calculate total leave days excluding Sundays only (Saturday is counted)
  const calculateLeaveDays = (startStr, endStr) => {
    if (!startStr || !endStr) return 0;
    const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = endStr.split('-').map(Number);

    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);

    if (end < start) return 0;

    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      if (cur.getDay() !== 0) { // Exclude Sunday (0), Saturday (6) is counted
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  // Automatically calculate number of days when dates change (excluding Sundays)
  useEffect(() => {
    if (startDate && endDate) {
      if (startDate < todayString) {
        setDuration(0);
        setError('Leave start date cannot be before today.');
        return;
      }

      if (endDate < startDate) {
        setDuration(0);
        setError('End Date cannot be earlier than Start Date.');
        return;
      }

      const count = calculateLeaveDays(startDate, endDate);
      setDuration(count);
      setError('');
    }
  }, [startDate, endDate]);

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!leaveType) {
      setError('Please select a leave type.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
      return;
    }

    if (startDate < todayString) {
      setError('Leave dates before today are not allowed. Please select today or a future date.');
      return;
    }

    if (endDate < startDate) {
      setError('End Date cannot be earlier than Start Date.');
      return;
    }

    if (duration <= 0) {
      setError('Selected range contains 0 leave days because Sundays are excluded from leave calculations.');
      return;
    }
    if (!reason.trim()) {
      setError('Please enter a reason for your leave request.');
      return;
    }

    if (user && user.availableLeave !== undefined && duration > user.availableLeave) {
      setError(`Requested duration (${duration} days) exceeds your available leave balance (${user.availableLeave} days).`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/leaves/apply', {
        leaveType,
        startDate: formatDateString(startDate),
        endDate: formatDateString(endDate),
        duration,
        reason: reason.trim()
      });

      if (res.data.success) {
        setSuccess('Leave request submitted successfully!');
        await refreshUser();
        setTimeout(() => {
          navigate('/employee/requests');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content-area">
      {/* Header */}
      <div className="page-header-group">
        <h1 className="page-main-title">Apply for Leave</h1>
        <p className="page-sub-title">Fill in the details to submit a new leave request.</p>
      </div>

      {/* Form Card */}
      <div className="content-card form-card-container">
        {error && (
          <div className="alert-message alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-message alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="leave-apply-form">
          {/* Leave Type */}
          <div className="form-group">
            <label className="form-label">
              Leave Type <span className="text-danger">*</span>
            </label>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Select leave type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>
          </div>

          {/* Date Range: Start Date & End Date */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">
                Start Date <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="date"
                  className="form-input"
                  min={todayString}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                End Date <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="date"
                  className="form-input"
                  min={startDate || todayString}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Number of Days */}
          <div className="form-group">
            <label className="form-label">Number of Days</label>
            <input
              type="number"
              className="form-input bg-readonly"
              value={duration}
              readOnly
            />
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">
              Reason <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Enter reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Action Buttons matching reference */}
          <div className="form-actions-row">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/employee/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
