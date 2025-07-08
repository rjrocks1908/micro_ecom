import { Request, Response, Router } from "express";
import {
  CreateCart,
  DeleteCart,
  GetCart,
  UpdateCart,
} from "../service/cart.service";
import { CartRepository } from "../respository/cart.repository";

const router = Router();

router.post("/cart", async (req: Request, res: Response) => {
  const response = await CreateCart(req.body, CartRepository);
  res.json(response);
});

router.get("/cart", async (req: Request, res: Response) => {
  const response = await GetCart(req.body, CartRepository);
  res.json(response);
});

router.patch("/cart", async (req: Request, res: Response) => {
  const response = await UpdateCart(req.body, CartRepository);
  res.json(response);
});

router.delete("/cart", async (req: Request, res: Response) => {
  const response = await DeleteCart(req.body, CartRepository);
  res.json(response);
});

export default router;
