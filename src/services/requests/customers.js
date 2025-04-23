import {fetchData} from "@/services/api.js"

// Funciones específicas (Opcional)
export const getAllCustomers = async () => {
  return fetchData("GET", "/customers/");
};

// Obtener un producto por su ID
export const getCustomerById = async (id) => {
  return fetchData("GET", `/customers/${id}`);
};

// Crear un nuevo cliente
export const createOneCustomer = async (data) => {
  return fetchData("POST", "/customers/", data);
};

// Actualizar un cliente
export const updateCustomer = async (id, data) => {
  return fetchData("PATCH", `/customers/${id}`, data);
};

// Eliminar una categoría
export const deleteCustomer = async (id) => {
  return fetchData("DELETE", `/customers/${id}`);
};


