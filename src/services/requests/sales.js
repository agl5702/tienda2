import {fetchData} from "@/services/api.js"

// Funciones específicas (Opcional)
export const getAllSales = async () => {
  return fetchData("GET", "/sales/");
};
