// services/requests/returns.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllReturns = async () => {
  return fetchData("GET", "/returns/");
};

// Crear una nueva categoría
export const createOneReturn = async (data) => {
  return fetchData("POST", "/returns/", data);
};

// Eliminar una categoría
export const deleteReturn = async (id) => {
  return fetchData("DELETE", `/returns/${id}`);
};

// Actualizar una categoría
export const updateReturn = async (id, data) => {
  return fetchData("PATCH", `/returns/${id}`, data);
};

// Obtener una categoría por su ID
export const getReturnById = async (id) => {
  return fetchData("GET", `/returns/${id}`);
};
