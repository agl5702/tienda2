import {fetchData} from "@/services/api.js"

// Obtener todos los productos
export const getAllProducts = async ()=>{
  return fetchData("GET","/products/")
}

export const updateProduct = async (id, productData) => {
  return fetchData("PATCH", `/products/${id}`, productData);
};

export const createProduct = async (productData) => {
  return fetchData("POST", "/products", productData);
};

export const getProductById = async (id) => {
  return fetchData("GET", `/products/${id}`);
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  return fetchData("DELETE", `/products/${id}/`);
};

// Sumar al stock de un producto
export const addStockProductById = async (id, quantity) => {
  return fetchData("POST", `/products/${id}/add-stock?quantity=${quantity}`);
};

// Restar al stock de un producto
export const removeStockProductById = async (id, quantity) => {
  return fetchData("POST", `/products/${id}/remove-stock?quantity=${quantity}`);
};
