import { api } from "./api";

//Acepta tanto un File del navegador como una URI de RN y devuelve el formato
//que espera FormData en cada caso.
function normalizeFotoForUpload(foto) {
  if (typeof foto === "string") {
    const filename = foto.split("/").pop() || "foto.jpg";
    const ext = (filename.split(".").pop() || "jpg").toLowerCase();
    return {
      uri: foto,
      name: filename,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    };
  }
  return foto;
}

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

  //Crear/actualizar usan FormData porque el backend espera multipart con campo "foto".
  //`foto` puede ser un File (web, p.ej. <input type="file">) o una URI (RN).
  async createProduct(productData, foto) {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (foto) {
      formData.append("foto", normalizeFotoForUpload(foto));
    }
    return api.postForm("/product/", formData, { auth: true });
  },

  async updateProduct(id, productData, foto) {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (foto) {
      formData.append("foto", normalizeFotoForUpload(foto));
    }
    return api.putForm(`/product/${id}`, formData, { auth: true });
  },

  async deleteProduct(id) {
    return api.delete(`/product/${id}`, { auth: true });
  },
};

export default productsService;
