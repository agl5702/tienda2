import { fetchData } from "@/services/api.js";

// Obtener las ganancias por día
export const getEarningsByDay = async (day) => {
  // Construir la URL con el parámetro day
  return fetchData("GET", `/sales/day/earnings?day=${day}`);
};

// Obtener las ganancias por día
export const getMetricsByDay = async (day) => {
    // Construir la URL con el parámetro day
    return fetchData("GET", `/sales/day/metrics?day=${day}`);
  };
  