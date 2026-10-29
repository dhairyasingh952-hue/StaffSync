import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Megaphone,
  PlusCircle,
  Trash2,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Tag
} from 'lucide-react';

export const Announcements = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/announcements', formData);
      setSuccess('Announcement published to all organization members!');
      setShowModal(false);
      setFormData({ title: '', content: '', category: 'General', priority: 'Medium' });
      fetchAnnouncements();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error publishing announcement');
    }
  };

  const handleDeleteAnnouncement = async (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      await API.delete(`/announcements/${id}`);
      setSuccess('Announcement deleted.');
      fetchAnnouncements();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting announcement');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Company Announcements & Noticeboard</h4>
          <p className="text-muted small mb-0">
            Stay aligned with executive announcements, policy revisions, holidays, and team events.
          </p>
        </div>

        {role === 'hr' && (
          <button
            onClick={() => {
              setError('');
              setShowModal(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show small py-2 mb-3" role="alert">
          {success}
          <button type="button" className="btn-close py-2" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Announcements List */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <Megaphone size={40} className="text-muted mb-2 opacity-50" />
            <h6>No announcements posted yet.</h6>
            <span className="small">Notices created by HR will appear here immediately.</span>
          </div>
        ) : (
          announcements.map((ann) => (
            <div key={ann._id} className="col-12">
              <div className="card-custom p-4">
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h5 className="fw-bold text-dark mb-0">{ann.title}</h5>
                    <span
                      className={`badge ${
                        ann.priority === 'High'
                          ? 'bg-danger'
                          : ann.priority === 'Medium'
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                    <span className="badge bg-light text-dark border">
                      <Tag size={11} className="me-1" />
                      {ann.category}
                    </span>
                  </div>

                  {role === 'hr' && (
                    <button
                      onClick={() => handleDeleteAnnouncement(ann._id, ann.title)}
                      className="btn btn-outline-danger btn-sm border-0"
                      title="Delete Announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <p className="text-secondary mb-3" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {ann.content}
                </p>

                <div className="pt-3 border-top d-flex flex-wrap align-items-center justify-content-between small text-muted">
                  <span>
                    Posted by <strong>{ann.authorName}</strong> (HR Admin)
                  </span>
                  <span>{new Date(ann.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Announcement Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold">Publish Company Announcement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateAnnouncement}>
                <div className="modal-body p-4">
                  {error && <div className="alert alert-danger small py-2 mb-3">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Q4 Company All-Hands Meeting & Venue"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="Policy">Policy</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Event">Event</option>
                        <option value="Urgent">Urgent Notice</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Priority Level</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Announcement Content *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Write the full announcement text here..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    ></textarea>
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
                    Publish Now
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
