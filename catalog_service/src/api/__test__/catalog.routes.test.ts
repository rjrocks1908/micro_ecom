import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker";
import catalogRoutes, { catalogService } from "../catalog.routes";
import { ProductFactory } from "../../utils/fixtures";

const app = express();
app.use(express.json());
app.use(catalogRoutes);

const mockRequest = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: faker.number.int({ min: 1, max: 100 }),
  };
};

describe("Catalog Routes", () => {
  describe("POST /product", () => {
    test("should create a product", async () => {
      const mockProduct = mockRequest();
      const product = ProductFactory.build();

      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app)
        .post("/product")
        .send(mockProduct)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toEqual(product);
    });

    test("should response with validation error 400", async () => {
      const mockProduct = mockRequest();

      const response = await request(app)
        .post("/product")
        .send({ ...mockProduct, name: "" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body[0].isNotEmpty).toContain("name should not be empty");
    });

    test("should response with an internal error code 500", async () => {
      const mockProduct = mockRequest();

      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Internal error"))
        );

      const response = await request(app)
        .post("/product")
        .send(mockProduct)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toEqual("Internal error");
    });
  });

  describe("PATCH /product/:id", () => {
    test("should update a product", async () => {
      const product = ProductFactory.build();
      const mockProduct = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app)
        .patch(`/product/${product.id}`)
        .send(mockProduct)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });

    test("should response with validation error 400", async () => {
      const product = ProductFactory.build();
      const mockProduct = {
        name: product.name,
        price: -1,
        stock: product.stock,
      };

      const response = await request(app)
        .patch(`/product/${product.id}`)
        .send(mockProduct)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body[0].min).toContain("price must not be less than 1");
    });

    test("should response with an internal error code 500", async () => {
      const product = ProductFactory.build();
      const mockProduct = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Unable to update product"))
        );

      const response = await request(app)
        .patch(`/product/${product.id}`)
        .send(mockProduct)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toEqual("Unable to update product");
    });
  });

  describe("GET /product?limit=0&offset=0", () => {
    test("should return a range of products based on limit and offset", async () => {
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);

      jest
        .spyOn(catalogService, "getProducts")
        .mockImplementationOnce(() => Promise.resolve(products));

      const response = await request(app)
        .get(`/product?limit=${randomLimit}&offset=0`)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
    });
  });

  describe("GET /product/:id", () => {
    test("should return a product based on id", async () => {
      const product = ProductFactory.build();

      jest
        .spyOn(catalogService, "getProductById")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app)
        .get(`/product/${product.id}`)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });
  });

  describe("DELETE /product/:id", () => {
    test("should delete a product based on id", async () => {
      const product = ProductFactory.build();

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockImplementationOnce(() => Promise.resolve(product.id!));

      const response = await request(app)
        .delete(`/product/${product.id}`)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product.id);
    });
  });
});
