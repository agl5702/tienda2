import { useState } from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import { getPaidDebts } from "../../services/requests/debts";

export default function PendingDebt({ customers }) {
  const [showModal, setShowModal] = useState(false);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el nombre del cliente
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : `Cliente #${customerId}`;
  };

  const fetchPendingDebts = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      setError(null);
      const response = await getPaidDebts(false);
      setDebts(response.data || response);
      setShowModal(true);
    } catch (err) {
      console.error("Error completo:", err);
      setError(`Error al cargar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div
      className="card shadow-sm"
      style={{ minWidth: "250px", maxWidth: "100%", flex: "1 1 auto" }}
    >
      {" "}
      <div className="card-body ">
        <button
          className="btn bg-dark text-white w-100 d-flex align-items-center justify-content-center"
          onClick={fetchPendingDebts}
          disabled={loading}
          style={{ minHeight: "40px" }}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Cargando...
            </>
          ) : (
            <>
              <MdOutlinePendingActions className="me-2" fontSize={20} />
              <span>Deudas Pendientes</span>
            </>
          )}
        </button>
      </div>
      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deudas Pendientes</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                {error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover bg-black">
                      <thead className="table bg-gradient-dark text-white">
                        <tr>
                          <th>Cliente</th>
                          <th>Total</th>
                          <th>Pagado</th>
                          <th>Pendiente</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debts.map((debt) => (
                          <tr key={debt.id}>
                            <td>{getCustomerName(debt.customer_id)}</td>
                            <td>${debt.total_amount.toLocaleString()}</td>
                            <td>${debt.paid_amount.toLocaleString()}</td>
                            <td>
                              $
                              {(
                                debt.total_amount - debt.paid_amount
                              ).toLocaleString()}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  debt.status === "PENDING"
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                              >
                                {debt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Fila de totales */}
                        {debts.length > 0 && (
                          <tr
                            className="fw-bold bg-gradient-dark text-white"
                            style={{ backgroundColor: "#f8f9fa" }}
                          >
                            <td>TOTAL</td>
                            <td>
                              $
                              {debts
                                .reduce(
                                  (sum, debt) => sum + (debt.total_amount || 0),
                                  0
                                )
                                .toLocaleString()}
                            </td>
                            <td>
                              $
                              {debts
                                .reduce(
                                  (sum, debt) => sum + (debt.paid_amount || 0),
                                  0
                                )
                                .toLocaleString()}
                            </td>
                            <td>
                              $
                              {debts
                                .reduce(
                                  (sum, debt) =>
                                    sum +
                                    (debt.total_amount - debt.paid_amount || 0),
                                  0
                                )
                                .toLocaleString()}
                            </td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
