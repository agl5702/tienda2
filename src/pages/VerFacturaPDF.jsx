import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/requests/orders";
import { getDebtsById } from "../services/requests/debts";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "../components/FacturaPDF.jsx";
import { FaFileDownload } from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import { BsArrowLeft } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import MenuMovil from "../components/MenuMovil.jsx";

// Wrapper como componente de clase
class PDFViewerWrapper extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.children !== nextProps.children;
  }

  render() {
    return (
      <PDFViewer
        width="100%"
        height="100%"
        style={{
          border: "none",
          minHeight: "calc(98.3vh - 60px)",
        }}
      >
        {this.props.children}
      </PDFViewer>
    );
  }
}

const VerFacturaPDF = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [debt, setDebt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Función para cargar la deuda
  const loadDebt = async (customerId) => {
    try {
      const debtData = await getDebtsById(customerId);
      console.log("Datos de deuda actualizados:", debtData);
      setDebt(Array.isArray(debtData) ? debtData : []);
      setLastUpdated(new Date());
    } catch (debtError) {
      console.warn("No se pudo obtener la deuda:", debtError);
      setDebt([]);
    }
  };

  // Función para recargar los datos
  const reloadData = async () => {
    setLoading(true);
    try {
      const orderData = await getOrderById(id);
      setOrder(orderData);

      if (orderData?.customer?.id) {
        await loadDebt(orderData.customer.id);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, [id]);

  // Actualización periódica cada 30 segundos
  useEffect(() => {
    if (order?.customer?.id) {
      const interval = setInterval(() => {
        loadDebt(order.customer.id);
      }, 30000); // Actualiza cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [order?.customer?.id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando factura...</span>
        </div>
        <span className="ms-3">Cargando factura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3">
        <strong>Error:</strong> {error}
        <button className="btn btn-sm btn-primary ms-2" onClick={reloadData}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="alert alert-warning mx-3 mt-3">
        No se encontró la orden solicitada
      </div>
    );
  }

  return (
    <div className="m-0 padding-menu">
      <Sidebar />
      <MenuMovil />
      <div className="col" style={{ backgroundColor: "#282828" }}>
        <div className="container-fluid p-0 vh-100">
          <div
            className="d-flex justify-content-between align-items-center p-3 shadow-sm"
            style={{ backgroundColor: "#1b1b1b" }}
          >
            <NavLink
              to="/ventas"
              className="btn btn-sm bg-white text-dark me-2"
            >
              <BsArrowLeft /> Volver
            </NavLink>
            <div>
              <h4 className="mb-0 text-white">Factura #{order.id}</h4>
              {lastUpdated && (
                <small className="text-muted">
                  Actualizado: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() =>
                  order?.customer?.id && loadDebt(order.customer.id)
                }
              >
                Actualizar Deuda
              </button>
              <PDFDownloadLink
                document={<FacturaPDF order={order} debt={debt} />}
                fileName={`factura_${order.id}.pdf`}
              >
                {({ loading }) => (
                  <button className="btn btn-sm btn-info">
                    {loading ? "Generando..." : ""}
                    <FaFileDownload className="mt-n1 me-2" />
                    Descargar Factura
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          <div className="pdf-viewer-container">
            <PDFViewerWrapper>
              <FacturaPDF order={order} debt={debt} />
            </PDFViewerWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerFacturaPDF;
