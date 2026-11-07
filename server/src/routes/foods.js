import { Router } from 'express';
import Food from '../models/Food.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
    const foods = await Food.find(filter).populate('chef', 'name isVerified').sort({ createdAt: -1 }).limit(100);
    res.json({ foods });
  } catch (e) { next(e); }
});
router.get('/mine', protect, allowRoles('chef', 'admin'), async (req, res, next) => {
  try { res.json({ foods: await Food.find(req.user.role === 'admin' ? {} : { chef: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
});
router.post('/', protect, allowRoles('chef', 'admin'), async (req, res, next) => {
  try {
    const food = await Food.create({ ...req.body, chef: req.user._id });
    res.status(201).json({ food });
  } catch (e) { next(e); }
});
router.patch('/:id', protect, allowRoles('chef', 'admin'), async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (req.user.role !== 'admin' && String(food.chef) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing' });
    Object.assign(food, req.body);
    await food.save(); res.json({ food });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, allowRoles('chef', 'admin'), async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (req.user.role !== 'admin' && String(food.chef) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing' });
    await food.deleteOne(); res.json({ message: 'Food listing deleted' });
  } catch (e) { next(e); }
});
export default router;
