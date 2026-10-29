const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: 'All'
    },
    assignedTo: [
      {
        userId: String,
        userName: String,
        status: {
          type: String,
          enum: ['Not Started', 'In Progress', 'Completed'],
          default: 'Not Started'
        },
        completedAt: Date
      }
    ],
    managerId: {
      type: String,
      required: true
    },
    managerName: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    deadline: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Upcoming', 'In Progress', 'Completed'],
      default: 'In Progress'
    },
    materialsUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Training', trainingSchema);
