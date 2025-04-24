import {fetchData} from "@/services/api.js"

// Obtener todas las ventas
export const getAllSales = async () => {
  return fetchData("GET", "/sales/");
};

// Crea una nueba venta
export const createSale = async (data) => {
  return fetchData("POST", "/sales/", data);
};


