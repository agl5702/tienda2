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
  const [debt, setDebt] = useState([]); // Inicializado como array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la orden
        const orderData = await getOrderById(id);
        setOrder(orderData);

        // Obtener la deuda del cliente si existe
        if (orderData?.customer?.id) {
          try {
            const debtData = await getDebtsById(orderData.customer.id);
            console.log("Datos de deuda:", debtData); // Para verificar los datos
            setDebt(Array.isArray(debtData) ? debtData : []);
          } catch (debtError) {
            console.warn("No se pudo obtener la deuda:", debtError);
            setDebt([]);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
            <h4 className="mb-0 text-white">Factura #{order.id}</h4>
            <div>
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
