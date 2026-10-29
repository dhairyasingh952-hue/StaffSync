import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="top-navbar">
      <div>
        <h6 className="mb-0 fw-bold text-dark">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h6>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
          {todayFormatted} &bull; {user?.department}
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Status indicator */}
        <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border">
          <span className="badge rounded-pill bg-success p-1" style={{ width: 8, height: 8 }}> </span>
          <span className="text-secondary fw-semibold" style={{ fontSize: '0.78rem' }}>
            StaffSync Live
          </span>
        </div>

        {/* Role Pill */}
        <div className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
          <ShieldCheck size={15} />
          <span className="fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
            {user?.role === 'hr' ? 'HR Administrator' : user?.role === 'manager' ? 'Team Manager' : 'Staff Employee'}
          </span>
        </div>
      </div>
    </header>
  );
};
