import {fetchData} from "@/services/api.js"

// Obtener todas las ventas
export const getAllSales = async () => {
  return fetchData("GET", "/sales/");
};

// Obtener un Orders por su ID
export const getSalesById = async (id) => {
  return fetchData("GET", `/sales/${id}`);
};

// Crea una nueba venta
export const createSale = async (data) => {
  return fetchData("POST", "/sales/", data);
};


