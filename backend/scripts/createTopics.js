const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'topic-creator',
  brokers: ['localhost:9092']
});

async function createTopic(topicName, partitions = 3) {
  const admin = kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();
  if (topics.includes(topicName)) {
    console.log(`⚠️ Topic "${topicName}" already exists`);
  } else {
    await admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: partitions,
        replicationFactor: 1
      }]
    });
    console.log(`✅ Created topic "${topicName}" with ${partitions} partitions`);
  }

  await admin.disconnect();
}

createTopic('stock-ticks');
createTopic('order-events');
