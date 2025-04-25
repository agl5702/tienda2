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
    <div className="">
      <h3 className="text-3xl font-bold text-center">Dashboard de Ventas {day}</h3>

      {/* Earnings */}
      <div className="row m-0">
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Ganancias vs Pérdidas (Pie)</h4>
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
          
        </div>
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Ganancias y Pérdidas (Barras)</h4>
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
      </div>

      {/* Metrics */}
      <div className="row m-0">
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Ventas por Hora</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={M_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
          
        </div>
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Ventas por Categoría</h4>
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
          
        </div>
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Ventas por Cliente</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={customerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={M_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
          
        </div>
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Promedio Compra / Cliente</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avgData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill={M_COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
          
        </div>
        <div className="col-12 col-md-6 p-2">
          <div className="card p-2">
            <h4 className="text-center text-muted ">Margen Beneficio</h4>
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
    </div>
  );
};

export default SalesDashboard;
