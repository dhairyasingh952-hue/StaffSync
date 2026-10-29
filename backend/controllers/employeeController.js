const bcrypt = require('bcryptjs');
const storage = require('../services/storage');

// @desc    Get all employees (HR can see all with salary, manager/employees can see directory)
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const { department, role, search, status } = req.query;
    let employees = storage.getUsers();

    if (department && department !== 'All') {
      employees = employees.filter((e) => e.department === department);
    }
    if (role && role !== 'All') {
      employees = employees.filter((e) => e.role === role);
    }
    if (status && status !== 'All') {
      employees = employees.filter((e) => e.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    // Hide password and (if not HR) mask salary
    const sanitized = employees.map((e) => {
      const { password, ...rest } = e;
      if (req.user.role !== 'hr') {
        delete rest.salary;
      }
      return rest;
    });

    res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving employees' });
  }
};

// @desc    Get team members under the logged-in manager
// @route   GET /api/employees/my-team
// @access  Private (Manager only)
const getMyTeam = async (req, res) => {
  try {
    const managerId = req.user._id;
    const allUsers = storage.getUsers();

    // A user is in the team if managerId matches or if department matches and role is employee
    const team = allUsers.filter(
      (u) =>
        u._id !== managerId &&
        (u.managerId === managerId || (u.department === req.user.department && u.role === 'employee'))
    );

    const sanitized = team.map(({ password, ...rest }) => rest);
    res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving team members' });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = storage.getUserById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const { password, ...data } = employee;
    if (req.user.role !== 'hr' && req.user._id !== employee._id) {
      delete data.salary;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving employee' });
  }
};

// @desc    Create employee (HR only)
// @route   POST /api/employees
// @access  Private (HR)
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      designation,
      phone,
      address,
      salary,
      managerId,
      managerName,
      status
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const newEmp = storage.createUser({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'employee',
      department: department || 'Engineering',
      designation: designation || 'Staff Member',
      phone: phone || '',
      address: address || '',
      salary: Number(salary) || 55000,
      managerId: managerId || null,
      managerName: managerName || 'Unassigned',
      status: status || 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff`,
      joiningDate: new Date().toISOString().split('T')[0]
    });

    const { password: _, ...data } = newEmp;
    res.status(201).json({ success: true, message: 'Employee created successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating employee' });
  }
};

// @desc    Update employee details (HR only)
// @route   PUT /api/employees/:id
// @access  Private (HR)
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = storage.getUserById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const updated = storage.updateUser(id, updates);
    const { password: _, ...data } = updated;

    res.json({ success: true, message: 'Employee updated successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating employee' });
  }
};

// @desc    Delete/Deactivate employee (HR only)
// @route   DELETE /api/employees/:id
// @access  Private (HR)
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user._id === id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const success = storage.deleteUser(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting employee' });
  }
};

module.exports = {
  getAllEmployees,
  getMyTeam,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
