import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 1000 },
  category: { type: String, required: true, enum: ['Desi', 'Biryani', 'BBQ', 'Vegetarian', 'Snacks', 'Desserts'] },
  price: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  prepTime: { type: String, default: '30-40 min' },
  portions: { type: Number, default: 1, min: 1 },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8, min: 0, max: 5 }
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);
