const bcrypt = require('bcryptjs');

const getHashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const defaultPasswordHash = getHashedPassword('password123');

const departmentsData = [
  {
    _id: 'dep_1',
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development, infrastructure, and technical architecture.',
    managerName: 'David Miller'
  },
  {
    _id: 'dep_2',
    name: 'Human Resources',
    code: 'HR',
    description: 'Talent acquisition, employee welfare, payroll, and organizational policies.',
    managerName: 'Sarah Jenkins'
  },
  {
    _id: 'dep_3',
    name: 'Product & Design',
    code: 'PD',
    description: 'User experience research, UI design, and product roadmap execution.',
    managerName: 'David Miller'
  },
  {
    _id: 'dep_4',
    name: 'Marketing & Sales',
    code: 'MKT',
    description: 'Brand awareness, enterprise outreach, and client communications.',
    managerName: 'Sarah Jenkins'
  }
];

const usersData = [
  {
    _id: 'user_hr_01',
    name: 'Sarah Jenkins',
    email: 'hr@staffsync.com',
    password: defaultPasswordHash,
    role: 'hr',
    department: 'Human Resources',
    designation: 'Head of People & HR Director',
    phone: '+1 (555) 234-5678',
    address: '100 Corporate Blvd, Suite 400, San Francisco, CA',
    salary: 95000,
    joiningDate: '2022-01-15',
    managerId: null,
    managerName: 'Executive Board',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { casual: 12, sick: 10, annual: 18 }
  },
  {
    _id: 'user_mgr_01',
    name: 'David Miller',
    email: 'manager@staffsync.com',
    password: defaultPasswordHash,
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Team Lead',
    phone: '+1 (555) 345-6789',
    address: '742 Evergreen Terrace, San Francisco, CA',
    salary: 110000,
    joiningDate: '2022-06-01',
    managerId: 'user_hr_01',
    managerName: 'Sarah Jenkins',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { casual: 10, sick: 8, annual: 15 }
  },
  {
    _id: 'user_emp_01',
    name: 'Alex Morgan',
    email: 'alex@staffsync.com',
    password: defaultPasswordHash,
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Full Stack Developer',
    phone: '+1 (555) 456-7890',
    address: '221B Baker Street, San Francisco, CA',
    salary: 85000,
    joiningDate: '2023-02-10',
    managerId: 'user_mgr_01',
    managerName: 'David Miller',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { casual: 9, sick: 10, annual: 12 }
  },
  {
    _id: 'user_emp_02',
    name: 'Priya Sharma',
    email: 'priya@staffsync.com',
    password: defaultPasswordHash,
    role: 'employee',
    department: 'Product & Design',
    designation: 'UI/UX Product Designer',
    phone: '+1 (555) 567-8901',
    address: '45 Mission District, San Francisco, CA',
    salary: 78000,
    joiningDate: '2023-04-15',
    managerId: 'user_mgr_01',
    managerName: 'David Miller',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { casual: 11, sick: 9, annual: 14 }
  },
  {
    _id: 'user_emp_03',
    name: 'John Reynolds',
    email: 'john@staffsync.com',
    password: defaultPasswordHash,
    role: 'employee',
    department: 'Engineering',
    designation: 'DevOps & Cloud Specialist',
    phone: '+1 (555) 678-9012',
    address: '88 Market St, San Francisco, CA',
    salary: 88000,
    joiningDate: '2023-08-01',
    managerId: 'user_mgr_01',
    managerName: 'David Miller',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { casual: 12, sick: 10, annual: 15 }
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

const attendanceData = [
  {
    _id: 'att_01',
    userId: 'user_emp_01',
    userName: 'Alex Morgan',
    department: 'Engineering',
    date: todayStr,
    clockIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    clockOut: null,
    durationHours: 4,
    status: 'Present',
    notes: 'Working on HRMS Frontend Dashboard components'
  },
  {
    _id: 'att_02',
    userId: 'user_emp_02',
    userName: 'Priya Sharma',
    department: 'Product & Design',
    date: todayStr,
    clockIn: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    clockOut: null,
    durationHours: 5,
    status: 'Present',
    notes: 'UI Design revisions for Leave Approval flow'
  },
  {
    _id: 'att_03',
    userId: 'user_mgr_01',
    userName: 'David Miller',
    department: 'Engineering',
    date: todayStr,
    clockIn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    clockOut: null,
    durationHours: 6,
    status: 'Present',
    notes: 'Team standup and quarterly review sprint'
  },
  {
    _id: 'att_04',
    userId: 'user_emp_01',
    userName: 'Alex Morgan',
    department: 'Engineering',
    date: yesterdayStr,
    clockIn: `${yesterdayStr}T09:00:00.000Z`,
    clockOut: `${yesterdayStr}T17:30:00.000Z`,
    durationHours: 8.5,
    status: 'Present',
    notes: 'Full workday completed'
  },
  {
    _id: 'att_05',
    userId: 'user_emp_03',
    userName: 'John Reynolds',
    department: 'Engineering',
    date: yesterdayStr,
    clockIn: `${yesterdayStr}T09:45:00.000Z`,
    clockOut: `${yesterdayStr}T18:00:00.000Z`,
    durationHours: 8.25,
    status: 'Late',
    notes: 'Traffic delay on highway 101'
  }
];

const leavesData = [
  {
    _id: 'leave_01',
    userId: 'user_emp_01',
    userName: 'Alex Morgan',
    department: 'Engineering',
    leaveType: 'Annual',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: 4,
    reason: 'Family vacation and attending technical conference.',
    status: 'Pending',
    reviewedBy: null,
    reviewerComments: ''
  },
  {
    _id: 'leave_02',
    userId: 'user_emp_02',
    userName: 'Priya Sharma',
    department: 'Product & Design',
    leaveType: 'Sick',
    startDate: yesterdayStr,
    endDate: yesterdayStr,
    totalDays: 1,
    reason: 'Severe migraine headache; medical prescription attached.',
    status: 'Approved',
    reviewedBy: 'David Miller',
    reviewerComments: 'Approved. Get well soon!'
  },
  {
    _id: 'leave_03',
    userId: 'user_emp_03',
    userName: 'John Reynolds',
    department: 'Engineering',
    leaveType: 'Casual',
    startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: 2,
    reason: 'Personal family ceremony.',
    status: 'Pending',
    reviewedBy: null,
    reviewerComments: ''
  }
];

const announcementsData = [
  {
    _id: 'ann_01',
    title: 'StaffSync HR Portal Officially Live!',
    content: 'Welcome to the new StaffSync Human Resource Management System. Employees can now easily submit leave requests, log daily attendance, and access training materials directly.',
    category: 'General',
    priority: 'High',
    authorName: 'Sarah Jenkins',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ann_02',
    title: 'Q4 Health & Wellness Benefits Update',
    content: 'All full-time staff members are eligible for updated annual health checkups and gym allowance reimbursements starting this month. Please submit receipts through HR.',
    category: 'Policy',
    priority: 'Medium',
    authorName: 'Sarah Jenkins',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'ann_03',
    title: 'Upcoming Tech Upskilling & Cloud Workshop',
    content: 'David Miller will be conducting an interactive hands-on workshop on Cloud-native CI/CD workflows next Thursday at 3 PM. Registration is open on the Training tab.',
    category: 'Event',
    priority: 'Medium',
    authorName: 'David Miller',
    createdAt: new Date().toISOString()
  }
];

const trainingsData = [
  {
    _id: 'train_01',
    title: 'Modern Full Stack Web Application Architecture',
    description: 'Mastering RESTful APIs, JWT stateful security, responsive Bootstrap layouts, and MongoDB data modeling.',
    department: 'Engineering',
    assignedTo: [
      { userId: 'user_emp_01', userName: 'Alex Morgan', status: 'In Progress' },
      { userId: 'user_emp_03', userName: 'John Reynolds', status: 'Not Started' }
    ],
    managerId: 'user_mgr_01',
    managerName: 'David Miller',
    startDate: yesterdayStr,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'In Progress',
    materialsUrl: 'https://staffsync.example.com/training/fullstack-guide'
  },
  {
    _id: 'train_02',
    title: 'Enterprise Security, Compliance & Data Privacy (GDPR/SOC2)',
    description: 'Mandatory company-wide training covering sensitive credential hygiene, token expiry, and user data privacy.',
    department: 'All',
    assignedTo: [
      { userId: 'user_emp_01', userName: 'Alex Morgan', status: 'Completed', completedAt: yesterdayStr },
      { userId: 'user_emp_02', userName: 'Priya Sharma', status: 'Completed', completedAt: yesterdayStr },
      { userId: 'user_emp_03', userName: 'John Reynolds', status: 'In Progress' }
    ],
    managerId: 'user_mgr_01',
    managerName: 'David Miller',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'In Progress',
    materialsUrl: 'https://staffsync.example.com/training/security-compliance'
  }
];

module.exports = {
  departmentsData,
  usersData,
  attendanceData,
  leavesData,
  announcementsData,
  trainingsData
};
