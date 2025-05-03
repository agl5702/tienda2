import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDebtByCustomer,
  getDebtByCustomerId,
} from "../services/requests/debts";
import { FaArrowLeft, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import { getCustomerById } from "../services/requests/customers";

const Movimientos = () => {
  const { id_cliente } = useParams();
  const navigate = useNavigate();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar que id_cliente existe y es un número válido
        if (!id_cliente || isNaN(Number(id_cliente))) {
          throw new Error("ID de cliente inválido");
        }

        // Obtener información del cliente
        const customerData = await getCustomerById(Number(id_cliente));
        setCustomer(customerData);

        // Obtener saldo actual del cliente
        const balanceResponse = await getDebtByCustomerId(Number(id_cliente));
        if (balanceResponse && balanceResponse.current_balance !== undefined) {
          setCurrentBalance(balanceResponse.current_balance);
        }

        // Obtener movimientos del cliente
        const movementsResponse = await getDebtByCustomer(Number(id_cliente));
        if (movementsResponse && Array.isArray(movementsResponse)) {
          setMovements(movementsResponse);
        } else {
          setError("No se encontraron movimientos para este cliente");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_cliente]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="row g-0">
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-0">
        <div className="row g-0">
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="alert alert-danger mt-4">
              {error}
              <button
                className="btn btn-sm btn-danger ms-3"
                onClick={() => navigate("/deudas")}
              >
                Volver
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <button
              className="btn btn-light d-flex align-items-center me-3"
              onClick={() => navigate("/deudas")}
            >
              <FaArrowLeft className="me-2" />
              Volver
            </button>
            <h1 className="h2 mb-0">Movimientos del cliente</h1>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">
                {customer ? customer.name : `Cliente ${id_cliente}`}
              </h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Historial de movimientos</h5>
                <div className="balance-display">
                  <span className="text-muted">Saldo actual:</span>
                  <h3 className="mb-0 text-success">
                    {formatCurrency(currentBalance)}
                  </h3>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo de movimiento</th>
                      <th className="text-end">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement, index) => (
                      <tr key={index}>
                        <td>{formatDate(movement.date)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {movement.movement_type === "PAYMENT" ? (
                              <FaMoneyCheckAlt className="text-success me-2" />
                            ) : (
                              <FaMoneyBillWave className="text-danger me-2" />
                            )}
                            {movement.movement_type === "PAYMENT"
                              ? "Pago"
                              : "Incremento"}
                          </div>
                        </td>
                        <td className="text-end">
                          <span
                            className={`font-weight-bold ${
                              movement.movement_type === "PAYMENT"
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {movement.movement_type === "PAYMENT" ? "-" : "+"}
                            {formatCurrency(movement.movement_amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Movimientos;
