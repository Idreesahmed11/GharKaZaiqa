import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = Router();
// Payment scaffold only. Add a supported provider's server SDK, signed webhooks and reconciliation before accepting real money.
router.post('/create-checkout', protect, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (process.env.PAYMENT_PROVIDER === 'not_configured') {
      return res.status(501).json({ code: 'PAYMENT_NOT_CONFIGURED', message: 'Payment gateway is not configured yet. Use cash-on-delivery/demo mode for assignment testing.' });
    }
    return res.status(501).json({ message: 'Connect the selected provider SDK and verified webhook before enabling live payments.' });
  } catch (e) { next(e); }
});
export default router;
