import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, isVerified: user.isVerified });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', phone = '' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (!['customer', 'chef'].includes(role)) return res.status(400).json({ message: 'Invalid public account role' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12), role, phone });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
