import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDailyReport,
  transformApiData,
} from "../services/requests/earnings";
import { BsArrowLeft } from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import MenuMovil from "../components/MenuMovil.jsx";

const VerReporte = () => {
  const { date } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiResponse = await getDailyReport(date);

        if (!apiResponse) {
          throw new Error("No se recibieron datos de la API");
        }

        const transformedData = transformApiData(apiResponse, true);

        if (!transformedData) {
          throw new Error("Formato de datos incorrecto");
        }

        setReportData(transformedData);
      } catch (error) {
        console.error("Error al obtener el reporte:", error);
        setError(error.message || "Error al cargar el reporte");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [date]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("es-CO").format(value || 0);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Generando reporte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="btn btn-sm btn-outline-danger ms-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="alert alert-warning">
        No hay datos disponibles para esta fecha
      </div>
    );
  }

  // Preparar datos para el gráfico
  const chartData = [
    {
      name: reportData.earnings.date || date,
      ganancias: reportData.metrics.total_profit,
      neto: reportData.metrics.net_profit,
      devoluciones: reportData.metrics.total_returns,
    },
  ];

  return (
    <div className="m-0 padding-menu">
      <Sidebar />
        <MenuMovil />
      <div className="col" style={{ minHeight: "100vh" }}>
        <div className="container-fluid py-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <BsArrowLeft /> Volver
                </button>
                <h3 className="d-inline-block mb-0">
                  Reporte Detallado - {reportData.earnings.date || date}
                </h3>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card border-success h-100">
                    <div className="card-header bg-success text-white">
                      Ventas Totales
                    </div>
                    <div className="card-body">
                      <h4 className="card-title text-center">
                        {formatCurrency(reportData.metrics.total_sales)}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-primary h-100">
                    <div className="card-header bg-primary text-white">
                      Ganancias Totales
                    </div>
                    <div className="card-body">
                      <h4 className="card-title text-center">
                        {formatCurrency(reportData.metrics.total_profit)}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-warning h-100">
                    <div className="card-header bg-warning text-white">
                      Devoluciones
                    </div>
                    <div className="card-body">
                      <h4 className="card-title text-center">
                        {formatCurrency(reportData.metrics.total_returns)}
                      </h4>
                      <p className="text-muted text-center mb-0">
                        Neto: {formatCurrency(reportData.metrics.net_profit)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-info h-100">
                    <div className="card-header bg-info text-white">
                      Productos Vendidos
                    </div>
                    <div className="card-body">
                      <h4 className="card-title text-center">
                        {formatNumber(reportData.metrics.total_products_sold)}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Resumen del Día</h5>
                    </div>
                    <div className="card-body" style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={() => reportData.earnings.date || date}
                          />
                          <Legend />
                          <Bar
                            dataKey="ganancias"
                            fill="#4e73df"
                            name="Ganancias"
                          />
                          <Bar dataKey="neto" fill="#1cc88a" name="Neto" />
                          <Bar
                            dataKey="devoluciones"
                            fill="#e74a3b"
                            name="Devoluciones"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de productos */}
              <h4 className="mb-3">Detalle por Producto</h4>
              <div className="table-responsive mb-4">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Cantidad</th>
                      <th className="text-end">Precio Unitario</th>
                      <th className="text-end">Ganancia Unitaria</th>
                      <th className="text-end">Ganancia Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(reportData.earnings.earnings_by_product).map(
                      (product, index) => (
                        <tr key={index}>
                          <td>{product.product_name}</td>
                          <td className="text-end">
                            {product.quantity_sold % 1 === 0
                              ? product.quantity_sold
                              : product.quantity_sold.toFixed(2)}
                          </td>
                          <td className="text-end">
                            {formatCurrency(product.real_unit_price)}
                          </td>
                          <td className="text-end">
                            {product.quantity_sold > 0
                              ? formatCurrency(
                                  product.total_actual_profit /
                                    product.quantity_sold
                                )
                              : formatCurrency(0)}
                          </td>
                          <td className="text-end text-success fw-bold">
                            {formatCurrency(product.total_actual_profit)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="table-active">
                      <th colSpan="4">Total</th>
                      <th className="text-end">
                        {formatCurrency(reportData.metrics.total_profit)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default VerReporte;
