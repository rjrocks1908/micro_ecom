import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post(
  "/product",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({});
    } catch (error) {
      next(error);
    }
  }
);

export default router;
