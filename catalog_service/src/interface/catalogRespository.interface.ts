import { Product } from "../models/product";

export interface ICatalogRepository {
  create(data: Product): Promise<Product>;
  update(id: number, data: Product): Promise<Product>;
  delete(id: number): Promise<number>;
  findAll(limit: number, offset: number): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
}
