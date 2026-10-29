import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  Lock,
  Save,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ text: '', type: '' });

    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileMsg({ text: 'Personal details updated successfully!', type: 'success' });
      }
    } catch (err) {
      setProfileMsg({
        text: err.response?.data?.message || 'Error updating profile',
        type: 'danger'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMsg({ text: '', type: '' });

    if (passData.newPassword !== passData.confirmPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'danger' });
      setPassLoading(false);
      return;
    }

    try {
      const res = await API.put('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      setPassMsg({ text: res.data.message || 'Password changed successfully!', type: 'success' });
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({
        text: err.response?.data?.message || 'Error updating password',
        type: 'danger'
      });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">My Personal Profile & Records</h4>
        <p className="text-muted small mb-0">
          Maintain your personal contact details, residential address, and credentials.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-lg-4">
          <div className="card-custom p-4 text-center mb-4">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0284c7&color=fff`
              }
              alt="Avatar"
              className="rounded-circle border mb-3 shadow-sm"
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
            <h5 className="fw-bold text-dark mb-1">{user?.name}</h5>
            <span className="text-muted small d-block mb-2">{user?.designation}</span>
            <span
              className={`badge text-uppercase ${
                user?.role === 'hr'
                  ? 'badge-role-hr'
                  : user?.role === 'manager'
                  ? 'badge-role-manager'
                  : 'badge-role-employee'
              }`}
            >
              {user?.role}
            </span>

            <div className="border-top mt-4 pt-3 text-start small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Department:</span>
                <span className="fw-semibold">{user?.department}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Reporting Manager:</span>
                <span className="fw-semibold">{user?.managerName || 'Executive Lead'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Joining Date:</span>
                <span className="fw-semibold">{user?.joiningDate?.split('T')[0] || '2023-01-01'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Employment Status:</span>
                <span className="badge bg-success-subtle text-success">{user?.status || 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Leave Quota Summary Card */}
          <div className="card-custom p-4">
            <h6 className="fw-bold text-dark mb-3">Leave Balance Status</h6>
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <span className="small text-muted">Casual Leave</span>
              <span className="fw-bold">{user?.leaveBalance?.casual || 0} / 12 Days</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <span className="small text-muted">Sick Leave</span>
              <span className="fw-bold">{user?.leaveBalance?.sick || 0} / 10 Days</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">Annual Vacation</span>
              <span className="fw-bold">{user?.leaveBalance?.annual || 0} / 15 Days</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="col-lg-8">
          {/* Edit Profile Form */}
          <div className="card-custom p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Personal Contact Information</h5>

            {profileMsg.text && (
              <div className={`alert alert-${profileMsg.type} small py-2 mb-3`} role="alert">
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Avatar Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Residential Address</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Street, City, State, ZIP..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top text-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn btn-primary-custom d-inline-flex align-items-center gap-2"
                >
                  <Save size={16} />
                  <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card-custom p-4">
            <h5 className="fw-bold text-dark mb-3">Security & Password</h5>

            {passMsg.text && (
              <div className={`alert alert-${passMsg.type} small py-2 mb-3`} role="alert">
                {passMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top text-end">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                >
                  <Lock size={16} />
                  <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
