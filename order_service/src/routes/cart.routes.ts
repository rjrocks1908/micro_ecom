import { NextFunction, Request, Response, Router } from "express";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
import { CartRepository } from "../respository/cart.repository";
import {
  CreateCart,
  DeleteCart,
  GetCart,
  UpdateCart,
} from "../service/cart.service";
import { ValidateRequest } from "../utils/validator";
import { RequestAuthorizer } from "./middleware";

const router = Router();

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const err = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (err) {
        res.status(400).json({ error: err });
        return;
      }

      const input: CartRequestInput = req.body;

      const response = await CreateCart(
        { ...input, customerId: user.id },
        CartRepository
      );
      res.json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
);

router.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const response = await GetCart(user.id, CartRepository);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const lineItemId = req.params.lineItemId;
      const response = await UpdateCart(
        {
          id: +lineItemId,
          qty: req.body.qty,
          customerId: user.id,
        },
        CartRepository
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const lineItemId = req.params.lineItemId;
      const response = await DeleteCart(
        { id: +lineItemId, customerId: user.id },
        CartRepository
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
