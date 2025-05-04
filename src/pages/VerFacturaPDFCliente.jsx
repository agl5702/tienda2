import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/requests/orders";
import { getDebtByCustomerId } from "../services/requests/debts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "../components/FacturaPDF.jsx";
import { FaFileDownload } from "react-icons/fa";
import Navbar from "../components/Footer.jsx";

const VerFacturaPDFCliente = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cedula, setCedula] = useState("");
  const [validationError, setValidationError] = useState("");
  const [validationStep, setValidationStep] = useState("initial"); // 'initial', 'validating', 'validated', 'error'

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const orderData = await getOrderById(id);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar información de la factura");
        setLoading(false);
        setValidationStep('error');
      }
    };

    fetchInitialData();
  }, [id]);

  const handleValidation = async (e) => {
    e.preventDefault();
    
    if (!cedula) {
      setValidationError("Por favor ingrese su número de cédula");
      return;
    }

    if (!order) {
      setValidationError("Error al validar la factura");
      setValidationStep('error');
      return;
    }

    setValidationStep('validating');
    setValidationError("");

    try {
      const cedulaRegistrada = order.customer?.cc?.toString().trim().toLowerCase();
      const cedulaIngresada = cedula.trim().toLowerCase();

      if (cedulaRegistrada !== cedulaIngresada) {
        throw new Error("La cédula no coincide con la registrada en la factura");
      }

      // Obtener datos adicionales necesarios para el PDF
      if (order?.customer?.id) {
        const debtData = await getDebtByCustomerId(order.customer.id);
        setCurrentBalance(debtData?.current_balance || 0);
      }

      setValidationStep('validated');
    } catch (err) {
      setValidationError(err.message);
      setValidationStep('initial');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || validationStep === 'error') {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <div className="card-body text-center">
            <div className="bg-white p-2 mx-auto mt-n7" style={{width:"130px", borderRadius:"50%", height:"127px"}}>
              <img src="/logo_empresa.png" className="icon icon-xl pt-2" alt="logo" />
            </div>
            <h3 className="mb-4">Error</h3>
            <p className="mb-4 text-danger">{error || "Ocurrió un error al procesar su solicitud"}</p>
            <button 
              className="btn btn-info"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
          <div className="mb-n5">
            <Navbar/>
          </div>
        </div>
      </div>
    );
  }

  if (validationStep === 'initial' || validationStep === 'validating') {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <div className="card-body text-center">
            <div className="bg-white p-2 mx-auto mt-n7" style={{width:"130px", borderRadius:"50%", height:"127px"}}>
              <img src="/logo_empresa.png" className="icon icon-xl pt-2" alt="logo" />
            </div>
            <h3 className="mb-4">Validar Factura</h3>
            <p className="mb-4">Por favor ingrese su número de cédula para descargar la factura</p>
            
            <form onSubmit={handleValidation}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control border px-2 border-2"
                  placeholder="Número de cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
                {validationError && (
                  <div className="text-danger mt-2">{validationError}</div>
                )}
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-info"
                  disabled={validationStep === 'validating'}
                >
                  {validationStep === 'validating' ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Validando...
                    </>
                  ) : (
                    "Validar"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="mb-n5">
            <Navbar/>
          </div>
        </div>
      </div>
    );
  }

  if (validationStep === 'validated' && order) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <div className="card-body text-center">
            <div className="bg-white p-2 mx-auto mt-n7" style={{width:"130px", borderRadius:"50%", height:"127px"}}>
              <img src="/logo_empresa.png" className="icon icon-xl pt-2" alt="logo" />
            </div>
            <h3 className="mb-4">Factura Validada</h3>
            <p className="mb-4">¡Validación exitosa! Ahora puedes descargar tu factura.</p>
            
            <div className="d-grid gap-2">
              <PDFDownloadLink
                document={
                  <FacturaPDF 
                    order={order} 
                    currentBalance={currentBalance}
                    customerCc={order?.customer?.cc || "No especificado"}
                  />
                }
                fileName={`factura_${order.id}.pdf`}
                className="btn btn-success text-white"
              >
                {({ loading: pdfLoading }) => (
                  <>
                    {pdfLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <FaFileDownload className="me-2 h5 my-auto text-white" />
                        Descargar Factura
                      </>
                    )}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
          <div className="mb-n5">
            <Navbar/>
          </div>
        </div>
      </div>
    );
  }

  // Estado inesperado - recargamos la página automáticamente
  useEffect(() => {
    if (!loading && !error && validationStep !== 'initial' && validationStep !== 'validating' && validationStep !== 'validated') {
      window.location.reload();
    }
  }, [loading, error, validationStep]);

  return null;
};

export default VerFacturaPDFCliente;