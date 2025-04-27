import { fetchData } from "@/services/api.js";

// Obtener las ganancias por día
export const getAllDebts = async () => {
  // Obtener todas las deudas
  return fetchData("GET", `/debts/`);
};

// Obtener las estadísticas de deudas
export const getDebtStats = async () => {
  // Obtener todas las deudas
  return fetchData("GET", `/debts/summary/`);
};

// Crear nueva deuda
export const createDebt = async (data) => {
  return fetchData("POST", `/debts/`, {
    customer_id: data.customer_id,
    total_amount: parseFloat(data.total_amount)
  });
};

// Editar una deuda 
export const editDebts = async (debt_id,data) =>{
  return fetchData("PUT",`/debts/${debt_id}/`,data);
}

// Eliminar una deuda
export const deleteDebts = async (debt_id) =>{
  return fetchData("DELETE",`/debts/${debt_id}/`);
}
// Abono de una deuda
export const paymentDebts = async (debt_id, amount) => {
  const paymentData = {
    amount: parseFloat(amount),
    debt_id: parseInt(debt_id),
    notes: "Abono" // Siempre envía "Abono" como nota
  };
  
  return fetchData("POST", `/debts/${debt_id}/payments`, paymentData);
};