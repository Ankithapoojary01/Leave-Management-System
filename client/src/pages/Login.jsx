import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Please enter your full name');
          setIsLoading(false);
          return;
        }

        const user = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role: role.toLowerCase(),
          department: department.trim()
        });

        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        }, 800);
      } else {
        const user = await login(email, password, role);
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'employee') {
      setEmail('ankitha@example.com');
      setPassword('password123');
      setRole('Employee');
    } else {
      setEmail('admin@example.com');
      setPassword('password123');
      setRole('Admin');
    }
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        {/* Left Visual Hero Panel */}
        <div className="login-left-panel">
          <div className="left-hero-content">
            <div className="login-logo-box">
              <div className="login-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="3" ry="3"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <polyline points="9 16 11 18 15 14"></polyline>
                </svg>
              </div>
              <h1 className="login-logo-title">LeaveFlow</h1>
            </div>
            <p className="login-logo-tagline">Manage leaves, work smarter together</p>

            {/* SVG Illustration matching the reference */}
            <div className="login-illustration-container">
              <svg viewBox="0 0 320 220" className="hero-illustration-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background calendar card */}
                <rect x="140" y="40" width="140" height="110" rx="12" fill="#E0EDFF" opacity="0.8" />
                <rect x="140" y="40" width="140" height="24" rx="6" fill="#BFDBFE" />
                <circle cx="160" cy="52" r="3" fill="#60A5FA" />
                <circle cx="175" cy="52" r="3" fill="#60A5FA" />
                <circle cx="190" cy="52" r="3" fill="#60A5FA" />
                {/* Calendar grid lines */}
                <rect x="155" y="75" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="185" y="75" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="215" y="75" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="245" y="75" width="20" height="12" rx="2" fill="#2563EB" opacity="0.8" />
                <rect x="155" y="95" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="185" y="95" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="215" y="95" width="20" height="12" rx="2" fill="#93C5FD" opacity="0.6" />

                {/* Decorative leaves */}
                <path d="M45 130 C30 110 40 70 80 80 C80 110 65 130 45 130 Z" fill="#93C5FD" opacity="0.5" />
                <path d="M25 150 C15 120 30 90 60 110 C55 135 40 150 25 150 Z" fill="#60A5FA" opacity="0.4" />
                
                {/* Plant pot on right */}
                <path d="M275 160 L295 160 L290 190 L280 190 Z" fill="#94A3B8" />
                <path d="M285 160 C295 140 310 145 305 160 Z" fill="#3B82F6" />
                <path d="M285 155 C275 135 265 145 280 155 Z" fill="#60A5FA" />

                {/* Character working on laptop */}
                <circle cx="85" cy="85" r="22" fill="#1E293B" />
                <path d="M70 85 C65 110 65 135 75 145 C80 120 85 105 75 85 Z" fill="#1E293B" />
                <circle cx="90" cy="88" r="14" fill="#FCD34D" />
                <path d="M68 120 C68 105 112 105 112 120 L115 170 L65 170 Z" fill="#2563EB" />
                <line x1="20" y1="180" x2="300" y2="180" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                <rect x="95" y="145" width="45" height="30" rx="3" fill="#1E293B" />
                <polygon points="90,175 145,175 140,178 95,178" fill="#64748B" />
                <circle cx="117" cy="160" r="3" fill="#FFFFFF" opacity="0.8" />
              </svg>
            </div>

            <p className="login-left-bottom-text">Time off today for a better tomorrow</p>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="login-right-panel">
          <div className="login-form-box">
            <h2 className="login-welcome-title">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="login-welcome-subtitle">
              {isRegister ? 'Sign up as Employee or Administrator' : 'Sign in to your account'}
            </p>

            {error && (
              <div className="login-error-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert-message alert-success" style={{ marginBottom: '16px' }}>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Full Name Input (Only on Register) */}
              {isRegister && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection Dropdown (Employee or Admin) */}
              <div className="form-group">
                <label className="form-label">{isRegister ? 'Register as' : 'Login as'}</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Department (Only for Employee Register) */}
              {isRegister && role.toLowerCase() === 'employee' && (
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn login-btn"
                disabled={isLoading}
              >
                {isLoading
                  ? (isRegister ? 'Creating Account...' : 'Signing in...')
                  : (isRegister ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {/* Quick Demo Fill Credentials for easy evaluation */}
            {!isRegister && (
              <div className="demo-credentials-box">
                <span className="demo-hint-title">Quick Demo Login:</span>
                <div className="demo-buttons">
                  <button
                    type="button"
                    className="demo-badge-btn"
                    onClick={() => fillCredentials('employee')}
                  >
                    Fill Employee (Ankitha)
                  </button>
                  <button
                    type="button"
                    className="demo-badge-btn admin-badge"
                    onClick={() => fillCredentials('admin')}
                  >
                    Fill Admin
                  </button>
                </div>
              </div>
            )}

            {/* Switch between Sign In and Create Account */}
            <div className="login-footer-text">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="switch-mode-link"
                    onClick={() => {
                      setIsRegister(false);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="switch-mode-link"
                    onClick={() => {
                      setIsRegister(true);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
