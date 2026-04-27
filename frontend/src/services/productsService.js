import products, { getProductById, getProductsByCategory } from "../data/mockProducts";
import { api } from "./api";

let url = "https://harbest-onlineshop.onrender.com";
export const productsService = {
  async getProducts() {
    await fetch(`${url}/product/`,{method:"GET",}).then((products)=>{
      let data = products.json();
      console.log(data);
      return data;
    });
  },

  async getProductsByFarmer(farmerId) {
    await fetch(`${url}/product/farmer/${farmerId}`,{method:"GET",}).then((products)=>{
      let data = products.json();
      console.log(data);
      return data;
    });
  },

  // getProductsByCategory(category) {
    
  // },

  async getProductById(id) {
    await fetch(`${url}/product/${id}`,{method:"GET",}).then((product)=>{
      let data = product.json();
      console.log(data);
      return data;
    });
  },

  async createProduct(productData) {
    await fetch(`${url}/product/`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    }).then((response)=>{
      let data = response.json();
      console.log(data);
      return data;
    });
  },

  async updateProduct(id, productData) {
    await fetch(`${url}/product/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    }).then((res)=>{
      let data = res.json();
      console.log(data);
      return data;
    });
  },

  async deleteProduct(id) {
    await fetch(`${url}/product/${id}`,{
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res)=>{
      let data = res.json();
      console.log(data);
      return data;
    });
  },
};

export default productsService;
