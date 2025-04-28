import { fetchData } from "@/services/api.js";

// Obtener las ganancias por día
export const getEarningsByDay = async (day) => {
  return fetchData("GET", `/sales/day/earnings?day=${day}`);
};

// Obtener las métricas por día
export const getMetricsByDay = async (day) => {
  return fetchData("GET", `/sales/day/metrics?day=${day}`);
};

// Obtener reporte por rango de fechas
export const getReportByDateRange = async (startDate, endDate) => {
  return fetchData("GET", `/sales/range/earnings?start_date=${startDate}&end_date=${endDate}`);
};

// Obtener reporte detallado por día
export const getDailyReport = async (day) => {
  return fetchData("GET", `/sales/day/earnings?day=${day}`);
};

// Obtener reporte del dashboard por día
export const getDashboardData = async (day) => {
  const earningsResponse = await fetchData("GET", `/sales/day/earnings?day=${day}`);
  const metricsResponse = await fetchData("GET", `/sales/day/metrics?day=${day}`);
  
  return {
    earnings: earningsResponse,
    metrics: metricsResponse
  };
};

// Función auxiliar para calcular ventas totales
const calculateTotalSales = (productsData) => {
  return Object.values(productsData || {}).reduce(
    (sum, product) => sum + (product.quantity_sold * product.real_unit_price || 0),
    0
  );
};

// Función para transformar los datos del dashboard
export const transformDashboardData = (apiData) => {
  if (!apiData || !apiData.earnings || !apiData.metrics) return null;
  
  const earningsData = apiData.earnings;
  const metricsData = apiData.metrics;

  // Extraer datos del día
  const date = Object.keys(earningsData.daily_breakdown || {})[0] || '';
  const dailyData = earningsData.daily_breakdown?.[date] || {};

  return {
    date,
    metrics: {
      total_sales: calculateTotalSales(dailyData.earnings_by_product),
      total_profit: dailyData.total_profit_day || 0,
      total_losses: dailyData.total_losses_day || 0,
      net_profit: dailyData.net_profit_day || 0,
      sales_by_hour: metricsData.sales_by_hour || {},
      sales_by_category: metricsData.sales_by_category || {},
      sales_by_customer: metricsData.sales_by_customer || {},
      profit_margin_products: metricsData.profit_margin_products || [],
      total_products_sold: Object.values(dailyData.earnings_by_product || {})
        .reduce((sum, product) => sum + (product.quantity_sold || 0), 0),
    },
    earnings: {
      earnings_by_product: dailyData.earnings_by_product || {}
    }
  };
};

// Función para transformar los datos de la API
export const transformApiData = (apiData, isDaily = false) => {
  if (!apiData) return null;
  
  if (isDaily) {
    // Obtener el primer día del breakdown (para reporte diario)
    const date = Object.keys(apiData.daily_breakdown || {})[0] || '';
    const dailyData = apiData.daily_breakdown?.[date] || {};
    
    return {
      metrics: {
        total_sales: calculateTotalSales(dailyData.earnings_by_product),
        total_profit: dailyData.total_profit_day || 0,
        total_losses: dailyData.total_losses_day || 0,
        total_returns: dailyData.total_returns_day || 0,
        net_profit: dailyData.net_profit_day || 0,
        total_products_sold: Object.values(dailyData.earnings_by_product || {})
          .reduce((sum, product) => sum + (product.quantity_sold || 0), 0),
      },
      earnings: {
        earnings_by_product: dailyData.earnings_by_product || {},
        date: date
      }
    };
  }

  // Transformación para reporte por rango
  const metrics = {
    total_sales: calculateTotalSales(apiData.summary.earnings_by_product),
    total_profit: apiData.summary.total_profit_period || 0,
    total_losses: apiData.summary.total_losses_period || 0,
    total_returns: apiData.summary.total_returns_period || 0,
    net_profit: apiData.summary.net_profit_after_returns || 0,
    total_products_sold: Object.values(apiData.summary.earnings_by_product || {})
      .reduce((sum, product) => sum + (product.quantity_sold || 0), 0),
    days_with_sales: apiData.summary.days_with_sales || 0,
    average_profit_per_day: apiData.summary.days_with_sales 
      ? (apiData.summary.total_profit_period || 0) / apiData.summary.days_with_sales 
      : 0,
    average_loss_per_day: apiData.summary.days_with_sales 
      ? (apiData.summary.total_losses_period || 0) / apiData.summary.days_with_sales 
      : 0,
  };

  const dailyData = Object.entries(apiData.daily_breakdown || {}).map(([date, data]) => ({
    date,
    ganancias: data.total_profit_day || 0,
    perdidas: data.total_losses_day || 0,
    devoluciones: data.total_returns_day || 0,
    neto: data.net_profit_day || 0
  }));

  return {
    metrics,
    earnings: {
      earnings_by_product: apiData.summary.earnings_by_product || {},
      daily_earnings: apiData.daily_breakdown || {},
      daily_data: dailyData,
      start_date: apiData.summary?.start_date || '',
      end_date: apiData.summary?.end_date || ''
    }
  };
};