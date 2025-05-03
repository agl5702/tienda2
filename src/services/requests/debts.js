import {fetchData} from "@/services/api.js"

// Obtener una deuda por id
export const getAllDebt = async (id) => {
  return fetchData("GET", `/debts/`);
}

// Crear una deuda
export const createDebt = async (data) => {
  return fetchData("POST", "/debts/", data);
};

// Crear un movimiento ---> PAYMENT / NEW_BALANCE 
export const createDebtMovement = async (id, data) => {
  return fetchData("POST", `/debts/${id}/movements`, data);
};
// Actualizar una deuda
export const updateDebt = async (id, data) => {
  return fetchData("PATCH", `/debts/${id}`, data);
};

// Obtener una deuda por id
export const getDebtById = async (id) => {
  return fetchData("GET", `/debts/${id}`);
};

// Obtener una deuda por id
export const getDebtByCustomer = async (customer_id) => {
  return fetchData("GET", `/debts/customer/${customer_id}/history`);
};

// Obtener una deuda por id
export const getDebtByCustomerId = async (customer_id) => {
  return fetchData("GET", `/debts/customer/${customer_id}`);
};

