const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Engineer', 'Supervisor', 'Labor', 'Electrician', 'Plumber', 'Carpenter', 'Mason']
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  assignedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  salary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
