import { ICatalogRepository } from "../interface/catalogRespository.interface";
import { Product } from "../models/product";

export class MockCatalogRepository implements ICatalogRepository {
  create(data: Product): Promise<Product> {
    const mockProduct = {
      id: 1,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    } as Product;
    return Promise.resolve(mockProduct);
  }
  update(id: number, data: Product): Promise<Product> {
    const mockProduct = {
      id,
      ...data,
    } as Product;
    return Promise.resolve(mockProduct);
  }
  delete(id: number): Promise<number> {
    return Promise.resolve(id);
  }
  findAll(limit: number, offset: number): Promise<Product[]> {
    return Promise.resolve([]);
  }
  findOne(id: number): Promise<Product> {
    return Promise.resolve({ id } as unknown as Product);
  }
}
