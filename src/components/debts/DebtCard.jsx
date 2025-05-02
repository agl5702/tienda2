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
  FaTrash,
} from "react-icons/fa";
import DebtStatusBadge from "./DebtStatusBadge.jsx";
import {
  paymentDebts,
  editDebts,
  deleteDebts,
} from "@/services/requests/debts.js";
import Swal from "sweetalert2";

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
  const [currentDebt, setCurrentDebt] = useState(null);

  // Calcula el monto pendiente según si es consolidado o no
  const pendingAmount =
    isConsolidated && currentDebt
      ? currentDebt.total_amount - currentDebt.paid_amount
      : debtor.total_amount - debtor.paid_amount;

  // Calcula el número de deudas pendientes
  const pendingDebtsCount = isConsolidated
    ? debtor.debts.filter((debt) => debt.status === "PENDING").length
    : 0;

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Ingrese un monto válido");
      return;
    }

    const debtId = isConsolidated && currentDebt ? currentDebt.id : debtor.id;

    if (amount > pendingAmount) {
      setError(
        `El monto no puede ser mayor a $${pendingAmount.toLocaleString()}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await paymentDebts(debtId, amount);
      onPaymentSuccess();
      setShowPaymentModal(false);
      setAmount("");
      Swal.fire({
        title: "¡Abono registrado!",
        text: `Se ha registrado un abono de $${amount}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Error al registrar el abono",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
      setCurrentDebt(null);
    }
  };

  const handleFullPayment = async () => {
    const debtId = isConsolidated && currentDebt ? currentDebt.id : debtor.id;

    try {
      const result = await Swal.fire({
        title: "¿Pagar todo?",
        text: `¿Deseas pagar el saldo pendiente de $${pendingAmount.toLocaleString()}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, pagar todo",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await paymentDebts(debtId, pendingAmount);
        onPaymentSuccess();
        setShowDetailsModal(false);
        Swal.fire({
          title: "¡Pago completo!",
          text: `Se ha registrado el pago completo de $${pendingAmount.toLocaleString()}`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Error al registrar el pago completo",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
      setCurrentDebt(null);
    }
  };

  const handleEditDebt = async () => {
    setLoading(true);
    setError(null);

    const debtId = isConsolidated && currentDebt ? currentDebt.id : debtor.id;

    try {
      await editDebts(debtId, {
        status: editData.status,
        total_amount: parseFloat(editData.total_amount),
      });
      onPaymentSuccess();
      setShowEditModal(false);
      Swal.fire({
        title: "¡Deuda actualizada!",
        text: "Los cambios se han guardado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Error al editar la deuda",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
      setCurrentDebt(null);
    }
  };

  const handleDeleteDebt = async () => {
    const debtId = isConsolidated && currentDebt ? currentDebt.id : debtor.id;
    const amountToDelete =
      isConsolidated && currentDebt
        ? currentDebt.total_amount
        : debtor.total_amount;

    try {
      const result = await Swal.fire({
        title: "¿Eliminar deuda?",
        text: `¿Estás seguro de eliminar esta deuda de $${amountToDelete.toLocaleString()}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteDebts(debtId);
        onPaymentSuccess();
        setShowDeleteModal(false);
        setShowDetailsModal(false);
        Swal.fire({
          title: "¡Eliminada!",
          text: "La deuda ha sido eliminada",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Error al eliminar la deuda",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
      setCurrentDebt(null);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 px-2 mb-3">
      <div className="card h-100 shadow-sm border-dark">
        <div className="card-body position-relative">
          {/* Encabezado de la tarjeta */}
          <div className="d-flex align-items-center mb-3">
            <div className="bg-info text-white bg-opacity-10 p-3 rounded-circle me-3">
              <FaUser size={28} />
            </div>
            <div>
              <h5 className="card-title mb-0">{customerName}</h5>
              <DebtStatusBadge status={debtor.status} />
              {isConsolidated && pendingDebtsCount > 0 && (
                <span className="badge bg-secondary ms-2">
                  {pendingDebtsCount}{" "}
                  {pendingDebtsCount === 1
                    ? "deuda pendiente"
                    : "deudas pendientes"}
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
                  {pendingDebtsCount > 0 && (
                    <>
                      {pendingDebtsCount}{" "}
                      {pendingDebtsCount === 1
                        ? "deuda pendiente"
                        : "deudas pendientes"}
                      <br />
                    </>
                  )}
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
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Detalle de deudas - {customerName}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDetailsModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
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
                            <th>Acciones</th>
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
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-dark"
                                    onClick={() => {
                                      setCurrentDebt(debt);
                                      setEditData({
                                        status: debt.status,
                                        total_amount: debt.total_amount,
                                      });
                                      setShowDetailsModal(false);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    <FaEdit />
                                  </button>
                                  {debt.status === "PENDING" && (
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => {
                                        setCurrentDebt(debt);
                                        setShowDetailsModal(false);
                                        setShowPaymentModal(true);
                                      }}
                                    >
                                      <FaPlusCircle />
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                      setCurrentDebt(debt);
                                      setShowDetailsModal(false);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de pago */}
          {showPaymentModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Registrar abono</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setError(null);
                        setCurrentDebt(null);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Monto a abonar</label>
                      <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Máximo $${pendingAmount.toLocaleString()}`}
                      />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setCurrentDebt(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Registrar abono"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición */}
          {showEditModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Editar deuda</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowEditModal(false);
                        setError(null);
                        setCurrentDebt(null);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
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
                        <option value="COMPLETED">Completado</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Monto total</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.total_amount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            total_amount: e.target.value,
                          })
                        }
                      />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowEditModal(false);
                        setCurrentDebt(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={handleEditDebt}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Guardar cambios"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de eliminación */}
          {showDeleteModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Eliminar deuda</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setCurrentDebt(null);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      ¿Estás seguro de eliminar esta deuda de {customerName} por
                      $
                      {isConsolidated && currentDebt
                        ? currentDebt.total_amount.toLocaleString()
                        : debtor.total_amount.toLocaleString()}
                      ?
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setCurrentDebt(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDeleteDebt}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Eliminar"}
                    </button>
                  </div>
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
