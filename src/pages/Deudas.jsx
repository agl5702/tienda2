import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import {
  getAllDebts,
  getDebtStats,
  createDebt,
} from "../services/requests/debts.js";
import { getAllCustomers } from "../services/requests/customers.js";
import DebtHeader from "../components/debts/DebtHeader.jsx";
import DebtList from "../components/debts/DebtList.jsx";
import AddDebt from "../components/debts/AddDebt.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

function Deudas() {
  const [debtors, setDebtors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  const handleDataUpdate = async () => {
    try {
      const [debtsData, statsData] = await Promise.all([
        getAllDebts(),
        getDebtStats(),
      ]);
      setDebtors(debtsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error al actualizar datos:", err);
      setError("Error al actualizar los datos");
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : `Cliente #${customerId}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [debtsData, customersData, statsData] = await Promise.all([
          getAllDebts(),
          getAllCustomers(),
          getDebtStats(),
        ]);

        setDebtors(debtsData);
        setCustomers(customersData);
        setStats(statsData);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <Sidebar />
      <div className="col p-4" style={{ minHeight: "100vh" }}>
        <DebtHeader stats={stats} />
        <AddDebt customers={customers} onDebtAdded={handleDataUpdate} />
        <DebtList
          debtors={debtors}
          customers={customers}
          formatDate={formatDate}
          getCustomerName={getCustomerName}
          onPaymentSuccess={handleDataUpdate}
        />
      </div>
    </div>
  );
}

export default Deudas;
