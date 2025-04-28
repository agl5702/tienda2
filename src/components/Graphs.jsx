import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  getEarningsByDay,
  getMetricsByDay,
} from "../services/requests/earnings";
import { Card, Spin, Statistic, Tag } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

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
        console.log("Datos de earnings:", e);
        console.log("Datos de metrics:", m);
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
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Spin size="large" />
        <p className="text-gray-500">Cargando datos para {day}...</p>
      </div>
    );
  }

  // Datos transformados
  const totalProfit = Math.max(earnings.total_profit_day, 0);
  const totalLoss = Math.max(earnings.total_losses, 0);
  const netProfit = totalProfit - totalLoss;

  const profitLossData = [
    { name: "Ganancias", value: totalProfit, color: COLOR_PALETTE.profit },
    { name: "Pérdidas", value: totalLoss, color: COLOR_PALETTE.loss },
  ];

  const hourlyData = Object.entries(metrics.sales_by_hour).map(([h, s]) => ({
    hour: `${h}:00`,
    sales: s,
  }));

  const categoryData = Object.entries(metrics.sales_by_category)
    .map(([n, s]) => ({ name: n, value: s }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const customerData = Object.entries(metrics.sales_by_customer)
    .map(([n, s]) => ({ name: n, sales: s }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const marginData = metrics.profit_margin_products
    .map((p) => ({ name: p.product_name, margin: p.margin }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  // Componentes personalizados
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-medium">
                ${entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de Ventas
        </h1>
        <Tag color="blue" className="text-lg px-3 py-1">
          {day}
        </Tag>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic
            title="Ganancias Totales"
            value={totalProfit}
            prefix={<DollarOutlined />}
            valueStyle={{ color: COLOR_PALETTE.profit }}
            suffix="$"
          />
        </Card>
        <Card>
          <Statistic
            title="Pérdidas Totales"
            value={totalLoss}
            prefix={<DollarOutlined />}
            valueStyle={{ color: COLOR_PALETTE.loss }}
            suffix="$"
          />
        </Card>
        <Card>
          <Statistic
            title="Beneficio Neto"
            value={netProfit}
            prefix={<DollarOutlined />}
            valueStyle={{
              color: netProfit >= 0 ? COLOR_PALETTE.profit : COLOR_PALETTE.loss,
            }}
            suffix="$"
          />
        </Card>
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de ganancias/pérdidas */}
        <Card
          title="Distribución Ganancias vs Pérdidas"
          extra={<PieChartOutlined className="text-blue-500" />}
          className="shadow-sm"
        >
          <div style={{ width: "100%", height: 300 }}>
            {" "}
            {/* Cambiado de 400 a 300 */}
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%" /* Ajustado de 20% a 30% */
                outerRadius="90%" /* Ajustado de 80% a 90% */
                data={profitLossData}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar
                  minAngle={15}
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize: 10,
                  }} /* Añadido fontSize */
                  background
                  clockWise
                  dataKey="value"
                >
                  {profitLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Legend
                  iconSize={10}
                  layout="horizontal" /* Cambiado de vertical a horizontal */
                  verticalAlign="bottom" /* Añadido para mejor posicionamiento */
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Ventas por hora */}
        <Card
          title="Ventas por Hora"
          extra={<BarChartOutlined className="text-purple-500" />}
          className="shadow-sm"
        >
          <div style={{ width: "100%", height: 300 }}>
            {" "}
            {/* Cambiado de 400 a 300 */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }} /* Margen derecho reducido */
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="hour" fontSize={12} /> /* Añadido fontSize */
                <YAxis fontSize={12} /> /* Añadido fontSize */
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={COLOR_PALETTE.primary}
                  fill={COLOR_PALETTE.primary}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ventas por categoría */}
        <Card
          title="Top 5 Categorías"
          extra={<ShoppingOutlined className="text-green-500" />}
          className="shadow-sm"
        >
          <div style={{ width: "100%", height: 300 }}>
            {" "}
            {/* Cambiado de 400 a 300 */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }} /* Margen derecho reducido */
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} /> /* Añadido fontSize */
                <YAxis fontSize={12} /> /* Añadido fontSize */
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name="Ventas"
                  fill={COLOR_PALETTE.secondary}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLOR_PALETTE.secondary}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Margen de beneficio */}
        <Card
          title="Top 5 Productos por Margen"
          extra={<PieChartOutlined className="text-orange-500" />}
          className="shadow-sm"
        >
          <div style={{ width: "100%", height: 300 }}>
            {" "}
            {/* Cambiado de 400 a 300 */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marginData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }} /* Margen derecho reducido */
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} /> /* Añadido fontSize */
                <YAxis fontSize={12} /> /* Añadido fontSize */
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke={COLOR_PALETTE.accent}
                  strokeWidth={2}
                  dot={{ r: 3 }} /* Reducido de 4 a 3 */
                  activeDot={{ r: 4 }} /* Reducido de 6 a 4 */
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tercera fila */}
      <div className="grid grid-cols-1 gap-6">
        {/* Mejores clientes */}
        <Card
          title="Top 6 Clientes"
          extra={<UserOutlined className="text-cyan-500" />}
          className="shadow-sm"
        >
          <div style={{ width: "100%", height: 300 }}>
            {" "}
            {/* Cambiado de 400 a 300 */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }} /* Margen derecho reducido */
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} /> /* Añadido fontSize */
                <YAxis fontSize={12} /> /* Añadido fontSize */
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="sales"
                  name="Ventas"
                  fill={COLOR_PALETTE.neutral}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;
