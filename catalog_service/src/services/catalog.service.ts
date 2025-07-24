import { ICatalogRepository } from "../interface/catalogRespository.interface";
import { Product } from "../models/product";

export class CatalogService {
  private _respository: ICatalogRepository;
  constructor(repository: ICatalogRepository) {
    this._respository = repository;
  }
  async createProduct(data: Product): Promise<Product> {
    const result = await this._respository.create(data);
    if (!result) {
      throw new Error("Unable to create product");
    }
    return result;
  }
  async updateProduct(id: number, data: any): Promise<Product> {
    const result = await this._respository.update(id, data);
    if (!result) {
      throw new Error("Unable to update product");
    }
    return result;
  }

  // instead of this we will get products from elastic search
  async getProducts(limit: number, offset: number) {
    const result = await this._respository.findAll(limit, offset);
    if (!result) {
      throw new Error("Unable to get products");
    }
    return result;
  }

  async getProductById(id: number) {
    const result = await this._respository.findOne(id);
    return result;
  }

  async deleteProduct(id: number): Promise<number> {
    const result = await this._respository.delete(id);
    if (!result) {
      throw new Error("Unable to delete product");
    }
    return result;
  }

  async getProductStock(ids: number[]) {
    const products = await this._respository.findStock(ids);
    if (!products) {
      throw new Error("Unable to get product stock");
    }
    return products;
  }
}
