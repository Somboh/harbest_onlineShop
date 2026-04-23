import products, { getProductById, getProductsByCategory } from "../data/mockProducts";
import { api } from "./api";

export const productsService = {
  getProducts() {
    return api.get(products);
  },

  getFeaturedProducts() {
    return api.get(products.filter((product) => product.featured));
  },

  getProductsByCategory(category) {
    return api.get(getProductsByCategory(category));
  },

  getProductById(id) {
    return api.get(getProductById(id));
  },
};

export default productsService;
