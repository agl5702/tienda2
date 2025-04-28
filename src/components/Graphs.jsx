import React, { useState, useEffect } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Card, Typography } from "@mui/material";
import {
  getEarningsByDay,
  getMetricsByDay,
} from "../services/requests/earnings";

// Paleta de colores moderna
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

  const [earnings, setEarnings] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [e, m] = await Promise.all([
          getEarningsByDay(day),
          getMetricsByDay(day),
        ]);
        setEarnings(e);
        setMetrics(m);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [day]);

  if (loading || !earnings || !metrics) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "64vh",
        }}
      >
        <Typography variant="h6">Cargando datos para {day}...</Typography>
      </div>
    );
  }

  // Datos transformados
  const totalProfit = Math.max(earnings.total_profit_day, 0);
  const totalLoss = Math.max(earnings.total_losses, 0);
  const netProfit = totalProfit - totalLoss;

  const profitLossData = [
    {
      id: 0,
      value: totalProfit,
      label: "Ganancias",
      color: COLOR_PALETTE.profit,
    },
    { id: 1, value: totalLoss, label: "Pérdidas", color: COLOR_PALETTE.loss },
  ];

  const hourlyData = Object.entries(metrics.sales_by_hour).map(
    ([h, s], index) => ({
      id: index,
      hour: `${h}:00`,
      sales: s,
    })
  );

  const categoryData = Object.entries(metrics.sales_by_category)
    .map(([n, s], index) => ({ id: index, name: n, value: s }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const customerData = Object.entries(metrics.sales_by_customer)
    .map(([n, s], index) => ({ id: index, name: n, sales: s }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const marginData = metrics.profit_margin_products
    .map((p, index) => ({ id: index, name: p.product_name, margin: p.margin }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h4" component="h1" style={{ fontWeight: "bold" }}>
          Dashboard de Ventas
        </Typography>
        <Typography
          variant="body1"
          style={{
            backgroundColor: COLOR_PALETTE.primary,
            color: "white",
            padding: "4px 12px",
            borderRadius: "16px",
          }}
        >
          {day}
        </Typography>
      </div>

      {/* Resumen rápido */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <Card style={{ padding: "16px" }}>
          <Typography variant="subtitle1">Ganancias Totales</Typography>
          <Typography variant="h5" style={{ color: COLOR_PALETTE.profit }}>
            ${totalProfit.toLocaleString()}
          </Typography>
        </Card>
        <Card style={{ padding: "16px" }}>
          <Typography variant="subtitle1">Pérdidas Totales</Typography>
          <Typography variant="h5" style={{ color: COLOR_PALETTE.loss }}>
            ${totalLoss.toLocaleString()}
          </Typography>
        </Card>
        <Card style={{ padding: "16px" }}>
          <Typography variant="subtitle1">Beneficio Neto</Typography>
          <Typography
            variant="h5"
            style={{
              color: netProfit >= 0 ? COLOR_PALETTE.profit : COLOR_PALETTE.loss,
            }}
          >
            ${netProfit.toLocaleString()}
          </Typography>
        </Card>
      </div>

      {/* Gráficas principales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Gráfico de ganancias/pérdidas */}
        <Card style={{ padding: "16px", height: "320px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
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

        {/* Ventas por hora */}
        <Card style={{ padding: "16px", height: "320px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Ventas por categoría */}
        <Card style={{ padding: "16px", height: "320px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
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

        {/* Margen de beneficio */}
        <Card style={{ padding: "16px", height: "320px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
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
      <div style={{ marginBottom: "24px" }}>
        <Card style={{ padding: "16px", height: "320px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
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

export default SalesDashboard;
