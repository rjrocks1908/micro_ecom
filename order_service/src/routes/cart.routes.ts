import { NextFunction, Request, Response, Router } from "express";
import {
  CreateCart,
  DeleteCart,
  GetCart,
  UpdateCart,
} from "../service/cart.service";
import { CartRepository } from "../respository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRequestSchema } from "../dto/cartRequest.dto";

const router = Router();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

router.post("/cart", authMiddleware, async (req: Request, res: Response) => {
  try {
    const err = ValidateRequest<CartRequestInput>(req.body, CartRequestSchema);

    if (err) {
      res.status(400).json({ error: err });
    }

    const response = await CreateCart(
      req.body as CartRequestInput,
      CartRepository
    );
    res.json(response);
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.get("/cart", async (req: Request, res: Response) => {
  const response = await GetCart(req.body.customerId, CartRepository);
  res.json(response);
});

router.patch("/cart/:lineItemId", async (req: Request, res: Response) => {
  const lineItemId = req.params.lineItemId;
  const response = await UpdateCart(
    {
      id: +lineItemId,
      qty: req.body.qty,
    },
    CartRepository
  );
  res.json(response);
});

router.delete("/cart/:lineItemId", async (req: Request, res: Response) => {
  const lineItemId = req.params.lineItemId;
  const response = await DeleteCart(+lineItemId, CartRepository);
  res.json(response);
});

export default router;
