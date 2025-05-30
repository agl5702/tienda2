import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReportByDateRange,
  transformApiData,
} from "../services/requests/earnings";
import { BsArrowLeft, BsCalendar, BsFilter, BsEye } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency } from "../services/utils/format";

const ResumenDias = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Últimos 7 días por defecto
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [resumenData, setResumenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const calculateDailySales = (productsData) => {
    if (!productsData) return 0;
    return Object.values(productsData).reduce(
      (sum, product) =>
        sum + product.quantity_sold * (product.real_unit_price || 0),
      0
    );
  };

  const fetchResumenData = async () => {
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
      setResumenData(transformedData);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Error al cargar el reporte. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResumenData();
  };

  const verDetalleDia = (fecha) => {
    navigate(`/reportes/dia/${fecha}`);
  };

  useEffect(() => {
    fetchResumenData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Generando reporte...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-2 px-0">
      <div className="card">
        <div className="card-body px-2">
          <h3 className="mt-n3">Resumen por Día</h3>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-6 col-md-4">
                <label className="form-label">Fecha Inicio</label>
                <div className="input-group border px-3">
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
                <div className="input-group border px-3">
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
                  Filtrar
                </button>
              </div>
            </div>
          </form>

          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {resumenData && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th>
                    <th className="text-end">Ventas</th>
                    <th className="text-end">Ganancias</th>
                    <th className="text-end">Devoluciones</th>
                    <th className="text-end">Productos</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(resumenData.earnings.daily_earnings).map(
                    ([fecha, datos]) => (
                      <tr key={fecha}>
                        <td>{fecha}</td>
                        <td className="text-end">
                          {formatCurrency(
                            calculateDailySales(datos.earnings_by_product)
                          )}
                        </td>
                        <td className="text-end text-success">
                          {formatCurrency(datos.total_profit_day)}
                        </td>
                        <td className="text-end text-danger">
                          {formatCurrency(datos.total_returns_day)}
                        </td>
                        <td className="text-end">
                          {Object.values(datos.earnings_by_product)
                            .reduce((sum, p) => sum + p.quantity_sold, 0)
                            .toFixed(1)}
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => verDetalleDia(fecha)}
                            className="btn btn-sm bg-info"
                          >
                            <BsEye /> Ver
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
                <tfoot className="bg-dark">
                  <tr>
                    <th className="text-white">TOTAL</th>
                    <th className="text-end text-white">
                      {formatCurrency(resumenData.metrics.total_sales)}
                    </th>
                    <th className="text-end text-success">
                      {formatCurrency(resumenData.metrics.total_profit)}
                    </th>
                    <th className="text-end text-danger">
                      {formatCurrency(resumenData.metrics.total_returns)}
                    </th>
                    <th className="text-end text-white">
                      {resumenData.metrics.total_products_sold.toFixed(1)}
                    </th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenDias;
