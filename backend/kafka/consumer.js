const { Kafka } = require('kafkajs');
const Stock = require('../models/Stock');

const kafka = new Kafka({
  clientId: 'stock-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'stock-group' });

// Buffer to collect incoming stocks
let stockBuffer = [];

async function kafkaConsumer(io) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'stock-ticks', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const stock = JSON.parse(message.value.toString());

      stockBuffer.push(stock);

      // Emit immediately to frontend
      io.emit('stockUpdate', stock);
    }
  });

  // Periodically flush buffer into MongoDB
  setInterval(async () => {
    if (stockBuffer.length > 0) {
      const bulkOps = stockBuffer.map(stock => ({
        updateOne: {
          filter: { Name: stock.Name },
          update: { $set: stock },
          upsert: true
        }
      }));

      await Stock.bulkWrite(bulkOps);
      console.log(`✅ Bulk inserted/updated ${stockBuffer.length} stocks`);
      
      stockBuffer = []; // Clear buffer
    }
  }, 2000); // Every 2 seconds, write all buffered stocks
}

module.exports = { kafkaConsumer };
