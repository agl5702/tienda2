import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getMetricsByDay } from "../services/requests/earnings"; // ajusta la ruta si hiciste un request aparte

const MetricsGraphs = () => {
  const [metrics, setMetrics] = useState(null);
  const [day, setDay] = useState("2025-04-24");

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getMetricsByDay(day);
      setMetrics(data);
    };
    fetchMetrics();
  }, [day]);

  if (!metrics) {
    return (
      <div className="text-center text-lg text-gray-600">
        Cargando métricas para el {day}...
      </div>
    );
  }

  const {
    total_sales,
    total_quantity,
    most_sold_product,
    sales_by_customer,
    avg_purchase_per_customer,
    sales_by_category,
    profit_margin_products,
    sales_by_hour,
    orders_count,
  } = metrics;

  // Transformar objetos en arrays para Recharts
  const hourlyData = Object.entries(sales_by_hour).map(([hour, sales]) => ({
    hour,
    sales,
  }));
  const categoryData = Object.entries(sales_by_category).map(
    ([name, sales]) => ({ name, sales })
  );
  const customerData = Object.entries(sales_by_customer).map(
    ([name, sales]) => ({ name, sales })
  );
  const avgPurchaseData = Object.entries(avg_purchase_per_customer).map(
    ([name, avg]) => ({ name, avg })
  );
  const marginData = profit_margin_products.map((p) => ({
    name: p.product_name,
    margin: p.margin,
  }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
  ];

  return (
    <div className="p-6 space-y-8 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center">
        Métricas del día: {day}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ventas por hora */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Ventas por Hora</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Categoría */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="sales"
                nameKey="name"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Cliente */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Ventas por Cliente</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Promedio de Compra por Cliente */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Promedio de Compra por Cliente
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgPurchaseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill={COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Márgenes de Producto */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Márgenes de Beneficio por Producto
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={marginData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="margin" fill={COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen textual */}
      <div className="mt-6 space-y-2 text-gray-700">
        <p>
          <strong>Total Ventas:</strong> ${total_sales}
        </p>
        <p>
          <strong>Total Cantidad Vendida:</strong> {total_quantity}
        </p>
        <p>
          <strong>Producto más Vendido:</strong> {most_sold_product}
        </p>
        <p>
          <strong>Número de Órdenes:</strong> {orders_count}
        </p>
      </div>
    </div>
  );
};

export default MetricsGraphs;
