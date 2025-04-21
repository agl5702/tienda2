import {fetchData} from "@/services/api.js"

// Obtener todos los productos
export const getAllProducts = async ()=>{
  return fetchData("GET","/products/")
}

// Obtener un producto por su ID
export const getProductById = async (id) => {
  return fetchData("GET", `/products/${id}`);
};

// Crear un nuevo producto
export const createProduct = async (data) => {
  return fetchData("POST", "/products/", data);
};

// Actualizar una categoría
export const updateProduct = async (id, data) => {
  return fetchData("PATCH", `/products/${id}`, data);
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  return fetchData("DELETE", `/products/${id}/`);
};