import { Request, Response, Router } from "express";

const router = Router();

router.post("/order", async (req: Request, res: Response) => {
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
