import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../respository/cart.repository";
import { GetProductDetails } from "../utils/broker/api";
import { logger, NotFoundError } from "../utils";
import { CartLineItem } from "../db/schema";

export const CreateCart = async (
  input: CartRequestInput,
  repo: CartRepositoryType
) => {
  // Make a call to our catalog microservice
  // Synchronize call
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("Product is out of stock");
  }

  const data = await repo.createCart(input.customerId, {
    productId: input.productId,
    qty: input.qty,
    price: product.price.toString(),
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
  return data;
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.findCart(id);

  if (!data) {
    throw new NotFoundError("Cart not found");
  }

  return data;
};

export const UpdateCart = async (
  input: CartEditRequestInput,
  repo: CartRepositoryType
) => {
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.deleteCart(id);
  return data;
};
