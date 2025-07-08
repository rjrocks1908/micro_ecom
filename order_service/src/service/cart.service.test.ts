import { CartRepository } from "../respository/cart.repository";
import { CartRepositoryType } from "../types/repository.type";
import { CreateCart } from "./cart.service";

describe("cartService", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = CartRepository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  describe("createCart", () => {
    it("should create a cart", async () => {
      const mockCart = {
        title: "smart phone",
        amount: 1200,
      };

      jest.spyOn(repo, "create").mockImplementation(() => {
        return Promise.resolve({ message: "Cart created successfully" });
      });

      const response = await CreateCart(mockCart, repo);
      expect(response).toEqual({
        message: "Cart created successfully",
      });
    });
  });
});
