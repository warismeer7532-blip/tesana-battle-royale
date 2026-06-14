require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/users');
const GameServer = require('./game/GameServer');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Game Server Instance
const gameServer = new GameServer(io);

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`🎮 Player connected: ${socket.id}`);

  // Player joins match
  socket.on('join-match', (data) => {
    gameServer.addPlayer(socket.id, data);
  });

  // Player movement
  socket.on('player-move', (data) => {
    gameServer.updatePlayerPosition(socket.id, data);
    socket.broadcast.emit('player-position-update', {
      playerId: socket.id,
      position: data
    });
  });

  // Player fires weapon
  socket.on('player-shoot', (data) => {
    gameServer.handlePlayerShoot(socket.id, data);
    socket.broadcast.emit('enemy-shoot', {
      playerId: socket.id,
      target: data.target,
      damage: data.damage
    });
  });

  // Player uses ability
  socket.on('use-ability', (data) => {
    gameServer.usePlayerAbility(socket.id, data.abilityId);
    socket.broadcast.emit('player-ability-used', {
      playerId: socket.id,
      ability: data.abilityId
    });
  });

  // Player takes damage
  socket.on('take-damage', (data) => {
    gameServer.applyDamage(socket.id, data.damage, data.source);
  });

  // Player disconnects
  socket.on('disconnect', () => {
    console.log(`👋 Player disconnected: ${socket.id}`);
    gameServer.removePlayer(socket.id);
  });
});

// Start Server
const PORT = process.env.SERVER_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 TESANA Battle Royale Server running on port ${PORT}`);
  console.log(`📊 WebSocket listening for game events`);
});

module.exports = { app, server, io };
