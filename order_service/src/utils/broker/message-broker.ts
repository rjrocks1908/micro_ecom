import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { MessageBrokerType, MessageHandle, PublishType } from "./broker.type";
import { MessageType, OrderEvent, TOPIC_TYPE } from "../../types";

const CLIENT_ID = process.env.CLIENT_ID || "order-service";
const GROUP_ID = process.env.GROUP_ID || "order-service-group";
const KAFKA_BROKERS = [process.env.BROKER_1 || "localhost:9092"];

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

const createTopic = async (topic: string[]) => {
  const topics = topic.map((topic) => ({
    topic: topic,
    numPartitions: 2,
    replicationFactor: 1,
  }));

  const admin = kafka.admin();
  await admin.connect();
  const topicExists = await admin.listTopics();
  for (const t of topics) {
    if (!topicExists.includes(t.topic)) {
      await admin.createTopics({
        topics: [t],
      });
    }
  }
  await admin.disconnect();
};

const connectProducer = async <T>() => {
  await createTopic(["OrderEvents"]);

  if (producer) {
    console.log("Producer already connected with existing connection");
    return producer as unknown as T;
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  console.log("Producer connected with a new connection");
  return producer as unknown as T;
};

const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
  }
};

const publish = async (data: PublishType): Promise<boolean> => {
  const producer = await connectProducer<Producer>();
  const result = await producer.send({
    topic: data.topic,
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message),
      },
    ],
  });

  console.log("Message published", result);
  return result.length > 0;
};

const connectConsumer = async <T>() => {
  if (consumer) {
    console.log("Consumer already connected with existing connection");
    return consumer as unknown as T;
  }

  consumer = kafka.consumer({
    groupId: GROUP_ID,
  });

  await consumer.connect();
  console.log("Consumer connected with a new connection");
  return consumer as unknown as T;
};

const disconnectConsumer = async () => {
  if (consumer) {
    await consumer.disconnect();
  }
};

const subscribe = async (messageHandler: MessageHandle, topic: TOPIC_TYPE) => {
  const consumer = await connectConsumer<Consumer>();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== "OrderEvents") {
        return;
      }

      if (message.key && message.value) {
        const inputMessage: MessageType = {
          headers: message.headers,
          event: message.key.toString() as OrderEvent,
          data: message.value ? JSON.parse(message.value.toString()) : null,
        };
        messageHandler(inputMessage);
        await consumer.commitOffsets([
          { topic, partition, offset: (Number(message.offset) + 1).toString() },
        ]);
      }
    },
  });
};

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
