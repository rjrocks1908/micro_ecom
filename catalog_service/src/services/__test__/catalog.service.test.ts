import { faker } from "@faker-js/faker";
import { ICatalogRepository } from "../../interface/catalogRespository.interface";
import { Product } from "../../models/product";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { ProductFactory } from "../../utils/fixtures";

const mockProduct = (rest?: any) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: faker.number.int({ min: 1, max: 100 }),
    ...rest,
  } as Product;
};

describe("catalog service", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("createProduct", () => {
    test("should create a product", async () => {
      const service = new CatalogService(repository);
      const result = await service.createProduct(mockProduct());
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw an error if unable to create product", async () => {
      const service = new CatalogService(repository);

      jest.spyOn(repository, "create").mockImplementationOnce(() => {
        return Promise.reject(new Error("Unable to create product"));
      });

      await expect(service.createProduct(mockProduct())).rejects.toThrow(
        "Unable to create product"
      );
    });

    test("should throw an error if the product already exists", async () => {
      const service = new CatalogService(repository);

      jest.spyOn(repository, "create").mockImplementationOnce(() => {
        return Promise.reject(new Error("Product already exists"));
      });

      await expect(service.createProduct(mockProduct())).rejects.toThrow(
        "Product already exists"
      );
    });
  });

  describe("updateProduct", () => {
    test("should update a product", async () => {
      const service = new CatalogService(repository);
      const id = faker.number.int({ min: 1, max: 1000 });
      const reqProduct = mockProduct();
      const result = await service.updateProduct(id, reqProduct);
      expect(result).toMatchObject({
        id,
        ...reqProduct,
      });
    });

    test("should throw an error if the product does not exist", async () => {
      const service = new CatalogService(repository);
      const id = faker.number.int({ min: 1, max: 1000 });
      const reqProduct = mockProduct();
      jest.spyOn(repository, "update").mockImplementationOnce(() => {
        return Promise.reject(new Error("Product not found"));
      });
      await expect(service.updateProduct(id, reqProduct)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("getProducts", () => {
    test("should get products by offset and limit", async () => {
      const service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);

      jest.spyOn(repository, "findAll").mockImplementationOnce(() => {
        return Promise.resolve(products);
      });

      const result = await service.getProducts(randomLimit, 0);
      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("should throw an error if the products does not exist", async () => {
      const service = new CatalogService(repository);
      jest.spyOn(repository, "findAll").mockImplementationOnce(() => {
        return Promise.reject(new Error("Products not found"));
      });
      await expect(service.getProducts(0, 0)).rejects.toThrow(
        "Products not found"
      );
    });
  });

  describe("getProductById", () => {
    test("should get product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest.spyOn(repository, "findOne").mockImplementationOnce(() => {
        return Promise.resolve(product);
      });

      const result = await service.getProductById(product.id!);
      expect(result).toMatchObject(product);
    });

    test("should throw an error if the product does not exist", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();
      jest.spyOn(repository, "findOne").mockImplementationOnce(() => {
        return Promise.reject(new Error("Product not found"));
      });
      await expect(service.getProductById(product.id!)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest.spyOn(repository, "delete").mockImplementationOnce(() => {
        return Promise.resolve(product.id!);
      });

      const result = await service.deleteProduct(product.id!);
      expect(result).toBe(product.id!);
    });

    test("should throw an error if the product does not exist", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();
      jest.spyOn(repository, "delete").mockImplementationOnce(() => {
        return Promise.reject(new Error("Product not found"));
      });
      await expect(service.deleteProduct(product.id!)).rejects.toThrow(
        "Product not found"
      );
    });
  });
});
