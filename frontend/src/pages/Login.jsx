import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, User, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role, department, designation });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card-custom overflow-hidden" style={{ maxWidth: 900, width: '100%' }}>
        <div className="row g-0">
          {/* Left Hero Sidebar */}
          <div
            className="col-lg-5 p-5 text-white d-flex flex-column justify-content-between"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
            }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-white text-primary rounded-3 p-2 d-inline-flex">
                  <Building2 size={24} />
                </div>
                <h4 className="fw-bold mb-0">StaffSync</h4>
              </div>
              <h3 className="fw-bold mb-3" style={{ lineHeight: 1.3 }}>
                Modern Human Resource Management Solution
              </h3>
              <p className="text-white-50" style={{ fontSize: '0.92rem' }}>
                A unified MERN stack platform empowering HR directors, team leads, and staff with attendance tracking, leave workflows, announcements, and upskilling programs.
              </p>
            </div>

            <div className="mt-4 pt-3 border-top border-white-50">
              <span className="small text-white-50 d-block mb-2 fw-semibold">
                ONE-CLICK ROLE DEMO LOGIN:
              </span>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('hr@staffsync.com')}
                  className="btn btn-sm text-start btn-outline-light d-flex align-items-center justify-content-between"
                >
                  <span>👑 HR Director (Admin)</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('manager@staffsync.com')}
                  className="btn btn-sm text-start btn-outline-light d-flex align-items-center justify-content-between"
                >
                  <span>💼 Team Lead / Manager</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('alex@staffsync.com')}
                  className="btn btn-sm text-start btn-outline-light d-flex align-items-center justify-content-between"
                >
                  <span>👤 Staff Employee</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="col-lg-7 p-4 p-md-5 bg-white">
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-1">
                {isRegister ? 'Create New Account' : 'Welcome to StaffSync'}
              </h4>
              <p className="text-muted small">
                {isRegister
                  ? 'Fill out the details below to register an employee profile.'
                  : 'Enter your credentials to access your organization dashboard.'}
              </p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                <ShieldAlert size={16} />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Role</label>
                      <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR Personnel</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <select
                        className="form-select"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Marketing & Sales">Marketing & Sales</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Job Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <span>{isRegister ? 'Register & Continue' : 'Sign In to Workspace'}</span>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-top text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="btn btn-link text-decoration-none small text-primary p-0"
              >
                {isRegister
                  ? 'Already have an account? Sign in here'
                  : "Don't have an account? Register new employee profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
