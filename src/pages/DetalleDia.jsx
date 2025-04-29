import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDailyReport, transformApiData } from '../services/requests/earnings';
import { BsArrowLeft } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../services/utils/format';
import Sidebar from '../components/Sidebar.jsx';

const DetalleDia = () => {
  const { date } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiResponse = await getDailyReport(date);
        const transformedData = transformApiData(apiResponse, true);
        setReportData(transformedData);
      } catch (error) {
        console.error('Error fetching daily report:', error);
        setError('Error al cargar el reporte del día. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando reporte del día...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="alert alert-warning">
        No se encontraron datos para este día
      </div>
    );
  }

  // Preparar datos para gráfico por producto
  const productChartData = Object.values(reportData.earnings.earnings_by_product)
    .map(product => ({
      name: product.product_name,
      ganancia: product.total_actual_profit,
      cantidad: product.quantity_sold
    }));

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
                <BsArrowLeft /> Volver al resumen
              </button>
              <h3 className="d-inline-block mb-0">Reporte Detallado - {date}</h3>
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
                      {reportData.metrics.total_products_sold.toFixed(1)}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h5>Ganancias por Producto</h5>
                  </div>
                  <div className="card-body" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productChartData}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip 
                          formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value}
                        />
                        <Legend />
                        <Bar dataKey="ganancia" fill="#4e73df" name="Ganancia" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h5>Cantidad Vendida por Producto</h5>
                  </div>
                  <div className="card-body" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productChartData}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cantidad" fill="#1cc88a" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="mb-3">Detalle por Producto</h4>
            <div className="table-responsive mb-4">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Cantidad</th>
                    <th className="text-end">Ganancia Unitaria</th>
                    <th className="text-end">Ganancia Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(reportData.earnings.earnings_by_product).map((product, index) => (
                    <tr key={index}>
                      <td>{product.product_name}</td>
                      <td className="text-end">{product.quantity_sold.toFixed(1)}</td>
                      <td className="text-end">
                        {formatCurrency(product.total_actual_profit / product.quantity_sold)}
                      </td>
                      <td className="text-end text-success fw-bold">
                        {formatCurrency(product.total_actual_profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-active">
                    <th colSpan="3">Total</th>
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

export default DetalleDia;