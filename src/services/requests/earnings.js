import { fetchData } from "@/services/api.js";
import { format, parseISO, isValid, isAfter, subDays } from 'date-fns';

// Función para validar y formatear fechas
const validateAndFormatDate = (dateInput) => {
  try {
    if (!dateInput) {
      // Si no se pasa una fecha, se usa la fecha actual (hoy)
      return format(new Date(), 'yyyy-MM-dd');
    }
    
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    
    if (!isValid(date)) {
      console.warn('Fecha inválida recibida, usando la fecha actual');
      return format(new Date(), 'yyyy-MM-dd');
    }
    
    if (isAfter(date, new Date())) {
      console.warn('Fecha futura recibida, usando la fecha actual');
      return format(new Date(), 'yyyy-MM-dd');
    }
    
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error al procesar fecha:', error);
    return format(new Date(), 'yyyy-MM-dd');
  }
};

// Obtener las ganancias por día
export const getEarningsByDay = async (day) => {
  const formattedDate = validateAndFormatDate(day);
  return fetchData("GET", `/sales/day/earnings?day=${formattedDate}`);
};

// Obtener las métricas por día
export const getMetricsByDay = async (day) => {
  const formattedDate = validateAndFormatDate(day);
  return fetchData("GET", `/sales/day/metrics?day=${formattedDate}`);
};

// Obtener reporte por rango de fechas
export const getReportByDateRange = async (startDate, endDate) => {
  const formattedStart = validateAndFormatDate(startDate);
  const formattedEnd = validateAndFormatDate(endDate);
  return fetchData(
    "GET", 
    `/sales/range/earnings?start_date=${formattedStart}&end_date=${formattedEnd}`
  );
};

// Obtener reporte detallado por día
export const getDailyReport = async (day) => {
  const formattedDate = validateAndFormatDate(day);
  return fetchData("GET", `/sales/day/earnings?day=${formattedDate}`);
};

// Obtener reporte del dashboard por día
export const getDashboardData = async (day) => {
  const formattedDate = validateAndFormatDate(day);
  const [earningsResponse, metricsResponse] = await Promise.all([
    fetchData("GET", `/sales/day/earnings?day=${formattedDate}`),
    fetchData("GET", `/sales/day/metrics?day=${formattedDate}`)
  ]);
  
  return {
    date: formattedDate,
    earnings: earningsResponse,
    metrics: metricsResponse
  };
};

// Función auxiliar para calcular ventas totales
const calculateTotalSales = (productsData) => {
  if (!productsData) return 0;
  return Object.values(productsData).reduce(
    (sum, product) => sum + (product.quantity_sold * (product.real_unit_price || 0)),
    0
  );
};

// Función para calcular ventas totales por rango
const calculateRangeTotalSales = (dailyBreakdown) => {
  if (!dailyBreakdown) return 0;
  return Object.values(dailyBreakdown).reduce(
    (sum, dayData) => sum + calculateTotalSales(dayData.earnings_by_product || {}),
    0
  );
};

// Función para transformar los datos del dashboard
export const transformDashboardData = (apiData) => {
  if (!apiData || !apiData.earnings || !apiData.metrics) {
    return {
      date: apiData?.date || '',
      metrics: {
        total_sales: 0,
        total_profit: 0,
        total_losses: 0,
        net_profit: 0,
        sales_by_hour: {},
        sales_by_category: {},
        sales_by_customer: {},
        profit_margin_products: [],
        total_products_sold: 0
      },
      earnings: {
        earnings_by_product: {}
      }
    };
  }

  const { earnings, metrics, date } = apiData;
  const dailyData = earnings.daily_breakdown?.[date] || {};

  return {
    date,
    metrics: {
      total_sales: calculateTotalSales(dailyData.earnings_by_product),
      total_profit: dailyData.total_profit_day || 0,
      total_losses: dailyData.total_losses_day || 0,
      net_profit: dailyData.net_profit_day || 0,
      sales_by_hour: metrics.sales_by_hour || {},
      sales_by_category: metrics.sales_by_category || {},
      sales_by_customer: metrics.sales_by_customer || {},
      profit_margin_products: metrics.profit_margin_products || [],
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
    total_sales: calculateRangeTotalSales(apiData.daily_breakdown),
    total_profit: apiData.summary?.total_profit_period || 0,
    total_losses: apiData.summary?.total_losses_period || 0,
    total_returns: apiData.summary?.total_returns_period || 0,
    net_profit: apiData.summary?.net_profit_after_returns || 0,
    total_products_sold: Object.values(apiData.summary?.earnings_by_product || {})
      .reduce((sum, product) => sum + (product.quantity_sold || 0), 0),
    days_with_sales: apiData.summary?.days_with_sales || 0,
    average_profit_per_day: apiData.summary?.days_with_sales 
      ? (apiData.summary.total_profit_period || 0) / apiData.summary.days_with_sales 
      : 0,
    average_loss_per_day: apiData.summary?.days_with_sales 
      ? (apiData.summary.total_losses_period || 0) / apiData.summary.days_with_sales 
      : 0,
  };

  const dailyData = Object.entries(apiData.daily_breakdown || {}).map(([date, data]) => ({
    date,
    ganancias: data.total_profit_day || 0,
    perdidas: data.total_losses_day || 0,
    devoluciones: data.total_returns_day || 0,
    neto: data.net_profit_after_returns || 0
  }));

  return {
    metrics,
    earnings: {
      earnings_by_product: apiData.summary?.earnings_by_product || {},
      daily_earnings: apiData.daily_breakdown || {},
      daily_data: dailyData,
      start_date: apiData.summary?.start_date || '',
      end_date: apiData.summary?.end_date || ''
    }
  };
};