import mongoose, { Schema, model, models } from 'mongoose';

const TeacherSchema = new Schema({
  // Unique identifier
  aadhar_number: { type: String, required: true, unique: true },

  // Profile
  profilePic: { type: String, default: '' },

  // Personal Information
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  gender: { type: String, required: true },
  blood_group: { type: String, default: '' },
  emergency_contact_name: { type: String, default: '' },
  emergency_contact_relation: { type: String, default: '' },
  emergency_contact_mobile: { type: String, default: '' },

  // Address
  street: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },

  // Educational Qualifications
  tenth: {
    board: { type: String, required: true },
    year: { type: String, required: true },
    percentage: { type: String, required: true },
    certificate: { type: String, default: '' },
  },

  twelfth: {
    board: { type: String, required: true },
    year: { type: String, required: true },
    percentage: { type: String, required: true },
    certificate: { type: String, default: '' },
  },

  ug: {
    degree: { type: String, required: true },
    university: { type: String, required: true },
    year: { type: String, required: true },
    percentage: { type: String, required: true },
    certificate: { type: String, default: '' },
  },

  pg: [{
    degree: { type: String },
    university: { type: String },
    year: { type: String },
    percentage: { type: String },
    certificate: { type: String, default: '' },
  }],

  // Professional Qualifications
  bed: {
    board: { type: String, default: '' },
    year: { type: String, default: '' },
    percentage: { type: String, default: '' },
    certificate: { type: String, default: '' },
  },

  med: {
    board: { type: String, default: '' },
    year: { type: String, default: '' },
    percentage: { type: String, default: '' },
    certificate: { type: String, default: '' },
  },

  // Previous Employment
  previous_school_name: { type: String, default: '' },
  previous_classes_taught: { type: [String], default: [] },
  previous_subjects_taught: { type: [String], default: [] },

  // Current School Details
  current_school: { type: String, required: true },
  current_branch: { type: String, required: true },
  current_class: { type: String, default: '' },
  current_subject: { type: String, default: '' },

  // Bank & Official Details
  bank_name: { type: String, required: true },
  account_number: { type: String, required: true },
  ifsc_code: { type: String, required: true },
  pan_number: { type: String, required: true },
  pf_number: { type: String, default: '' },
  esi_number: { type: String, default: '' },

  // Status
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Delete any existing model to prevent caching issues
if (models.Teacher) {
  delete models.Teacher;
}

export const Teacher = model('Teacher', TeacherSchema);
