import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReportByDateRange,
  transformApiData,
} from "../services/requests/earnings";
import { BsArrowLeft, BsCalendar, BsFilter } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const VerReporteRango = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const calculateDailySales = (productsData) => {
    if (!productsData) return 0;
    return Object.values(productsData).reduce(
      (sum, product) =>
        sum + product.quantity_sold * (product.real_unit_price || 0),
      0
    );
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchReportData = async () => {
    if (startDate > endDate) {
      setError("La fecha de inicio no puede ser mayor a la fecha final");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);

      const apiResponse = await getReportByDateRange(
        formattedStart,
        formattedEnd
      );
      const transformedData = transformApiData(apiResponse);
      setReportData(transformedData);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Error al cargar el reporte. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
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

  return (
    <div className="container-fluid pt-3 px-0">
      <div className="card mb-4">
        <div className="card-body p-4">
          <h3 className="d-inline-block mb-0">Reporte por Rango de Fechas</h3>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-6 col-md-4">
                <label className="form-label">Fecha Inicio</label>
                <div className="input-group border ps-3">
                  <span className="input-group-text pe-3">
                    <BsCalendar />
                  </span>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <div className="col-6 col-md-4">
                <label className="form-label">Fecha Fin</label>
                <div className="input-group border ps-3">
                  <span className="input-group-text pe-3">
                    <BsCalendar />
                  </span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <BsFilter className="me-1" />
                  )}
                  Generar Reporte
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {reportData && (
        <>
          <div className="row mb-4">
            <div className="col-12 col-sm-6 col-md-3 mb-3">
              <div className="card border-success h-100">
                <div className="card-header bg-success text-white">
                  Ventas Totales
                </div>
                <div className="card-body">
                  <h4 className="card-title text-center">
                    {formatCurrency(reportData.metrics.total_sales)}
                  </h4>
                  <p className="text-muted text-center mb-0">
                    {reportData.metrics.days_with_sales} días con ventas
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3 mb-3">
              <div className="card border-primary h-100">
                <div className="card-header bg-primary text-white">
                  Ganancias Totales
                </div>
                <div className="card-body">
                  <h4 className="card-title text-center">
                    {formatCurrency(reportData.metrics.total_profit)}
                  </h4>
                  <p className="text-muted text-center mb-0">
                    {formatCurrency(reportData.metrics.average_profit_per_day)}{" "}
                    diario
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3 mb-3">
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
            <div className="col-12 col-sm-6 col-md-3 mb-3">
              <div className="card border-info h-100">
                <div className="card-header bg-info text-white">
                  Productos Vendidos
                </div>
                <div className="card-body">
                  <h4 className="card-title text-center">
                    {reportData.metrics.total_products_sold.toFixed(1)}
                  </h4>
                  <p className="text-muted text-center mb-0">
                    {(
                      reportData.metrics.total_products_sold /
                      reportData.metrics.days_with_sales
                    ).toFixed(1)}{" "}
                    diario
                  </p>
                </div>
              </div>
            </div>
          </div>

          {reportData.earnings.daily_data?.length > 0 && (
            <div className="row mb-4 mt-n3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Resumen por Día</h5>
                  </div>
                  <div className="card-body" style={{ height: "400px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reportData.earnings.daily_data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar
                          dataKey="ganancias"
                          fill="#4e73df"
                          name="Ganancias"
                        />
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
          )}

          <div className="card p-3 mb-4">
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
                  {Object.values(reportData.earnings.earnings_by_product).map(
                    (product, index) => (
                      <tr key={index}>
                        <td>{product.product_name}</td>
                        <td className="text-end">
                          {product.quantity_sold.toFixed(1)}
                        </td>
                        <td className="text-end">
                          {formatCurrency(
                            product.total_actual_profit / product.quantity_sold
                          )}
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
                    <th colSpan="3">Total</th>
                    <th className="text-end">
                      {formatCurrency(reportData.metrics.total_profit)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>Resumen por Día</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Fecha</th>
                      <th className="text-end">Ventas totales</th>
                      <th className="text-end">Ganancias</th>
                      <th className="text-end">Devoluciones</th>
                      <th className="text-end">Productos Vendidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.earnings.daily_earnings).map(
                      ([date, data], index) => (
                        <tr key={index}>
                          <td>{date}</td>
                          <td className="text-end">
                            {formatCurrency(
                              calculateDailySales(data.earnings_by_product)
                            )}
                          </td>
                          <td className="text-end">
                            {formatCurrency(data.total_profit_day)}
                          </td>
                          <td className="text-end">
                            {formatCurrency(data.total_returns_day)}
                          </td>
                          <td className="text-end">
                            {Object.values(data.earnings_by_product)
                              .reduce((sum, p) => sum + p.quantity_sold, 0)
                              .toFixed(1)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot className="table-active">
                    <tr>
                      <th>TOTALES</th>
                      <th className="text-end">
                        {formatCurrency(
                          Object.values(
                            reportData.earnings.daily_earnings
                          ).reduce(
                            (sum, data) =>
                              sum +
                              calculateDailySales(data.earnings_by_product),
                            0
                          )
                        )}
                      </th>
                      <th className="text-end">
                        {formatCurrency(reportData.metrics.total_profit)}
                      </th>
                      <th className="text-end">
                        {formatCurrency(reportData.metrics.total_returns)}
                      </th>
                      <th className="text-end">
                        {reportData.metrics.total_products_sold.toFixed(1)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VerReporteRango;
