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

  //Crear/actualizar usan FormData porque el backend espera multipart con
  //campo "fotos" (varios archivos, hasta 5). Cada elemento de `fotos` puede
  //ser un File (web) o una URI (RN). Por compatibilidad, también aceptamos
  //un único valor (no array).
  async createProduct(productData, fotos) {
    const fotoArray = Array.isArray(fotos) ? fotos : fotos ? [fotos] : [];
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    fotoArray.forEach((foto) => {
      formData.append("fotos", normalizeFotoForUpload(foto));
    });
    return api.postForm("/product/", formData, { auth: true });
  },

  async updateProduct(id, productData, fotos) {
    const fotoArray = Array.isArray(fotos) ? fotos : fotos ? [fotos] : [];
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    //Si fotoArray viene vacío no añadimos nada y el backend mantiene las fotos
    //existentes; si viene con elementos, el backend reemplaza todas las fotos.
    fotoArray.forEach((foto) => {
      formData.append("fotos", normalizeFotoForUpload(foto));
    });
    return api.putForm(`/product/${id}`, formData, { auth: true });
  },

  async deleteProduct(id) {
    return api.delete(`/product/${id}`, { auth: true });
  },

  //Restaura cantidad al valor "lleno" guardado al crear/editar el producto.
  async reponerProduct(id) {
    return api.patch(`/product/${id}/reponer`, {}, { auth: true });
  },
};

export default productsService;
