const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { kafkaConsumer } = require('./kafka/consumer');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Server + Socket setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Kafka Consumer with Socket
kafkaConsumer(io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/stocks', require('./routes/stocks'));

app.post('/api/stream', (req, res) => {
    const tick = req.body;
    console.log('📥 Received from Spark:', tick);
    io.emit('stockUpdate', tick); // this will be received by Vue via Socket.IO
    res.sendStatus(200);
  });

// Start server
server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
