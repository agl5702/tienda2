import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEarningsByDay, getMetricsByDay } from '../services/requests/earnings';
import { BsArrowLeft } from 'react-icons/bs';

const VerReporte = () => {
  const { date } = useParams();
  const [earningsData, setEarningsData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [earnings, metrics] = await Promise.all([
          getEarningsByDay(date),
          getMetricsByDay(date)
        ]);
        setEarningsData(earnings);
        setMetricsData(metrics);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [date]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!earningsData || !metricsData) {
    return (
      <div className="alert alert-danger">
        No se pudo cargar el reporte para esta fecha
      </div>
    );
  }

  const productsArray = Object.values(earningsData.earnings_by_product || {});

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header">
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-sm btn-outline-primary me-2"
          >
            <BsArrowLeft /> Volver
          </button>
          <h3 className="d-inline-block mb-0">Reporte Detallado - {date}</h3>
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
                    {formatCurrency(metricsData.total_sales)}
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
                    {formatCurrency(metricsData.total_profit_day)}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-warning h-100">
                <div className="card-header bg-warning text-white">
                  Pérdidas Totales
                </div>
                <div className="card-body">
                  <h4 className="card-title text-center">
                    {formatCurrency(metricsData.total_losses)}
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
                    {productsArray.length}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <h4 className="mb-3">Detalle por Producto</h4>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-end">Ganancia Total</th>
                </tr>
              </thead>
              <tbody>
                {productsArray.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td className="text-end">{product.quantity_sold}</td>
                    <td className="text-end">
                      {formatCurrency(product.real_unit_price)}
                    </td>
                    <td className="text-end text-success fw-bold">
                      {formatCurrency(product.total_actual_profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerReporte;