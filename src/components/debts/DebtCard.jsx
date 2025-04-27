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
} from "react-icons/fa";
import DebtStatusBadge from "./DebtStatusBadge.jsx";
import {
  paymentDebts,
  editDebts,
  deleteDebts,
} from "@/services/requests/debts.js";

const DebtCard = ({ debtor, customerName, formatDate, onPaymentSuccess }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      onPaymentSuccess(); // Notificar al componente padre para actualizar datos
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
      // Pago completo: usamos el monto pendiente como abono
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
      onPaymentSuccess(); // Actualizar los datos
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
      onPaymentSuccess(); // Actualizar los datos
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
          {/* Botón de eliminar en la esquina superior derecha */}
          <button
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
            style={{ width: "30px", height: "30px", padding: "0" }}
            onClick={() => setShowDeleteModal(true)}
            title="Eliminar deuda"
          >
            <FaTimes />
          </button>

          {/* Encabezado de la tarjeta */}
          <div className="d-flex align-items-center mb-3">
            <div className="bg-info text-white bg-opacity-10 p-3 rounded-circle me-3">
              <FaUser size={28} />
            </div>
            <div>
              <h5 className="card-title mb-0">{customerName}</h5>
              <DebtStatusBadge status={debtor.status} />
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

          {/* Pie de tarjeta con botones */}
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              <FaCalendarAlt className="me-1" />
              Creado: {formatDate(debtor.created_at)}
              {debtor.updated_at && (
                <>
                  <br />
                  Actualizado: {formatDate(debtor.updated_at)}
                </>
              )}
            </span>
            <div className="d-flex gap-2">
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
            </div>
          </div>

          {/* Modal de pago */}
          {showPaymentModal && (
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
                  maxWidth: "400px",
                }}
              >
                <h5>Registrar Abono</h5>
                <p>Deuda de {customerName}</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Monto del abono</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    max={pendingAmount}
                    step="0.01"
                    placeholder={`Máximo $${pendingAmount.toLocaleString()}`}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : "Registrar Abono"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición */}
          {showEditModal && (
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
                  maxWidth: "400px",
                }}
              >
                <h5>Editar Deuda</h5>
                <p>Deuda de {customerName}</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="PAID">Pagado</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Monto Total</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.total_amount}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        total_amount: parseFloat(e.target.value),
                      })
                    }
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    onClick={handleEditDebt}
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de eliminación */}
          {showDeleteModal && (
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
                  maxWidth: "400px",
                }}
              >
                <h5>Eliminar Deuda</h5>
                <p>
                  ¿Estás seguro que deseas eliminar esta deuda de {customerName}
                  ?
                </p>
                <p className="fw-bold">Esta acción no se puede deshacer.</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteDebt}
                    disabled={loading}
                  >
                    {loading ? "Eliminando..." : "Sí, Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
