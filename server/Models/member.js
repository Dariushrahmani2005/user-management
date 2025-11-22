import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  gender: { type: String, enum: ['مرد', 'زن', 'دیگر'], required: true },
  termsAccepted: { type: Boolean, required: true },
  // فیلدهای جدید اضافه شده:
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  profileImage: { type: String }
}, { 
  timestamps: true 
});

// ایندکس برای جستجوی بهتر
memberSchema.index({ email: 1, phoneNumber: 1 });
memberSchema.index({ isActive: 1 });
memberSchema.index({ role: 1 });

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

export default Member;