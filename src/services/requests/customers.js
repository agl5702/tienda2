import {fetchData} from "@/services/api.js"

// Funciones específicas (Opcional)
export const getAllCustomers = async () => {
  return fetchData("GET", "/customers/");
};
