// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllCategories = async () => {
  return fetchData("GET", "/categories/");
};

// Crear una nueva categoría
export const createOneCategory = async (data) => {
  return fetchData("POST", "/categories/", data);
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
  return fetchData("DELETE", `/categories/${id}`);
};

// Actualizar una categoría
export const updateCategory = async (id, data) => {
  return fetchData("PATCH", `/categories/${id}`, data);
};

// Obtener una categoría por su ID
export const getCategoryById = async (id) => {
  return fetchData("GET", `/categories/${id}`);
};
