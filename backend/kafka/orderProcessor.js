const { Kafka } = require('kafkajs');
const User = require('../models/User');
const Order = require('../models/Order');
const Stock = require('../models/Stock');

const kafka = new Kafka({
  clientId: 'order-processor',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-processor-group' });

async function orderConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());

      console.log(`🛒 Processing order:`, order);

      try {
        const { userId, stockName, quantity, type } = order;

        const stock = await Stock.findOne({ Name: stockName });
        if (!stock) return;

        const price = stock.close;
        const totalCost = quantity * price;
        const user = await User.findById(userId);
        if (!user) return;

        if (type === 'BUY') {
          if (user.balance < totalCost) return;

          user.balance -= totalCost;
          const ownedStock = user.portfolio.find(s => s.stockName === stockName);

          if (ownedStock) {
            const totalValue = (ownedStock.quantity * ownedStock.boughtPrice) + (quantity * price);
            const newQuantity = ownedStock.quantity + quantity;
            ownedStock.boughtPrice = totalValue / newQuantity;
            ownedStock.quantity = newQuantity;
          } else {
            user.portfolio.push({ stockName, quantity, boughtPrice: price });
          }
        } else if (type === 'SELL') {
          const ownedStock = user.portfolio.find(s => s.stockName === stockName);
          if (!ownedStock || ownedStock.quantity < quantity) return;

          ownedStock.quantity -= quantity;
          user.balance += totalCost;

          if (ownedStock.quantity === 0) {
            user.portfolio = user.portfolio.filter(s => s.stockName !== stockName);
          }
        }

        await user.save();
        await Order.create({ userId, stockName, quantity, price, type });

        console.log(`✅ Order executed for ${stockName} (${type})`);
      } catch (err) {
        console.error("❌ Order processing failed:", err.message);
      }
    }
  });
}

module.exports = { orderConsumer };
