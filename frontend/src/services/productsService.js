import { api } from "./api";

export const productsService = {
  async getProducts() {
    return api.get("/product/");
  },

  async getProductById(id) {
    return api.get(`/product/${id}`);
  },

  async getProductsByFarmer(farmerEmail) {
    return api.get(`/product/farmer/${encodeURIComponent(farmerEmail)}`);
  },

  async getProductsByCategory(categoria) {
    return api.get(`/product/category/${encodeURIComponent(categoria)}`);
  },

  async searchProducts(q) {
    return api.get(`/product/search?q=${encodeURIComponent(q)}`);
  },

  //Crear/actualizar usan FormData porque el backend espera multipart con campo "foto"
  async createProduct(productData, fotoUri) {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (fotoUri) {
      const filename = fotoUri.split("/").pop() ?? "foto.jpg";
      const ext = (filename.split(".").pop() ?? "jpg").toLowerCase();
      formData.append("foto", {
        uri: fotoUri,
        name: filename,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      });
    }
    return api.postForm("/product/", formData, { auth: true });
  },

  async updateProduct(id, productData, fotoUri) {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (fotoUri) {
      const filename = fotoUri.split("/").pop() ?? "foto.jpg";
      const ext = (filename.split(".").pop() ?? "jpg").toLowerCase();
      formData.append("foto", {
        uri: fotoUri,
        name: filename,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      });
    }
    return api.putForm(`/product/${id}`, formData, { auth: true });
  },

  async deleteProduct(id) {
    return api.delete(`/product/${id}`, { auth: true });
  },
};

export default productsService;
