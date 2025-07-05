import { ICatalogRepository } from "../interface/catalogRespository.interface";
import { Product } from "../models/product";

export class CatalogRepository implements ICatalogRepository {
    create(data: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    update(id: number, data: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: number): Promise<Product> {
        throw new Error("Method not implemented.");
    }
}
