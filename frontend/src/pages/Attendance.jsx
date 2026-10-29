import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export const Attendance = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState(null);
  const [punchLoading, setPunchLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Filters for HR / Manager
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const endpoint =
        role === 'employee'
          ? '/attendance/my'
          : `/attendance?date=${dateFilter}&department=${departmentFilter}&status=${statusFilter}`;
      const [recRes, todayRes] = await Promise.all([
        API.get(endpoint),
        API.get('/attendance/today')
      ]);

      if (recRes.data.success) {
        setRecords(recRes.data.data);
      }
      if (todayRes.data.success) {
        setTodayStatus(todayRes.data);
      }
    } catch (err) {
      console.error('Error fetching attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, departmentFilter, statusFilter]);

  const handleClockIn = async () => {
    setPunchLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.post('/attendance/clock-in', { notes });
      setMessage({ text: res.data.message, type: 'success' });
      setNotes('');
      fetchAttendance();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error clocking in',
        type: 'danger'
      });
    } finally {
      setPunchLoading(false);
    }
  };

  const handleClockOut = async () => {
    setPunchLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.post('/attendance/clock-out');
      setMessage({ text: res.data.message, type: 'success' });
      fetchAttendance();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error clocking out',
        type: 'danger'
      });
    } finally {
      setPunchLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            {role === 'hr'
              ? 'Organization Attendance Tracking'
              : role === 'manager'
              ? 'Team Attendance Logs'
              : 'My Daily Attendance & Log'}
          </h4>
          <p className="text-muted small mb-0">
            {role === 'employee'
              ? 'Punch in/out daily to track working hours, check-ins, and overtime.'
              : 'Monitor clock-in timestamps, punctuality trends, and active shifts.'}
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Employee Punch Card */}
      {role === 'employee' && (
        <div className="card-custom p-4 mb-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-6">
              <h5 className="fw-bold text-dark mb-1">Today's Clock Punch</h5>
              <p className="text-muted small mb-2">
                Standard shift begins at 09:00 AM. Clock-ins after 09:30 AM are flagged as Late.
              </p>
              {!todayStatus?.isClockedIn && (
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Optional note / task focus for today..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ maxWidth: 400 }}
                />
              )}
            </div>

            <div className="col-lg-6 text-lg-end">
              {!todayStatus?.isClockedIn ? (
                <button
                  onClick={handleClockIn}
                  disabled={punchLoading}
                  className="btn btn-success px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <LogIn size={18} />
                  <span>{punchLoading ? 'Saving...' : 'Clock In Now'}</span>
                </button>
              ) : !todayStatus?.isClockedOut ? (
                <div className="d-inline-flex flex-wrap align-items-center gap-3">
                  <div className="text-start">
                    <span className="badge bg-success-subtle text-success p-2 px-3 fw-bold d-block">
                      Clocked In: {new Date(todayStatus.data.clockIn).toLocaleTimeString()}
                    </span>
                    <span className="small text-muted">Status: {todayStatus.data.status}</span>
                  </div>
                  <button
                    onClick={handleClockOut}
                    disabled={punchLoading}
                    className="btn btn-danger px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  >
                    <LogOut size={18} />
                    <span>{punchLoading ? 'Processing...' : 'Clock Out'}</span>
                  </button>
                </div>
              ) : (
                <div className="badge bg-secondary-subtle text-secondary p-3 rounded-3 text-start">
                  <div className="fw-bold">Today's Shift Finished</div>
                  <div className="small">Total Logged: {todayStatus.data.durationHours} hours</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters (HR & Manager) */}
      {role !== 'employee' && (
        <div className="card-custom p-3 mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Filter by Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {role === 'hr' && (
              <div className="col-6 col-md-3">
                <label className="form-label small text-muted mb-1">Department</label>
                <select
                  className="form-select form-select-sm"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                </select>
              </div>
            )}

            <div className="col-6 col-md-3">
              <label className="form-label small text-muted mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>

            <div className="col text-end align-self-end">
              <button
                onClick={() => {
                  setDateFilter('');
                  setDepartmentFilter('All');
                  setStatusFilter('All');
                }}
                className="btn btn-outline-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Logs Table */}
      <div className="card-custom overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Clock size={36} className="text-muted mb-2 opacity-50" />
            <h6>No attendance records found.</h6>
            <span className="small">Records will appear as employees clock in for their shifts.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle mb-0">
              <thead>
                <tr>
                  {role !== 'employee' && <th>Employee</th>}
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    {role !== 'employee' && (
                      <td>
                        <div className="fw-semibold text-dark">{rec.userName}</div>
                        <span className="text-muted small">{rec.department}</span>
                      </td>
                    )}
                    <td className="fw-semibold">{rec.date}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      {rec.clockOut ? (
                        <span className="badge bg-light text-dark border">
                          {new Date(rec.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                          Active Shift
                        </span>
                      )}
                    </td>
                    <td>
                      {rec.durationHours ? `${rec.durationHours} hrs` : '--'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          rec.status === 'Present'
                            ? 'badge-status-approved'
                            : rec.status === 'Late'
                            ? 'badge-status-late'
                            : 'badge-status-pending'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="small text-muted text-truncate" style={{ maxWidth: 200 }}>
                      {rec.notes || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
