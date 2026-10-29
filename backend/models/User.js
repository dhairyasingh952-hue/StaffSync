const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['hr', 'manager', 'employee'],
      default: 'employee'
    },
    department: {
      type: String,
      default: 'Engineering'
    },
    designation: {
      type: String,
      default: 'Software Engineer'
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    salary: {
      type: Number,
      default: 50000
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    managerId: {
      type: String,
      default: null
    },
    managerName: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active'
    },
    leaveBalance: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      annual: { type: Number, default: 15 }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
