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
} from "recharts";
import { getEarningsByDay, getMetricsByDay } from "../services/requests/earnings";

const SalesDashboard = () => {
  const [day, setDay] = useState("2025-04-24");
  const [earnings, setEarnings] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [e, m] = await Promise.all([
        getEarningsByDay(day),
        getMetricsByDay(day)
      ]);
      setEarnings(e);
      setMetrics(m);
    };
    fetchAll();
  }, [day]);

  if (!earnings || !metrics) {
    return <div className="text-center text-lg text-gray-600">Cargando datos para {day}...</div>;
  }

  // Earnings pie & bar data
  const total = Math.max(earnings.total_profit_day, 0) + Math.max(earnings.total_losses, 0);
  const profitLoss = [
    {
      name: "Ganancias",
      value: Math.max(earnings.total_profit_day, 0),
      percent: total > 0 ? Math.max(earnings.total_profit_day, 0) / total : 0,
    },
    {
      name: "Pérdidas",
      value: Math.max(earnings.total_losses, 0),
      percent: total > 0 ? Math.max(earnings.total_losses, 0) / total : 0,
    },
  ];
  const E_COLORS = ["#52C41A", "#FF4D4F"];

  // Metrics data transforms
  const {
    sales_by_hour,
    sales_by_category,
    sales_by_customer,
    avg_purchase_per_customer,
    profit_margin_products,
  } = metrics;

  const hourlyData = Object.entries(sales_by_hour).map(([h, s]) => ({ hour: h, sales: s }));
  const categoryData = Object.entries(sales_by_category).map(([n, s]) => ({ name: n, sales: s }));
  const customerData = Object.entries(sales_by_customer).map(([n, s]) => ({ name: n, sales: s }));
  const avgData = Object.entries(avg_purchase_per_customer).map(([n, v]) => ({ name: n, avg: v }));
  const marginData = profit_margin_products.map(p => ({ name: p.product_name, margin: p.margin }));
  const M_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-8">
      <h1 className="text-3xl font-bold text-center">Dashboard de Ventas: {day}</h1>

      {/* Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ganancias vs Pérdidas (Pie)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profitLoss}
                dataKey="percent"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}
              >
                {profitLoss.map((_, i) => <Cell key={i} fill={E_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(_, name, props) => [`${(props.payload.percent*100).toFixed(0)}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ganancias y Pérdidas (Barras)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={profitLoss}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name]} />
              <Bar dataKey="value" fill={E_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ventas por Hora</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={M_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ventas por Categoría</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="sales"
                nameKey="name"
                outerRadius={80}
                label
              >
                {categoryData.map((_, i) => <Cell key={i} fill={M_COLORS[i % M_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ventas por Cliente</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={customerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={M_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Promedio Compra / Cliente</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avgData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill={M_COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Margen Beneficio</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={marginData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="margin" fill={M_COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
