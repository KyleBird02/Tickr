const User = require('../models/User');
const Order = require('../models/Order');
const Stock = require('../models/Stock');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-api',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
producer.connect(); // fire-and-forget at startup

exports.placeOrder = async (req, res) => {
  const { stockName, quantity, type } = req.body;
  const userId = req.user.id;

  try {
    const orderEvent = {
      userId,
      stockName,
      quantity,
      type,
      timestamp: new Date().toISOString()
    };

    await producer.send({
      topic: 'order-events',
      messages: [
        { value: JSON.stringify(orderEvent) }
      ]
    });

    res.status(200).json({ message: 'Order submitted to Kafka' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            balance: user.balance,
            portfolio: user.portfolio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
