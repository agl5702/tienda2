import {fetchData} from "@/services/api.js"

// Funciones específicas (Opcional)
export const getAllCustomers = async () => {
  return fetchData("GET", "/customers/");
};

// Obtener un producto por su ID
export const getCustomerById = async (id) => {
  return fetchData("GET", `/customers/${id}`);
};

