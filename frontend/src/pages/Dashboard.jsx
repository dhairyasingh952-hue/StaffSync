import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { StatCard } from '../components/StatCard';
import {
  Users,
  Clock,
  CalendarCheck2,
  GraduationCap,
  Megaphone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  Check,
  X,
  LogIn,
  LogOut as LogOutIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const fetchDashboardData = async () => {
    try {
      const [statsRes, todayRes] = await Promise.all([
        API.get('/stats/dashboard'),
        API.get('/attendance/today')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (todayRes.data.success) {
        setTodayStatus(todayRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClockIn = async () => {
    setPunchLoading(true);
    setActionMessage({ text: '', type: '' });
    try {
      const res = await API.post('/attendance/clock-in', { notes: 'Clocked in from Dashboard' });
      setActionMessage({ text: res.data.message, type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setActionMessage({
        text: err.response?.data?.message || 'Error clocking in',
        type: 'danger'
      });
    } finally {
      setPunchLoading(false);
    }
  };

  const handleClockOut = async () => {
    setPunchLoading(true);
    setActionMessage({ text: '', type: '' });
    try {
      const res = await API.post('/attendance/clock-out');
      setActionMessage({ text: res.data.message, type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setActionMessage({
        text: err.response?.data?.message || 'Error clocking out',
        type: 'danger'
      });
    } finally {
      setPunchLoading(false);
    }
  };

  const handleQuickReviewLeave = async (leaveId, status) => {
    try {
      await API.put(`/leaves/${leaveId}/status`, {
        status,
        reviewerComments: `Quick reviewed from dashboard as ${status}`
      });
      fetchDashboardData();
    } catch (err) {
      alert('Error updating leave status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Welcome Banner */}
      <div className="mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">
              {role === 'hr'
                ? 'Human Resources Executive Overview'
                : role === 'manager'
                ? `${user?.department} Team Management Dashboard`
                : 'My Employee Workspace'}
            </h4>
            <p className="text-muted small mb-0">
              Manage day-to-day operations, requests, workflows, and communications in real time.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/leaves" className="btn btn-sm btn-outline-primary fw-semibold">
              <CalendarCheck2 size={16} className="me-1" />
              {role === 'employee' ? 'Request Leave' : 'Review Leaves'}
            </Link>
            <Link to="/attendance" className="btn btn-sm btn-primary fw-semibold">
              <Clock size={16} className="me-1" />
              Attendance View
            </Link>
          </div>
        </div>
      </div>

      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type} alert-dismissible fade show small py-2`} role="alert">
          {actionMessage.text}
          <button
            type="button"
            className="btn-close py-2"
            onClick={() => setActionMessage({ text: '', type: '' })}
          ></button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        {role === 'hr' ? (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Headcount"
                value={stats?.totalEmployees || 0}
                icon={Users}
                color="primary"
                subtitle="Active workforce across org"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Clocked In Today"
                value={stats?.presentToday || 0}
                icon={Clock}
                color="success"
                subtitle="Employees on-site or remote"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="On Leave Today"
                value={stats?.onLeaveToday || 0}
                icon={CalendarCheck2}
                color="warning"
                subtitle="Approved leave leaves"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pending Approvals"
                value={stats?.pendingLeavesCount || 0}
                icon={AlertCircle}
                color="danger"
                subtitle="Requires HR/Manager review"
              />
            </div>
          </>
        ) : role === 'manager' ? (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Direct Team Size"
                value={stats?.managerMetrics?.teamCount || 0}
                icon={Users}
                color="primary"
                subtitle={`${user?.department} Team Members`}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Team Present Today"
                value={stats?.managerMetrics?.teamPresentToday || 0}
                icon={Clock}
                color="success"
                subtitle="Checked in today"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Team Leave Requests"
                value={stats?.managerMetrics?.teamPendingLeaves || 0}
                icon={CalendarCheck2}
                color="warning"
                subtitle="Awaiting your approval"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Active Trainings"
                value={stats?.activeTrainingsCount || 0}
                icon={GraduationCap}
                color="purple"
                subtitle="Modules in progress"
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Today's Status"
                value={
                  todayStatus?.isClockedOut
                    ? 'Day Completed'
                    : todayStatus?.isClockedIn
                    ? 'Clocked In'
                    : 'Not Punched'
                }
                icon={Clock}
                color={todayStatus?.isClockedIn ? 'success' : 'warning'}
                subtitle={todayStatus?.data?.status || 'Punch in below'}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Casual Leaves Left"
                value={`${user?.leaveBalance?.casual || 0} Days`}
                icon={CalendarCheck2}
                color="primary"
                subtitle="Annual allocation: 12"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Sick Leaves Left"
                value={`${user?.leaveBalance?.sick || 0} Days`}
                icon={CalendarCheck2}
                color="success"
                subtitle="Annual allocation: 10"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Annual Leaves Left"
                value={`${user?.leaveBalance?.annual || 0} Days`}
                icon={CalendarCheck2}
                color="purple"
                subtitle="Annual allocation: 15"
              />
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Left Column: Interactive Actions & Lists */}
        <div className="col-lg-8">
          {/* Employee Quick Punch Card */}
          {role === 'employee' && (
            <div className="card-custom p-4 mb-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Daily Attendance Punch</h6>
                  <p className="text-muted small mb-0">
                    Record your daily check-in and check-out to maintain verified attendance logs.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  {!todayStatus?.isClockedIn ? (
                    <button
                      onClick={handleClockIn}
                      disabled={punchLoading}
                      className="btn btn-success d-flex align-items-center gap-2 fw-semibold px-4 py-2"
                    >
                      <LogIn size={18} />
                      <span>{punchLoading ? 'Recording...' : 'Clock In Now'}</span>
                    </button>
                  ) : !todayStatus?.isClockedOut ? (
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success-subtle text-success p-2 px-3 fw-bold">
                        Clocked In: {new Date(todayStatus.data.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={handleClockOut}
                        disabled={punchLoading}
                        className="btn btn-danger d-flex align-items-center gap-2 fw-semibold px-4 py-2"
                      >
                        <LogOutIcon size={18} />
                        <span>{punchLoading ? 'Saving...' : 'Clock Out'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="badge bg-secondary-subtle text-secondary p-2 px-3 fw-bold">
                      Workday Completed ({todayStatus.data.durationHours} hrs)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pending Leave Requests Section (For HR and Manager) */}
          {(role === 'hr' || role === 'manager') && (
            <div className="card-custom p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Pending Leave Approvals</h6>
                  <span className="text-muted small">
                    Requires immediate action from leadership
                  </span>
                </div>
                <Link to="/leaves" className="small text-decoration-none fw-semibold">
                  View All &rarr;
                </Link>
              </div>

              {stats?.recentLeaves?.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <CheckCircle2 size={32} className="text-success mb-2" />
                  <div>No pending leave requests. Everything is up to date!</div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentLeaves?.map((leave) => (
                        <tr key={leave._id}>
                          <td>
                            <div className="fw-semibold">{leave.userName}</div>
                            <span className="text-muted small">{leave.department}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {leave.leaveType}
                            </span>
                          </td>
                          <td className="small">
                            {leave.startDate} to {leave.endDate}
                            <span className="text-muted d-block">({leave.totalDays} days)</span>
                          </td>
                          <td className="small text-truncate" style={{ maxWidth: 180 }}>
                            {leave.reason}
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                onClick={() => handleQuickReviewLeave(leave._id, 'Approved')}
                                className="btn btn-outline-success"
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleQuickReviewLeave(leave._id, 'Rejected')}
                                className="btn btn-outline-danger"
                                title="Reject"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Announcements Feed Preview */}
          <div className="card-custom p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold mb-0 text-dark">Company Announcements & News</h6>
                <span className="text-muted small">Official notices from HR Administration</span>
              </div>
              <Link to="/announcements" className="small text-decoration-none fw-semibold">
                All Bulletins &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {stats?.recentAnnouncements?.map((ann) => (
                <div key={ann._id} className="p-3 rounded-3 bg-light border">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-dark">{ann.title}</span>
                    <span
                      className={`badge ${
                        ann.priority === 'High'
                          ? 'bg-danger'
                          : ann.priority === 'Medium'
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {ann.priority} Priority
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{ann.content}</p>
                  <div className="d-flex align-items-center justify-content-between small text-muted">
                    <span>Posted by {ann.authorName}</span>
                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Department Distribution & Quick Information */}
        <div className="col-lg-4">
          {/* Department Breakdown */}
          <div className="card-custom p-4 mb-4">
            <h6 className="fw-bold mb-3 text-dark">Organization Headcount</h6>
            <div className="d-flex flex-column gap-3">
              {stats?.departmentDistribution &&
                Object.entries(stats.departmentDistribution).map(([dept, count]) => (
                  <div key={dept}>
                    <div className="d-flex justify-content-between small fw-semibold mb-1">
                      <span>{dept}</span>
                      <span className="text-muted">{count} staff</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{
                          width: `${(count / (stats.totalEmployees || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Shortcuts & Resources */}
          <div className="card-custom p-4">
            <h6 className="fw-bold mb-3 text-dark">StaffSync Quick Links</h6>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/training"
                className="p-3 rounded-3 border text-decoration-none text-dark d-flex align-items-center justify-content-between bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <GraduationCap size={18} className="text-primary" />
                  <span className="small fw-semibold">Training & Certifications</span>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {stats?.activeTrainingsCount || 0}
                </span>
              </Link>
              <Link
                to="/profile"
                className="p-3 rounded-3 border text-decoration-none text-dark d-flex align-items-center justify-content-between bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <Users size={18} className="text-success" />
                  <span className="small fw-semibold">Personal Record & Profile</span>
                </div>
                <span className="text-muted small">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
