import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ხელოსანი', 'დამკვეთი'],
    required: true
  }, 
  profId: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  notificationDevices: {
    type: [String], 
    default: []
  },
  lastname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    sparse: true,
  },
  email: {
    type: String,
    sparse: true
 },
  password: {
    type: String,
    required: true
  }
},{timestamps: true});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);