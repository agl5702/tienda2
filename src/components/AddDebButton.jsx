import { FaClipboardList } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AddDebButton({ order, createDebt, paymentDebts }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (isFullPayment) => {
    setIsProcessing(true);
    try {
      // Validaciones iniciales
      const customerId = order?.customer?.id || order?.customer_id;
      const totalOrden = calcularTotalOrden(order);

      // 1. Validar cliente asignado
      if (!customerId) {
        throw new Error("La orden no tiene un cliente asignado");
      }

      // 2. Validar que la orden tenga productos válidos
      if (totalOrden <= 0) {
        throw new Error(
          "La orden no tiene productos válidos para generar deuda"
        );
      }

      // 3. Validar monto del pago
      let paymentAmount = isFullPayment ? totalOrden : parseFloat(amount);

      if (!isFullPayment) {
        if (isNaN(paymentAmount)) {
          throw new Error("El monto debe ser un número válido");
        }

        if (paymentAmount <= 0) {
          throw new Error("El monto debe ser mayor que cero");
        }

        if (paymentAmount > totalOrden) {
          throw new Error("El abono no puede exceder el total de la orden");
        }
      }

      // 4. Crear la deuda
      const debtData = {
        customer_id: customerId,
        order_id: order.id,
        total_amount: isFullPayment ? totalOrden : totalOrden - paymentAmount,
        notes: `Deuda generada por orden #${order.id}`,
      };

      const createdDebt = await createDebt(debtData);

      if (!createdDebt?.id) {
        throw new Error("No se pudo crear la deuda correctamente");
      }

      // 5. Registrar el pago si es abono parcial
      if (!isFullPayment) {
        // Preparar datos del pago según lo que espera el backend
        const paymentResult = await paymentDebts(
          createdDebt.id.toString(), // Convertir a string si es necesario
          paymentAmount.toString() // Convertir a string si es necesario
        );

        if (!paymentResult || paymentResult.error) {
          throw new Error(paymentResult?.error || "Error al registrar el pago");
        }
      }

      // Mostrar confirmación
      Swal.fire({
        icon: "success",
        title: "Operación exitosa",
        html: isFullPayment
          ? `<div>
              <p>Deuda registrada correctamente</p>
              <p><strong>Total:</strong> $${formatNumber(totalOrden)}</p>
              <p><strong>Cliente:</strong> ${
                order.customer?.name || "No especificado"
              }</p>
            </div>`
          : `<div>
              <p>Pago registrado exitosamente</p>
              <p><strong>Abono:</strong> $${formatNumber(paymentAmount)}</p>
              <p><strong>Saldo pendiente:</strong> $${formatNumber(
                totalOrden - paymentAmount
              )}</p>
              <p><strong>Cliente:</strong> ${
                order.customer?.name || "No especificado"
              }</p>
            </div>`,
        showConfirmButton: true,
        timer: isFullPayment ? 3000 : 4000,
      });

      setShowModal(false);
      setAmount("");
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error en el proceso",
        html: `<div>
                <p>${
                  error.message || "Ocurrió un error al procesar el pago"
                }</p>
                <small>Por favor verifique los datos e intente nuevamente</small>
              </div>`,
        showConfirmButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calcularTotalOrden = (orden) => {
    if (!orden?.items) return 0;

    const itemsFiltrados = orden.items.filter(
      (item) => item.product_id !== 20 // PRODUCTO_A_FILTRAR
    );

    return itemsFiltrados.reduce(
      (sum, item) => sum + (item.price_unit || 0) * (item.quantity || 0),
      0
    );
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  return (
    <>
      <div
        className="btn ms-2 btn-sm btn-warning"
        onClick={() => setShowModal(true)}
        title="Registrar pago/deuda"
      >
        <FaClipboardList />
      </div>

      {/* Modal de registro de pago */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => !isProcessing && setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title text-white">Registrar Pago/Deuda</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => !isProcessing && setShowModal(false)}
                  disabled={isProcessing}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert bg-info text-white">
                  <strong>Cliente:</strong>{" "}
                  {order.customer?.name || "No especificado"}
                  <br />
                  <strong>Total orden:</strong> $
                  <strong>{formatNumber(calcularTotalOrden(order))}</strong>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Monto a abonar:</label>
                  <input
                    type="number"
                    className="form-control border-primary"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    placeholder="Ingrese el monto"
                    max={calcularTotalOrden(order)}
                    min="0"
                    step="0.01"
                    disabled={isProcessing}
                  />
                  <small className="text-muted">
                    {!amount ? (
                      "Dejar en blanco para registrar deuda completa"
                    ) : (
                      <>
                        Saldo pendiente después del pago:{" "}
                        <strong>
                          $
                          {formatNumber(
                            calcularTotalOrden(order) - parseFloat(amount || 0)
                          )}
                        </strong>
                      </>
                    )}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success text-white"
                  onClick={() => handlePayment(false)}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                >
                  {isProcessing ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Registrar Abono"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => handlePayment(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Deuda Completa"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
