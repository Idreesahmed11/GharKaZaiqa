import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function configureChat(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch { next(new Error('Invalid chat token')); }
  });

  io.on('connection', socket => {
    socket.join(`user:${socket.user._id}`);
    socket.on('chat:join', async ({ otherUserId }) => {
      if (!otherUserId) return;
      const conversationId = [String(socket.user._id), String(otherUserId)].sort().join(':');
      socket.join(`conversation:${conversationId}`);
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(100).lean();
      socket.emit('chat:history', messages);
    });
    socket.on('chat:send', async ({ receiverId, text }) => {
      try {
        const cleanText = String(text || '').trim();
        if (!receiverId || !cleanText || cleanText.length > 2000) return;
        const receiver = await User.findById(receiverId);
        if (!receiver) return;
        const conversationId = [String(socket.user._id), String(receiver._id)].sort().join(':');
        const message = await Message.create({ conversationId, sender: socket.user._id, receiver: receiver._id, text: cleanText });
        const payload = message.toObject();
        io.to(`conversation:${conversationId}`).emit('chat:message', payload);
        io.to(`user:${receiver._id}`).emit('chat:notification', { conversationId, sender: socket.user.name, text: cleanText.slice(0, 100) });
      } catch { socket.emit('chat:error', { message: 'Message could not be sent' }); }
    });
  });
}
