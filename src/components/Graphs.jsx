import React, { useState, useEffect } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Card, Typography } from "@mui/material";
import {
  getDashboardData,
  transformDashboardData,
} from "../services/requests/earnings";

const COLOR_PALETTE = {
  profit: "#4caf50",
  loss: "#f44336",
  primary: "#1890ff",
  secondary: "#722ed1",
  accent: "#13c2c2",
  neutral: "#fa8c16",
};

const SalesDashboard = () => {
  const [day, setDay] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() - 5);
    return now.toISOString().split("T")[0];
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiResponse = await getDashboardData(day);
        const transformedData = transformDashboardData(apiResponse);

        if (!transformedData) {
          throw new Error("Formato de datos incorrecto");
        }

        setDashboardData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [day]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Typography variant="h6">Cargando datos para {day}...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={styles.loadingContainer}>
        <Typography variant="h6">
          No hay datos disponibles para {day}
        </Typography>
      </div>
    );
  }

  // Datos transformados para las gráficas
  const { metrics } = dashboardData;
  const totalProfit = Math.max(metrics.total_profit, 0);
  const totalLoss = Math.max(metrics.total_losses, 0);
  const netProfit = metrics.net_profit;

  const profitLossData = [
    {
      id: 0,
      value: totalProfit,
      label: "Ganancias",
      color: COLOR_PALETTE.profit,
    },
    { id: 1, value: totalLoss, label: "Pérdidas", color: COLOR_PALETTE.loss },
  ];

  const hourlyData = Object.entries(metrics.sales_by_hour || {}).map(
    ([h, s], index) => ({
      id: index,
      hour: `${h}:00`,
      sales: s,
    })
  );

  const categoryData = Object.entries(metrics.sales_by_category || {})
    .map(([n, s], index) => ({ id: index, name: n, value: s }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const customerData = Object.entries(metrics.sales_by_customer || {})
    .map(([n, s], index) => ({ id: index, name: n, sales: s }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const marginData = (metrics.profit_margin_products || [])
    .map((p, index) => ({
      id: index,
      name: p.product_name || `Producto ${index}`,
      margin: p.margin || 0,
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <Typography variant="h5" component="h1" style={{ fontWeight: "bold" }}>
          Resumen del Día
        </Typography>
        <Typography style={styles.dateBadge}>{dashboardData.date}</Typography>
      </div>

      {/* Resumen rápido */}
      <div style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Typography variant="subtitle1">Ganancias Totales</Typography>
          <Typography variant="h5" style={{ color: COLOR_PALETTE.profit }}>
            ${totalProfit.toLocaleString()}
          </Typography>
        </Card>
      </div>

      {/* Gráficas principales */}
      <div style={styles.chartsGrid}>
        <Card style={styles.chartCard}>
          <Typography variant="h6" style={styles.chartTitle}>
            Distribución Ganancias vs Pérdidas
          </Typography>
          <PieChart
            series={[
              {
                data: profitLossData,
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            width={400}
            height={250}
          />
        </Card>

        <Card style={styles.chartCard}>
          <Typography variant="h6" style={styles.chartTitle}>
            Ventas por Hora
          </Typography>
          <LineChart
            xAxis={[
              {
                data: hourlyData.map((item) => item.hour),
                scaleType: "band",
                label: "Hora",
              },
            ]}
            series={[
              {
                data: hourlyData.map((item) => item.sales),
                color: COLOR_PALETTE.primary,
                area: true,
                showMark: false,
              },
            ]}
            width={400}
            height={250}
          />
        </Card>
      </div>

      {/* Segunda fila de gráficas */}
      <div style={styles.chartsGrid}>
        <Card style={styles.chartCard}>
          <Typography variant="h6" style={styles.chartTitle}>
            Top 5 Categorías
          </Typography>
          <BarChart
            xAxis={[
              {
                data: categoryData.map((item) => item.name),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: categoryData.map((item) => item.value),
                color: COLOR_PALETTE.secondary,
              },
            ]}
            width={400}
            height={250}
          />
        </Card>

        <Card style={styles.chartCard}>
          <Typography variant="h6" style={styles.chartTitle}>
            Top 5 Productos por Margen
          </Typography>
          <LineChart
            xAxis={[
              {
                data: marginData.map((item) => item.name),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: marginData.map((item) => item.margin),
                color: COLOR_PALETTE.accent,
                showMark: true,
              },
            ]}
            width={400}
            height={250}
          />
        </Card>
      </div>

      {/* Gráfica de clientes */}
      <div style={{ marginBottom: "16px" }}>
        <Card style={styles.chartCard}>
          <Typography variant="h6" style={styles.chartTitle}>
            Top 6 Clientes
          </Typography>
          <BarChart
            xAxis={[
              {
                data: customerData.map((item) => item.name),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: customerData.map((item) => item.sales),
                color: COLOR_PALETTE.neutral,
              },
            ]}
            width={800}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "0px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "64vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  dateBadge: {
    backgroundColor: "#fff",
    color: "#545454",
    width: "110px",
    padding: "4px 12px",
    borderRadius: "6px",
    border: "0.7px solid #ccc",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  summaryCard: {
    padding: "16px",
    borderRadius: "12px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  chartCard: {
    padding: "16px",
    height: "320px",
    borderRadius: "12px",
  },
  chartTitle: {
    marginBottom: "16px",
  },
};

export default SalesDashboard;
