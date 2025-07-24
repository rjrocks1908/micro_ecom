import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import {
  Cart,
  CartLineItem,
  cartLineItemsTable,
  cartTable,
} from "../db/schema";
import { NotFoundError } from "../utils";
import { CartWithLineItems } from "../dto/cartRequest.dto";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<boolean>;
  clearCartData: (id: number) => Promise<boolean>;
  findCartByProductId: (
    custommerId: number,
    productId: number
  ) => Promise<CartLineItem>;
};

const createCart = async (
  customerId: number,
  lineItem: CartLineItem
): Promise<number> => {
  const result = await DB.insert(cartTable)
    .values({
      customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: cartTable.customerId,
      set: {
        updatedAt: new Date(),
      },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItemsTable).values({
      cartId: id,
      productId: lineItem.productId,
      qty: lineItem.qty,
      price: lineItem.price,
      itemName: lineItem.itemName,
      variant: lineItem.variant,
    });
  }

  return id;
};

const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.cartTable.findFirst({
    where: (cartTable, { eq }) => eq(cartTable.customerId, id),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItemsTable)
    .set({
      qty,
    })
    .where(eq(cartLineItemsTable.id, id))
    .returning();

  return cartLineItem;
};

const deleteCart = async (id: number): Promise<boolean> => {
  const result = await DB.delete(cartLineItemsTable)
    .where(eq(cartLineItemsTable.id, id))
    .returning();

  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  const result = await DB.delete(cartTable)
    .where(eq(cartTable.customerId, id))
    .returning();

  return true;
};

const findCartByProductId = async (
  custommerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.cartTable.findFirst({
    where: (cartTable, { eq }) => eq(cartTable.customerId, custommerId),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  const cartLineItem = cart.lineItems.find(
    (lineItem) => lineItem.productId === productId
  );

  if (!cartLineItem) {
    throw new NotFoundError("cart line item not found");
  }

  return cartLineItem;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};
