// earnings.js
import { fetchData } from "@/services/api.js";

// Obtener las ganancias por día
export const getEarningsByDay = async (day) => {
  return fetchData("GET", `/sales/day/earnings?day=${day}`);
};

// Obtener las métricas por día
export const getMetricsByDay = async (day) => {
  return fetchData("GET", `/sales/day/metrics?day=${day}`);
};

// Obtener reporte por rango de fechas (para la tabla resumen)
export const getReportByDateRange = async (startDate, endDate) => {
  return fetchData("GET", `/sales/range/earnings?start_date=${startDate}&end_date=${endDate}`);
};

// Obtener reporte detallado por día
export const getDailyReport = async (day) => {
  return fetchData("GET", `/sales/day/earnings?day=${day}`);
};

// Función para transformar los datos de la API al formato que espera el componente
export const transformApiData = (apiData, isDaily = false) => {
  if (!apiData) return null;
  
  if (isDaily) {
    // Transformación para reporte diario
    return {
      metrics: {
        total_sales: apiData.total_profit_day + apiData.total_returns_day,
        total_profit: apiData.total_profit_day,
        total_losses: apiData.total_losses_day,
        total_returns: apiData.total_returns_day,
        net_profit: apiData.net_profit_day,
        total_products_sold: Object.values(apiData.earnings_by_product)
          .reduce((sum, product) => sum + product.quantity_sold, 0),
      },
      earnings: {
        earnings_by_product: apiData.earnings_by_product,
        date: apiData.date || Object.keys(apiData)[0] // Para compatibilidad
      }
    };
  }

  // Transformación para reporte por rango (igual que antes)
  const metrics = {
    total_sales: apiData.summary.total_profit_period + apiData.summary.total_returns_period,
    total_profit: apiData.summary.total_profit_period,
    total_losses: apiData.summary.total_losses_period,
    total_returns: apiData.summary.total_returns_period,
    net_profit: apiData.summary.net_profit_after_returns,
    total_products_sold: Object.values(apiData.summary.earnings_by_product)
      .reduce((sum, product) => sum + product.quantity_sold, 0),
    days_with_sales: apiData.summary.days_with_sales,
    average_profit_per_day: apiData.summary.total_profit_period / apiData.summary.days_with_sales,
    average_loss_per_day: apiData.summary.total_losses_period / apiData.summary.days_with_sales,
  };

  const dailyData = Object.entries(apiData.daily_breakdown).map(([date, data]) => ({
    date,
    ganancias: data.total_profit_day,
    perdidas: data.total_losses_day,
    devoluciones: data.total_returns_day,
    neto: data.net_profit_day
  }));

  return {
    metrics,
    earnings: {
      earnings_by_product: apiData.summary.earnings_by_product,
      daily_earnings: apiData.daily_breakdown,
      daily_data: dailyData,
      start_date: apiData.summary.start_date,
      end_date: apiData.summary.end_date
    }
  };
};