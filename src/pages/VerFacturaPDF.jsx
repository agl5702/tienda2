import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/requests/orders';
import { PDFViewer } from '@react-pdf/renderer';
import FacturaPDF from '../components/FacturaPDF';

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
          minHeight: 'calc(100vh - 60px)'
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
    <div className="container-fluid p-0 vh-100">
      <div className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
        <h4 className="mb-0">Factura #{order.id}</h4>
        <div>
          <button 
            onClick={handleDownload}
            className="btn btn-primary btn-sm"
          >
            <i className="bi bi-download me-2"></i>Descargar PDF
          </button>
        </div>
      </div>
      
      <div className="pdf-viewer-container">
        <PDFViewerWrapper>
          <FacturaPDF order={order} />
        </PDFViewerWrapper>
      </div>
    </div>
  );
};

export default VerFacturaPDF;