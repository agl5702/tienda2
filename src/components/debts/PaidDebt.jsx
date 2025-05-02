import { useState } from "react";
import { MdPaid } from "react-icons/md";
import { getPaidDebts } from "../../services/requests/debts";

export default function PaidDebt({ customers = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función segura para obtener el nombre
  const getCustomerName = (customerId) => {
    if (!Array.isArray(customers)) return `Cliente #${customerId}`;
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : `Cliente #${customerId}`;
  };

  const fetchPaidDebts = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      setLoading(true);
      setError(null);
      const response = await getPaidDebts(true); // true para deudas pagadas
      setDebts(response.data || response);
      setShowModal(true);
    } catch (err) {
      console.error("Error:", err);
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
      <div className="card-body">
        <button
          className="btn bg-info text-white w-100 d-flex align-items-center justify-content-center"
          onClick={fetchPaidDebts}
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
              <MdPaid className="me-2" fontSize={20} />
              <span>Deudas Pagadas</span>
            </>
          )}
        </button>
      </div>
      {/* Modal para mostrar deudas pagadas */}
      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deudas Pagadas</h5>
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
                          <th>Estado</th>
                          <th>Fecha de Pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debts.length > 0 ? (
                          <>
                            {debts.map((debt) => (
                              <tr key={debt.id}>
                                <td>{getCustomerName(debt.customer_id)}</td>
                                <td>${debt.total_amount.toLocaleString()}</td>
                                <td>${debt.paid_amount.toLocaleString()}</td>
                                <td>
                                  <span className="badge bg-success">
                                    {debt.status}
                                  </span>
                                </td>
                                <td>
                                  {debt.updated_at
                                    ? new Date(
                                        debt.updated_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>
                              </tr>
                            ))}
                            {/* Fila de totales */}
                            <tr
                              className="fw-bold bg-gradient-dark text-white"
                              style={{ backgroundColor: "#f8f9fa" }}
                            >
                              <td>TOTAL</td>
                              <td>
                                $
                                {debts
                                  .reduce(
                                    (sum, debt) =>
                                      sum + (debt.total_amount || 0),
                                    0
                                  )
                                  .toLocaleString()}
                              </td>
                              <td>
                                $
                                {debts
                                  .reduce(
                                    (sum, debt) =>
                                      sum + (debt.paid_amount || 0),
                                    0
                                  )
                                  .toLocaleString()}
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No hay deudas pagadas
                            </td>
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
