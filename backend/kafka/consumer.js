const { Kafka } = require('kafkajs');
const Stock = require('../models/Stock');

const kafka = new Kafka({
  clientId: 'stock-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'stock-group' });

async function kafkaConsumer(io) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'stock-ticks', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const stock = JSON.parse(message.value.toString());
      console.log('Received stock:', stock);

      // Save stock to MongoDB (upsert operation)
      await Stock.findOneAndUpdate(
        { Name: stock.Name },
        { $set: stock },
        { upsert: true }
      );

      // Emit stock update to all connected frontend clients
      io.emit('stockUpdate', stock);
    }
  });
}

module.exports = { kafkaConsumer };
