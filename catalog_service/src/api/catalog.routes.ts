import { NextFunction, Request, Response, Router } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.respository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";

const router = Router();

export const catalogService = new CatalogService(new CatalogRepository());

router.post(
  "/product",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );
      if (errors) {
        res.status(400).json(errors);
      }
      const data = await catalogService.createProduct(input);
      res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json(err.message);
    }
  }
);

router.patch(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );

      const productId = Number(req.params.id) || 0;

      if (errors) {
        res.status(400).json(errors);
      }
      const data = await catalogService.updateProduct(productId, input);
      res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json(err.message);
    }
  }
);

router.get(
  "/product",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    try {
      const data = await catalogService.getProducts(limit, offset);
      res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json(err.message);
    }
  }
);

router.get(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = Number(req.params.id) || 0;
    try {
      const data = await catalogService.getProductById(productId);
      res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json(err.message);
    }
  }
);

router.delete(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = Number(req.params.id) || 0;
    try {
      const data = await catalogService.deleteProduct(productId);
      res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json(err.message);
    }
  }
);

export default router;
