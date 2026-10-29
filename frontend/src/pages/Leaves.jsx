import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  CalendarCheck2,
  PlusCircle,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const Leaves = () => {
  const { user, updateUser } = useAuth();
  const role = user?.role || 'employee';

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState(user?.leaveBalance || { casual: 12, sick: 10, annual: 15 });
  const [filterStatus, setFilterStatus] = useState('All');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [applyError, setApplyError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Review Modal for HR/Manager
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLeave, setReviewLeave] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('Approved');
  const [reviewerComments, setReviewerComments] = useState('');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const endpoint =
        role === 'employee'
          ? '/leaves/my'
          : `/leaves?status=${filterStatus}`;
      const res = await API.get(endpoint);
      if (res.data.success) {
        setLeaves(res.data.data);
        if (res.data.leaveBalance) {
          setLeaveBalance(res.data.leaveBalance);
        }
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  // Calculate days between start and end
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError('');
    setSubmitting(true);

    const totalDays = calculateDays(applyForm.startDate, applyForm.endDate);

    try {
      const res = await API.post('/leaves', {
        ...applyForm,
        totalDays
      });
      setActionMessage({ text: res.data.message, type: 'success' });
      setShowApplyModal(false);
      setApplyForm({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Error submitting leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReview = (leaveItem, decision) => {
    setReviewLeave(leaveItem);
    setReviewDecision(decision);
    setReviewerComments('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewLeave) return;

    try {
      await API.put(`/leaves/${reviewLeave._id}/status`, {
        status: reviewDecision,
        reviewerComments
      });
      setActionMessage({
        text: `Leave request has been ${reviewDecision.toLowerCase()}.`,
        type: reviewDecision === 'Approved' ? 'success' : 'warning'
      });
      setShowReviewModal(false);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            {role === 'employee' ? 'My Leave Applications & Balance' : 'Leave Approval Workflow'}
          </h4>
          <p className="text-muted small mb-0">
            {role === 'employee'
              ? 'Submit time-off requests, track approval statuses, and monitor your remaining quotas.'
              : 'Review and manage employee leave requests, approve quotas, and log manager feedback.'}
          </p>
        </div>

        {role === 'employee' && (
          <button
            onClick={() => {
              setApplyError('');
              setShowApplyModal(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {actionMessage.text}
          <button type="button" className="btn-close py-2" onClick={() => setActionMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Leave Quota Cards (For Employees) */}
      {role === 'employee' && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card-custom p-3 border-start border-4 border-primary">
              <span className="text-muted small fw-semibold text-uppercase">Casual Leave</span>
              <h3 className="fw-bold text-dark my-1">{leaveBalance.casual} Days</h3>
              <span className="text-muted small">Available for quick personal errands</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-custom p-3 border-start border-4 border-success">
              <span className="text-muted small fw-semibold text-uppercase">Sick Leave</span>
              <h3 className="fw-bold text-dark my-1">{leaveBalance.sick} Days</h3>
              <span className="text-muted small">Medical & recovery leave quota</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-custom p-3 border-start border-4 border-info">
              <span className="text-muted small fw-semibold text-uppercase">Annual Vacation</span>
              <h3 className="fw-bold text-dark my-1">{leaveBalance.annual} Days</h3>
              <span className="text-muted small">Paid time-off for vacations</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {role !== 'employee' && (
        <div className="card-custom p-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <span className="small fw-semibold text-muted">Filter by Status:</span>
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${
                  filterStatus === st ? 'btn-primary' : 'btn-outline-secondary'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaves Table */}
      <div className="card-custom overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CalendarCheck2 size={36} className="text-muted mb-2 opacity-50" />
            <h6>No leave requests found.</h6>
            <span className="small">Applications will be listed here once submitted.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle mb-0">
              <thead>
                <tr>
                  {role !== 'employee' && <th>Employee</th>}
                  <th>Leave Type</th>
                  <th>Dates & Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Reviewed By</th>
                  {role !== 'employee' && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    {role !== 'employee' && (
                      <td>
                        <div className="fw-semibold text-dark">{leave.userName}</div>
                        <span className="text-muted small">{leave.department}</span>
                      </td>
                    )}
                    <td>
                      <span className="badge bg-light text-dark border">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold small">
                        {leave.startDate} to {leave.endDate}
                      </div>
                      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                        {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </td>
                    <td className="small" style={{ maxWidth: 220 }}>
                      <div className="text-truncate">{leave.reason}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === 'Approved'
                            ? 'badge-status-approved'
                            : leave.status === 'Rejected'
                            ? 'badge-status-rejected'
                            : 'badge-status-pending'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {leave.reviewedBy ? (
                        <div>
                          <span className="fw-semibold text-dark">{leave.reviewedBy}</span>
                          {leave.reviewerComments && (
                            <span className="d-block text-muted fst-italic">
                              "{leave.reviewerComments}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>Awaiting Review</span>
                      )}
                    </td>
                    {role !== 'employee' && (
                      <td className="text-end">
                        {leave.status === 'Pending' ? (
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => handleOpenReview(leave, 'Approved')}
                              className="btn btn-outline-success"
                              title="Approve"
                            >
                              <Check size={14} className="me-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReview(leave, 'Rejected')}
                              className="btn btn-outline-danger"
                              title="Reject"
                            >
                              <X size={14} className="me-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">Decided</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold">Submit Leave Application</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApplyModal(false)}
                ></button>
              </div>

              <form onSubmit={handleApplySubmit}>
                <div className="modal-body p-4">
                  {applyError && (
                    <div className="alert alert-danger small py-2 mb-3">{applyError}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Leave Type *</label>
                    <select
                      className="form-select"
                      value={applyForm.leaveType}
                      onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value })}
                      required
                    >
                      <option value="Annual">Annual Paid Leave ({leaveBalance.annual} days left)</option>
                      <option value="Casual">Casual Leave ({leaveBalance.casual} days left)</option>
                      <option value="Sick">Sick / Medical Leave ({leaveBalance.sick} days left)</option>
                      <option value="Maternity">Maternity / Paternity Leave</option>
                      <option value="Unpaid">Unpaid Leave</option>
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={applyForm.startDate}
                        onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={applyForm.endDate}
                        onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {applyForm.startDate && applyForm.endDate && (
                    <div className="alert alert-info py-2 small mb-3">
                      Total leave duration: <strong>{calculateDays(applyForm.startDate, applyForm.endDate)} day(s)</strong>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Reason for Request *</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Please describe the reason for your time-off..."
                      value={applyForm.reason}
                      onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top p-3 bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm px-3"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary-custom btn-sm px-4"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal for Manager / HR */}
      {showReviewModal && reviewLeave && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold">
                  {reviewDecision === 'Approved' ? 'Approve' : 'Reject'} Leave Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReviewModal(false)}
                ></button>
              </div>

              <form onSubmit={handleReviewSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 rounded-3 bg-light border mb-3">
                    <div className="fw-bold">{reviewLeave.userName} &bull; {reviewLeave.department}</div>
                    <div className="small text-muted mb-1">
                      Type: <strong>{reviewLeave.leaveType}</strong> | Duration: <strong>{reviewLeave.totalDays} day(s)</strong> ({reviewLeave.startDate} to {reviewLeave.endDate})
                    </div>
                    <div className="small">Reason: <em>"{reviewLeave.reason}"</em></div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Reviewer Feedback / Comments
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder={
                        reviewDecision === 'Approved'
                          ? 'Optional approval note (e.g. Approved. Enjoy your time off!)'
                          : 'Reason for rejection (e.g. Clashes with critical release sprint)'
                      }
                      value={reviewerComments}
                      onChange={(e) => setReviewerComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top p-3 bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-sm ${
                      reviewDecision === 'Approved' ? 'btn-success' : 'btn-danger'
                    } px-4`}
                  >
                    Confirm {reviewDecision}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
