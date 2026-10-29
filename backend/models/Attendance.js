const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: 'General'
    },
    date: {
      type: String, // format: YYYY-MM-DD
      required: true
    },
    clockIn: {
      type: Date,
      default: Date.now
    },
    clockOut: {
      type: Date,
      default: null
    },
    durationHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Present', 'Late', 'Half Day', 'Absent'],
      default: 'Present'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
