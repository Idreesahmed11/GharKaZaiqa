import { Router } from 'express';
import Order from '../models/Order.js';
import Food from '../models/Food.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, deliveryAddress, phone } = req.body;
    if (!Array.isArray(items) || !items.length || !deliveryAddress || !phone) return res.status(400).json({ message: 'Items, delivery address and phone are required' });
    let subtotal = 0; const normalizedItems = [];
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      if (!food || !food.isAvailable) return res.status(400).json({ message: 'One of the selected dishes is unavailable' });
      subtotal += food.price * quantity;
      normalizedItems.push({ food: food._id, name: food.name, quantity, unitPrice: food.price, chef: food.chef });
    }
    const deliveryFee = 150;
    const order = await Order.create({ customer: req.user._id, items: normalizedItems, deliveryAddress, phone, subtotal, deliveryFee, total: subtotal + deliveryFee });
    res.status(201).json({ order });
  } catch (e) { next(e); }
});
router.get('/mine', protect, async (req, res, next) => {
  try {
    let query = { customer: req.user._id };
    if (req.user.role === 'admin') query = {};
    else if (req.user.role === 'chef') query = { 'items.chef': req.user._id };
    const orders = await Order.find(query).populate('customer', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json({ orders });
  } catch (e) { next(e); }
});
router.patch('/:id/status', protect, allowRoles('chef', 'admin'), async (req, res, next) => {
  try {
    const allowed = ['accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && !order.items.some(item => String(item.chef) === String(req.user._id))) return res.status(403).json({ message: 'Not allowed to update this order' });
    order.status = req.body.status; await order.save(); res.json({ order });
  } catch (e) { next(e); }
});
export default router;
