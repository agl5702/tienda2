import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/requests/orders";
import { getDebtByCustomerId } from "../services/requests/debts";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "../components/FacturaPDF.jsx";
import { FaFileDownload } from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import { BsArrowLeft } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import MenuMovil from "../components/MenuMovil.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx"

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
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener la orden
        const orderData = await getOrderById(id);
        setOrder(orderData);

        // 2. Si la orden tiene un cliente, obtener su saldo
        if (orderData?.customer?.id) {
          const debtData = await getDebtByCustomerId(orderData.customer.id);
          setCurrentBalance(debtData?.current_balance || 0);
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
        <button 
          className="btn btn-sm btn-primary ms-2" 
          onClick={() => window.location.reload()}
        >
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
            <NavLink to="/ventas" className="btn btn-sm bg-white text-dark me-2">
              <BsArrowLeft /> Volver
            </NavLink>
            <div>
              <h4 className="mb-0 text-white">Factura No. {order.id}</h4>
            </div>
            <div className="d-flex align-items-center">
            {/* <WhatsAppButton
              invoiceId={order.id}          // ID de la factura
              defaultMessage="Hola, Se ha generado la factura de tu pedido, Mirala desde este link:" // Mensaje opcional
            /> */}
              <PDFDownloadLink className="ms-2"
                document={<FacturaPDF order={order} currentBalance={currentBalance} />}
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
              <FacturaPDF order={order} currentBalance={currentBalance} />
            </PDFViewerWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerFacturaPDF;