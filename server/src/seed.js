import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Food from './models/Food.js';

const sampleFoods = [
  ['Sindhi Chicken Biryani','Biryani',520,'Aromatic basmati rice with a homemade Sindhi masala.','https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85'],
  ['Chicken Karahi','Desi',850,'Freshly cooked karahi with ginger, tomatoes and green chilli.','https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85'],
  ['Daal Chawal Combo','Vegetarian',320,'Comforting daal, steamed rice, salad and homemade achar.','https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85'],
  ['Chicken Seekh Kabab','BBQ',450,'Juicy, hand-shaped kababs with mint chutney.','https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=85'],
  ['Aloo Samosa','Snacks',260,'Crispy Samosa sced potato filling and raita.','https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85'],
  ['Homemade Kheer','Desserts',220,'Slow-cooked creamy rice pudding with cardamom.','https://images.unsplash.com/photo-1571167530149-c1105c5e1b9d?auto=format&fit=crop&w=900&q=85'],
  ['Sai Bhaji & Roti','Vegetarian',380,'Traditional Sindhi spinach and lentil dish with fresh roti.','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85'],
  ['Chicken Pulao','Biryani',480,'Light, fragrant pulao cooked with whole spices.','https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85']
];
try {
  await connectDB();
  let chef = await User.findOne({ role: 'chef' });
  if (!chef) chef = await User.create({ name: 'Demo Home Chef', email: 'demo.chef@gharkazaiqa.local', password: await bcrypt.hash('DemoChefPassword123!', 12), role: 'chef', isVerified: false });
  if (await Food.countDocuments() === 0) {
    await Food.insertMany(sampleFoods.map(([name, category, price, description, image]) => ({ chef: chef._id, name, category, price, description, image, isAvailable: true, prepTime: '30-40 min' })));
    console.log('Sample foods inserted. Create a real chef account before using chef features.');
  } else console.log('Foods already exist; seed skipped.');
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
