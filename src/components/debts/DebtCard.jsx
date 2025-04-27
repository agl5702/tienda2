import { useState } from "react";
import {
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaPlusCircle,
  FaEdit,
  FaCheckCircle,
  FaTimes,
  FaList,
} from "react-icons/fa";
import DebtStatusBadge from "./DebtStatusBadge.jsx";
import {
  paymentDebts,
  editDebts,
  deleteDebts,
} from "@/services/requests/debts.js";

const DebtCard = ({
  debtor,
  customerName,
  formatDate,
  onPaymentSuccess,
  isConsolidated = false,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [editData, setEditData] = useState({
    status: debtor.status,
    total_amount: debtor.total_amount,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingAmount = debtor.total_amount - debtor.paid_amount;

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Ingrese un monto válido");
      return;
    }

    if (amount > pendingAmount) {
      setError(
        `El monto no puede ser mayor a $${pendingAmount.toLocaleString()}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await paymentDebts(debtor.id, amount);
      onPaymentSuccess();
      setShowPaymentModal(false);
      setAmount("");
    } catch (err) {
      setError(err.message || "Error al registrar el abono");
    } finally {
      setLoading(false);
    }
  };

  const handleFullPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      await paymentDebts(debtor.id, pendingAmount);
      onPaymentSuccess();
    } catch (err) {
      setError(err.message || "Error al registrar el pago completo");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDebt = async () => {
    setLoading(true);
    setError(null);

    try {
      await editDebts(debtor.id, editData);
      onPaymentSuccess();
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || "Error al editar la deuda");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDebt = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteDebts(debtor.id);
      onPaymentSuccess();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message || "Error al eliminar la deuda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm border-start border-4 border-dark">
        <div className="card-body position-relative">
          {/* Encabezado de la tarjeta */}
          <div className="d-flex align-items-center mb-3">
            <div className="bg-info text-white bg-opacity-10 p-3 rounded-circle me-3">
              <FaUser size={28} />
            </div>
            <div>
              <h5 className="card-title mb-0">{customerName}</h5>
              <DebtStatusBadge status={debtor.status} />
              {isConsolidated && (
                <span className="badge bg-secondary ms-2">
                  {debtor.debtsCount}{" "}
                  {debtor.debtsCount === 1 ? "deuda" : "deudas"}
                </span>
              )}
            </div>
          </div>

          {/* Detalles de la deuda */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">
                <FaMoneyBillWave className="me-2" />
                Total adeudado:
              </span>
              <span className="fw-bold">
                ${debtor.total_amount.toLocaleString()}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">
                <FaMoneyBillWave className="me-2" />
                Pagado:
              </span>
              <span className="fw-bold">
                ${debtor.paid_amount.toLocaleString()}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                <FaExclamationTriangle className="me-2 text-danger" />
                Saldo pendiente:
              </span>
              <span className="fw-bold text-danger">
                ${pendingAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pie de tarjeta */}
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              <FaCalendarAlt className="me-1" />
              {isConsolidated ? (
                <>
                  {debtor.debtsCount}{" "}
                  {debtor.debtsCount === 1 ? "deuda" : "deudas"}
                  <br />
                  Última actualización: {formatDate(debtor.updated_at)}
                </>
              ) : (
                <>
                  Creado: {formatDate(debtor.created_at)}
                  {debtor.updated_at && (
                    <>
                      <br />
                      Actualizado: {formatDate(debtor.updated_at)}
                    </>
                  )}
                </>
              )}
            </span>

            <div className="d-flex gap-2">
              {isConsolidated ? (
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => setShowDetailsModal(true)}
                  title="Ver detalle de deudas"
                >
                  <FaList />
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => setShowEditModal(true)}
                  >
                    <FaEdit className="me-1" />
                    Editar
                  </button>
                  {debtor.status === "PENDING" && (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        <FaPlusCircle className="me-1" />
                        Abonar
                      </button>
                      {pendingAmount > 0 && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={handleFullPayment}
                          disabled={loading}
                        >
                          <FaCheckCircle className="me-1" />
                          {loading ? "Procesando..." : "Pagar Todo"}
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Modal de detalles (solo para deudas consolidadas) */}
          {showDetailsModal && isConsolidated && (
            <div
              className="modal-backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1040,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="modal-content bg-white p-4 rounded"
                style={{
                  width: "90%",
                  maxWidth: "800px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <h5>Detalle de deudas - {customerName}</h5>
                <p className="mb-3">
                  Total consolidado: ${debtor.total_amount.toLocaleString()}
                </p>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Total</th>
                        <th>Pagado</th>
                        <th>Pendiente</th>
                        <th>Estado</th>
                        <th>Creado</th>
                        <th>Actualizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debtor.debts.map((debt) => (
                        <tr key={debt.id}>
                          <td>{debt.id}</td>
                          <td>${debt.total_amount.toLocaleString()}</td>
                          <td>${debt.paid_amount.toLocaleString()}</td>
                          <td>
                            $
                            {(
                              debt.total_amount - debt.paid_amount
                            ).toLocaleString()}
                          </td>
                          <td>
                            <DebtStatusBadge status={debt.status} />
                          </td>
                          <td>{formatDate(debt.created_at)}</td>
                          <td>{formatDate(debt.updated_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modales existentes (pago, edición, eliminación) */}
          {/* ... (mantén los modales existentes igual) ... */}
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
