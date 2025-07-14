import axios from "axios";
import { config } from "../../config";
import { APIError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/product.dto";

const CATALOG_BASE_URL = config.CATALOG_BASE_URL;

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
