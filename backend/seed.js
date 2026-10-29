const storage = require('./services/storage');

console.log('--- StaffSync HRM Database Seeding ---');
storage.resetToDefaults();
console.log('✅ Sample data successfully initialized:');
console.log(' - HR Account:      hr@staffsync.com / password123');
console.log(' - Manager Account: manager@staffsync.com / password123');
console.log(' - Employee 1:      alex@staffsync.com / password123');
console.log(' - Employee 2:      priya@staffsync.com / password123');
console.log(' - Employee 3:      john@staffsync.com / password123');
console.log(' - Departments:     4 initial departments');
console.log(' - Announcements:   3 published announcements');
console.log(' - Attendance:      5 sample clock-in records');
console.log(' - Leaves:          3 sample leave applications');
console.log(' - Training:        2 enrolled corporate modules');
console.log('Seeding complete.');
