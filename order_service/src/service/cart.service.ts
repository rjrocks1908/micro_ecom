import { CartRepositoryType } from "../types/repository.type";

export const CreateCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.create(input);
  return data;
};

export const GetCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.get(input);
  return data;
};

export const UpdateCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.update(input);
  return data;
};

export const DeleteCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.delete(input);
  return data;
};
