import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFileDownload } from "react-icons/fa";
import { getDebtByCustomerId } from "../services/requests/debts";
import FacturaPDF from "./FacturaPDF";

const DownloadInvoiceButton = ({ order }) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  // Carga el balance automáticamente al montar el componente
  useEffect(() => {
    const loadBalance = async () => {
      if (order?.customer?.id) {
        try {
          const debtData = await getDebtByCustomerId(order.customer.id);
          setCurrentBalance(debtData?.current_balance || 0);
        } catch (error) {
          console.error("Error obteniendo balance:", error);
          setCurrentBalance(0);
        } finally {
          setBalanceLoaded(true);
        }
      }
    };

    loadBalance();
  }, [order?.customer?.id]);

  return (
    <PDFDownloadLink
      document={<FacturaPDF order={order} currentBalance={currentBalance} />}
      fileName={`factura_${order.id}.pdf`}
    >
      {({ loading }) => (
        <button 
          className="btn ms-2 btn-sm bg-info text-white"
          disabled={!balanceLoaded || loading}
        >
          <FaFileDownload />
          {(!balanceLoaded || loading) && (
            <span className="ms-1">...</span>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadInvoiceButton;