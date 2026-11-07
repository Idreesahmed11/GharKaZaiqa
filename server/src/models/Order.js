import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }, name: String, quantity: { type: Number, min: 1 }, unitPrice: { type: Number, min: 0 }, chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  deliveryAddress: { type: String, required: true, maxlength: 500 },
  phone: { type: String, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 150, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'], default: 'unpaid' },
  paymentProvider: { type: String, default: 'not_configured' },
  paymentReference: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
