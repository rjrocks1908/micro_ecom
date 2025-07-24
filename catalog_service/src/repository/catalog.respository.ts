import { ICatalogRepository } from "../interface/catalogRespository.interface";
import { Product } from "../models/product";
import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../utils";

export class CatalogRepository implements ICatalogRepository {
  _prismaClient: PrismaClient;

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  async create(data: Product): Promise<Product> {
    return this._prismaClient.product.create({ data });
  }
  async update(id: number, data: Product): Promise<Product> {
    return this._prismaClient.product.update({ where: { id }, data });
  }
  async delete(id: number): Promise<number> {
    return this._prismaClient.product.delete({ where: { id } }).then(() => id);
  }
  async findAll(limit: number, offset: number): Promise<Product[]> {
    return this._prismaClient.product.findMany({
      take: limit,
      skip: offset,
    });
  }
  async findOne(id: number): Promise<Product> {
    const product = await this._prismaClient.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }
  findStock(ids: number[]): Promise<Product[]> {
    return this._prismaClient.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
