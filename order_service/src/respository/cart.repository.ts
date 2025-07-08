import { CartRepositoryType } from "../types/repository.type";

const createCart = async (input: any) => {
  return Promise.resolve({ message: "Cart created successfully" });
};

const getCart = async (input: any) => {
  return Promise.resolve({ message: "Cart fetched successfully" });
};

const updateCart = async (input: any) => {
  return Promise.resolve({ message: "Cart updated successfully" });
};

const deleteCart = async (input: any) => {
  return Promise.resolve({ message: "Cart deleted successfully" });
};

export const CartRepository: CartRepositoryType = {
  create: createCart,
  get: getCart,
  update: updateCart,
  delete: deleteCart,
};
