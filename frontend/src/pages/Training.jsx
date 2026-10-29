import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  GraduationCap,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Trash2,
  BookOpen,
  Calendar
} from 'lucide-react';

export const Training = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'Engineering',
    deadline: '',
    materialsUrl: '',
    assignedUserIds: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/trainings');
      if (res.data.success) {
        setTrainings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesForAssignment = async () => {
    if (role === 'employee') return;
    try {
      const url = role === 'manager' ? '/employees/my-team' : '/employees';
      const res = await API.get(url);
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchEmployeesForAssignment();
  }, []);

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/trainings', formData);
      setSuccess('Training program successfully initiated and assigned!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        department: user?.department || 'Engineering',
        deadline: '',
        materialsUrl: '',
        assignedUserIds: []
      });
      fetchTrainings();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating training module');
    }
  };

  const handleUpdateMyProgress = async (trainingId, newStatus) => {
    try {
      await API.put(`/trainings/${trainingId}/progress`, { status: newStatus });
      setSuccess(`Your training progress is marked as "${newStatus}"!`);
      fetchTrainings();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTraining = async (id, title) => {
    if (!window.confirm(`Delete training module "${title}"?`)) return;
    try {
      await API.delete(`/trainings/${id}`);
      setSuccess('Training module removed.');
      fetchTrainings();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting training');
    }
  };

  const toggleEmployeeSelection = (empId) => {
    const list = [...formData.assignedUserIds];
    const idx = list.indexOf(empId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(empId);
    }
    setFormData({ ...formData, assignedUserIds: list });
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Training & Team Development</h4>
          <p className="text-muted small mb-0">
            {role === 'employee'
              ? 'Access enrolled courses, technical modules, and skill certifications.'
              : 'Create development paths, assign technical courses, and track team progress.'}
          </p>
        </div>

        {role !== 'employee' && (
          <button
            onClick={() => {
              setError('');
              setShowModal(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Create Training Program</span>
          </button>
        )}
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show small py-2 mb-3" role="alert">
          {success}
          <button type="button" className="btn-close py-2" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Grid of Trainings */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : trainings.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <GraduationCap size={40} className="text-muted mb-2 opacity-50" />
            <h6>No active training modules found.</h6>
            <span className="small">Managers can add and assign upskilling programs.</span>
          </div>
        ) : (
          trainings.map((t) => {
            const myStatusObj = t.assignedTo?.find((a) => a.userId === user?._id);
            const myStatus = myStatusObj?.status || 'Not Started';

            return (
              <div key={t._id} className="col-12 col-lg-6">
                <div className="card-custom p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {t.department}
                      </span>
                      {role !== 'employee' && (
                        <button
                          onClick={() => handleDeleteTraining(t._id, t.title)}
                          className="btn btn-outline-danger btn-sm border-0 p-1"
                          title="Delete Training"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{t.title}</h5>
                    <p className="text-secondary small mb-3">{t.description}</p>

                    <div className="p-3 bg-light rounded-3 mb-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Managed By:</span>
                        <span className="fw-semibold">{t.managerName}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Target Deadline:</span>
                        <span className="fw-semibold text-danger">{t.deadline}</span>
                      </div>
                      {t.materialsUrl && (
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Curriculum:</span>
                          <a
                            href={t.materialsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1"
                          >
                            <span>Open Course Materials</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Progress Breakdown for Managers / HR */}
                    {role !== 'employee' && (
                      <div className="mb-3">
                        <span className="text-muted small fw-semibold d-block mb-2">
                          Assigned Members ({t.assignedTo?.length || 0}):
                        </span>
                        <div className="d-flex flex-wrap gap-1">
                          {t.assignedTo?.map((emp, i) => (
                            <span
                              key={i}
                              className={`badge ${
                                emp.status === 'Completed'
                                  ? 'bg-success'
                                  : emp.status === 'In Progress'
                                  ? 'bg-warning text-dark'
                                  : 'bg-light text-dark border'
                              }`}
                              style={{ fontSize: '0.72rem' }}
                            >
                              {emp.userName}: {emp.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions for Employees */}
                  {role === 'employee' && (
                    <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block">My Status:</span>
                        <span
                          className={`badge ${
                            myStatus === 'Completed'
                              ? 'badge-status-approved'
                              : myStatus === 'In Progress'
                              ? 'badge-status-late'
                              : 'badge-status-pending'
                          }`}
                        >
                          {myStatus}
                        </span>
                      </div>

                      <div className="btn-group btn-group-sm">
                        {myStatus === 'Not Started' && (
                          <button
                            onClick={() => handleUpdateMyProgress(t._id, 'In Progress')}
                            className="btn btn-outline-primary"
                          >
                            Start Program
                          </button>
                        )}
                        {myStatus === 'In Progress' && (
                          <button
                            onClick={() => handleUpdateMyProgress(t._id, 'Completed')}
                            className="btn btn-success"
                          >
                            <CheckCircle2 size={14} className="me-1" />
                            Mark Completed
                          </button>
                        )}
                        {myStatus === 'Completed' && (
                          <span className="text-success small fw-bold d-flex align-items-center gap-1">
                            <CheckCircle2 size={16} /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Training Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold">Initiate Training & Upskilling Module</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateTraining}>
                <div className="modal-body p-4">
                  {error && <div className="alert alert-danger small py-2 mb-3">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Course / Module Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Advanced System Design & API Security"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Target Department</label>
                      <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing & Sales">Marketing & Sales</option>
                        <option value="All">All Departments</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Completion Deadline *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Curriculum / External Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://docs.company.internal/training-module"
                      value={formData.materialsUrl}
                      onChange={(e) => setFormData({ ...formData, materialsUrl: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Course Description *</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Summary of learning outcomes and modules covered..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Assign Team Members</label>
                    <div className="border rounded-3 p-3 bg-light overflow-auto" style={{ maxHeight: 160 }}>
                      {employees.map((emp) => (
                        <div key={emp._id} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`emp-${emp._id}`}
                            checked={formData.assignedUserIds.includes(emp._id)}
                            onChange={() => toggleEmployeeSelection(emp._id)}
                          />
                          <label className="form-check-label small" htmlFor={`emp-${emp._id}`}>
                            <strong>{emp.name}</strong> &bull; {emp.designation} ({emp.department})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top p-3 bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm px-3"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom btn-sm px-4">
                    Create & Assign
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
