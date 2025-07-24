import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../respository/cart.repository";
import { GetProductDetails, GetStockDetails } from "../utils/broker/api";
import { AuthorizationError, logger, NotFoundError } from "../utils";
import { CartLineItem } from "../db/schema";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // get product details from catalog service
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("Product is out of stock");
  }

  // find if the product is already in cart
  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );

  if (lineItem) {
    return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
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
  // get customer cart data
  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  // list out all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("Cart line items not found");
  }

  // verify with inventory service if the product is still available
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    // Update stock availability in cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId
      );
      if (stockItem) {
        lineItem.available = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }

  // return updated cart data with latest stock availability
  return cart;
};

const AuthorizedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizationError("You are not authorized to update this cart");
  }

  return lineItem;
};

export const UpdateCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
