import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'chef', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
