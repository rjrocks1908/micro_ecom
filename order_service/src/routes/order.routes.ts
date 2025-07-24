import { Request, Response, Router } from "express";
import { MessageBroker } from "../utils";
import { OrderEvent } from "../types";

const router = Router();

router.post("/order", async (req: Request, res: Response) => {
  // order create logic

  // 3rd step: publish the message
  await MessageBroker.publish({
    topic: "OrderEvents",
    headers: {
      token: req.headers.authorization,
    },
    event: OrderEvent.CREATE_ORDER,
    message: {
      orderId: 1,
      items: [
        {
          productId: 1,
          qty: 1,
        },
        {
          productId: 2,
          qty: 2,
        },
      ],
    },
  });
  res.json({ message: "Order created successfully" });
});

router.get("/order", async (req: Request, res: Response) => {
  res.json({ message: "Order created successfully" });
});

router.get("/order/:id", async (req: Request, res: Response) => {
  res.json({ message: "Order created successfully" });
});

router.delete("/order/:id", async (req: Request, res: Response) => {
  res.json({ message: "Order created successfully" });
});

export default router;
