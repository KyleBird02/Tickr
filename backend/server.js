const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { kafkaConsumer } = require('./kafka/consumer');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const orderRoutes = require('./routes/orders');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected');
});

// Kafka Consumer that emits to Socket.io
kafkaConsumer(io);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
