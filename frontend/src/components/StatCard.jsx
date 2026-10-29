import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  const colorMap = {
    primary: { bg: '#eff6ff', text: '#2563eb' },
    success: { bg: '#f0fdf4', text: '#16a34a' },
    warning: { bg: '#fffbeb', text: '#d97706' },
    danger: { bg: '#fef2f2', text: '#dc2626' },
    purple: { bg: '#faf5ff', text: '#9333ea' }
  };

  const current = colorMap[color] || colorMap.primary;

  return (
    <div className="card-custom p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44, backgroundColor: current.bg, color: current.text }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
      <h3 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>
        {value}
      </h3>
      {subtitle && (
        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
