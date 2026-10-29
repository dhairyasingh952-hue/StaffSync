import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck2,
  Megaphone,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  LogOut,
  Building2
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'employee';

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div className="p-4 border-bottom d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white"
          style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          <Building2 size={22} />
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
            StaffSync
          </h5>
          <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            HRM WORKSPACE
          </span>
        </div>
      </div>

      {/* Nav Section */}
      <div className="py-3 flex-grow-1 overflow-auto">
        <div className="px-4 mb-2 text-uppercase text-muted" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.6px' }}>
          Navigation
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>{role === 'manager' ? 'My Team' : role === 'hr' ? 'Employees' : 'Directory'}</span>
        </NavLink>

        <NavLink to="/attendance" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Clock size={18} />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/leaves" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <CalendarCheck2 size={18} />
          <span>{role === 'employee' ? 'Leave Requests' : 'Leave Approvals'}</span>
        </NavLink>

        <NavLink to="/announcements" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Megaphone size={18} />
          <span>Announcements</span>
        </NavLink>

        <NavLink to="/training" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <GraduationCap size={18} />
          <span>Training & Dev</span>
        </NavLink>

        <div className="px-4 mt-4 mb-2 text-uppercase text-muted" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.6px' }}>
          Personal
        </div>

        <NavLink to="/profile" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <UserCheck size={18} />
          <span>My Profile</span>
        </NavLink>
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-top bg-light">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0284c7&color=fff`}
              alt="Avatar"
              className="rounded-circle border"
              style={{ width: 34, height: 34, objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                {user?.name}
              </div>
              <span
                className={`badge text-uppercase ${
                  role === 'hr'
                    ? 'badge-role-hr'
                    : role === 'manager'
                    ? 'badge-role-manager'
                    : 'badge-role-employee'
                }`}
                style={{ fontSize: '0.65rem' }}
              >
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-sm btn-outline-danger border-0 p-1"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
