import cors from "cors";
import express, { Request, Response } from "express";
import { Consumer, Producer } from "kafkajs";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { HandleErrorWithLogger, httpLogger, MessageBroker } from "./utils";

export const ExpressApp = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(httpLogger);

  // 1st step: connect to the producer and consumer
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", () => {
    console.log("producer connected")
  })

  const consumer = await MessageBroker.connectConsumer<Consumer>();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected")
  })

  // 2nd step: subscribe to the topic or publish to the topic
  await MessageBroker.subscribe((message) => {
    console.log("message received", message)
  }, "OrderEvents")

  app.use("/api", cartRoutes);
  app.use("/api", orderRoutes);

  app.use("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from Order Service" });
  });

  app.use(HandleErrorWithLogger);

  return app;
};
