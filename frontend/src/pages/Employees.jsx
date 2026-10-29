import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  XCircle,
  Briefcase
} from 'lucide-react';

export const Employees = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Engineer',
    phone: '',
    address: '',
    salary: 50000,
    status: 'Active'
  });
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const url =
        role === 'manager'
          ? '/employees/my-team'
          : `/employees?department=${departmentFilter}&role=${roleFilter}&search=${search}`;
      const res = await API.get(url);
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [departmentFilter, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      role: 'employee',
      department: 'Engineering',
      designation: 'Software Engineer',
      phone: '',
      address: '',
      salary: 50000,
      status: 'Active'
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (emp) => {
    setIsEditing(true);
    setCurrentId(emp._id);
    setFormData({
      name: emp.name,
      email: emp.email,
      password: '',
      role: emp.role,
      department: emp.department,
      designation: emp.designation,
      phone: emp.phone || '',
      address: emp.address || '',
      salary: emp.salary || 50000,
      status: emp.status || 'Active'
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (isEditing) {
        await API.put(`/employees/${currentId}`, formData);
        setActionSuccess('Employee profile updated successfully!');
      } else {
        await API.post('/employees', formData);
        setActionSuccess('New employee registered into StaffSync!');
      }
      setShowModal(false);
      fetchEmployees();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving employee details');
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from StaffSync?`)) {
      return;
    }
    try {
      await API.delete(`/employees/${id}`);
      setActionSuccess(`${name} removed successfully.`);
      fetchEmployees();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing employee');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            {role === 'manager'
              ? 'My Team Members'
              : role === 'hr'
              ? 'Employee Records & Directory'
              : 'Organization Staff Directory'}
          </h4>
          <p className="text-muted small mb-0">
            {role === 'hr'
              ? 'Add, edit, manage permissions, and assign departments across the organization.'
              : 'View member contact info, roles, and current availability.'}
          </p>
        </div>

        {role === 'hr' && (
          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary-custom d-flex align-items-center gap-2"
          >
            <UserPlus size={18} />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show small py-2 mb-3" role="alert">
          {actionSuccess}
          <button type="button" className="btn-close py-2" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="card-custom p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-3">
                Search
              </button>
            </div>
          </div>

          {role !== 'manager' && (
            <>
              <div className="col-6 col-md-3">
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

              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="employee">Employees</option>
                  <option value="manager">Managers</option>
                  <option value="hr">HR Personnel</option>
                </select>
              </div>
            </>
          )}

          <div className="col text-end">
            <span className="text-muted small fw-semibold">
              Total: {employees.length}
            </span>
          </div>
        </form>
      </div>

      {/* Employees Table / Cards */}
      <div className="card-custom overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Users size={36} className="text-muted mb-2 opacity-50" />
            <h6>No employee records found.</h6>
            <span className="small">Try adjusting search parameters or add a new record.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department & Role</th>
                  <th>Contact Info</th>
                  {role === 'hr' && <th>Salary</th>}
                  <th>Status</th>
                  {role === 'hr' && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            emp.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=0284c7&color=fff`
                          }
                          alt={emp.name}
                          className="rounded-circle border"
                          style={{ width: 38, height: 38, objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{emp.name}</div>
                          <span className="text-muted small">{emp.designation}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="badge bg-light text-dark border mb-1">
                          {emp.department}
                        </span>
                      </div>
                      <span
                        className={`badge text-uppercase ${
                          emp.role === 'hr'
                            ? 'badge-role-hr'
                            : emp.role === 'manager'
                            ? 'badge-role-manager'
                            : 'badge-role-employee'
                        }`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td>
                      <div className="small d-flex align-items-center gap-1 text-muted mb-1">
                        <Mail size={13} />
                        <span>{emp.email}</span>
                      </div>
                      {emp.phone && (
                        <div className="small d-flex align-items-center gap-1 text-muted">
                          <Phone size={13} />
                          <span>{emp.phone}</span>
                        </div>
                      )}
                    </td>
                    {role === 'hr' && (
                      <td className="fw-semibold text-dark">
                        ${emp.salary ? emp.salary.toLocaleString() : '50,000'}/yr
                      </td>
                    )}
                    <td>
                      <span
                        className={`badge ${
                          emp.status === 'Active'
                            ? 'badge-status-approved'
                            : emp.status === 'On Leave'
                            ? 'badge-status-pending'
                            : 'badge-status-rejected'
                        }`}
                      >
                        {emp.status || 'Active'}
                      </span>
                    </td>
                    {role === 'hr' && (
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleOpenEditModal(emp)}
                            className="btn btn-outline-secondary"
                            title="Edit Employee"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                            className="btn btn-outline-danger"
                            title="Remove Employee"
                            disabled={emp._id === user._id}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold">
                  {isEditing ? `Edit Profile: ${formData.name}` : 'Register New Employee'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveEmployee}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger small py-2 mb-3">{formError}</div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Work Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isEditing}
                      />
                    </div>

                    {!isEditing && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Temporary Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required={!isEditing}
                        />
                      </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Role *</label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="employee">Staff Employee</option>
                        <option value="manager">Team Manager</option>
                        <option value="hr">HR Administrator</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department *</label>
                      <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Marketing & Sales">Marketing & Sales</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Designation *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Annual Salary ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Employment Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Residential Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
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
                    {isEditing ? 'Save Changes' : 'Create Employee'}
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
