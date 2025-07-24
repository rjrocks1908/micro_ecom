import axios from "axios";
import { config } from "../../config";
import { APIError, AuthorizationError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/User.Model";

const CATALOG_BASE_URL = config.CATALOG_BASE_URL;

const AUTH_SERVICE_BASE_URL =
  config.AUTH_SERVICE_BASE_URL || "http://localhost:8002";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/product/${productId}`
    );
    const product = response.data as Product;
    return product;
  } catch (error) {
    logger.error(error);
    throw new APIError("product not found");
  }
};

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.get(`${CATALOG_BASE_URL}/products/stock`, {
      params: {
        ids,
      },
    });
    const stock = response.data as Product[];
    return stock;
  } catch (error) {
    logger.error(error);
    throw new APIError("error on getting stock details");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/validate`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new AuthorizationError("user not authorized");
    }

    return response.data as User;
  } catch (error) {
    logger.error(error);
    throw new AuthorizationError("user not authorized");
  }
};
