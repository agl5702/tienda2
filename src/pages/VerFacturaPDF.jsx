import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/requests/orders';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturaPDF from '../components/FacturaPDF.jsx';
import { FaFileDownload } from "react-icons/fa";
import Sidebar from '../components/Sidebar.jsx';
import { BsArrowLeft, BsCalendar, BsFilter } from 'react-icons/bs';
import { NavLink, useLocation } from "react-router-dom";


// Wrapper como componente de clase
class PDFViewerWrapper extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Solo actualizar si cambian los children (el contenido del PDF)
    return this.props.children !== nextProps.children;
  }

  render() {
    return (
      <PDFViewer 
        width="100%" 
        height="100%"
        style={{ 
          border: 'none',
          minHeight: 'calc(98.3vh - 60px)'
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando factura...</span>
      </div>
      <span className="ms-3">Cargando factura...</span>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-3 mt-3">
      <strong>Error:</strong> {error}
    </div>
  );

  if (!order) return (
    <div className="alert alert-warning mx-3 mt-3">
      No se encontró la orden solicitada
    </div>
  );

  // Función para manejar la descarga del PDF
  const handleDownload = () => {
    const blob = new Blob([document.querySelector('iframe').contentDocument.documentElement.outerHTML], {
      type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${order.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (

    <div className="m-0 padding-menu">
      <Sidebar />
        <MenuMovil />
      <div className="col" style={{ backgroundColor: "#282828" }}>
        <div className="container-fluid p-0 vh-100">
          <div className="d-flex justify-content-between align-items-center p-3 shadow-sm" style={{ backgroundColor: "#1b1b1b" }}>
          <NavLink to="/ventas" className="btn btn-sm bg-white text-dark me-2">
              <BsArrowLeft/> Volver
            </NavLink>
            <h4 className="mb-0 text-white">Factura #{order.id}</h4>
            <div>

              <PDFDownloadLink 
                document={<FacturaPDF order={order} />} 
                fileName={`factura_${order.id}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  <button className="btn btn-sm btn-info">
                    {loading ? 'Generando...' : ''}<FaFileDownload className='mt-n1 me-2'/>Descargar Factura
                  </button>
                }
              </PDFDownloadLink>
            </div>
          </div>
          
          <div className="pdf-viewer-container">
            <PDFViewerWrapper>
              <FacturaPDF order={order} />
            </PDFViewerWrapper>
          </div>
        </div>
      </div>
    </div>

  );
};

export default VerFacturaPDF;