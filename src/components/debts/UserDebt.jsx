import { useState } from "react";
import { FaUser, FaSearch, FaTimes } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
import { getDebtsById } from "../../services/requests/debts";

const UserDebt = ({ customers = [], onUserSelected }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [debts, setDebts] = useState([]);
  const [showDebts, setShowDebts] = useState(false);

  const filteredCustomers = customers.filter((customer) =>
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetDebts = async () => {
    if (!selectedCustomer) {
      setError("Seleccione un cliente válido");
      return;
    }

    setLoading(true);
    setError(null);
    setDebts([]);

    try {
      const debtsData = await getDebtsById(selectedCustomer.id);
      console.log("Datos de deudas recibidos:", debtsData); // Para depuración

      // Validación de datos
      if (!Array.isArray(debtsData)) {
        throw new Error("La respuesta del servidor no es un array válido");
      }

      // Mapeo seguro de datos
      const formattedDebts = debtsData.map((debt) => ({
        ...debt,
        total_debt: debt.total_debt || 0,
        total_paid: debt.total_paid || 0,
        pending_amount:
          debt.pending_amount || debt.total_debt - debt.total_paid || 0,
        last_payment_date: debt.last_payment_date || null,
      }));

      setDebts(formattedDebts);
      onUserSelected && onUserSelected(selectedCustomer.id, formattedDebts);
      setShowDebts(true);
    } catch (err) {
      console.error("Error al obtener deudas:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al obtener las deudas"
      );
      setShowDebts(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSearchTerm("");
    setError(null);
    setDebts([]);
    setShowDebts(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha registrada";

    try {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("es-ES", options);
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return dateString;
    }
  };

  return (
    <div
      className="card mb-4 shadow-sm"
      style={{ minWidth: "250px", maxWidth: "100%", flex: "1 1 auto" }}
    >
      {" "}
      <div className="card-body">
        <button
          className="btn btn-success w-100"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <PiUserListFill className="me-2" fontSize={24} />
          Historial por usuario
        </button>

        {/* Modal para buscar usuario */}
        {showModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {showDebts
                      ? `Deudas de ${selectedCustomer?.name || "Cliente"}`
                      : "Buscar Usuario"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {!showDebts ? (
                    <>
                      {/* Buscador de clientes */}
                      <div className="mb-3">
                        <label className="form-label">Buscar Cliente</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Lista de clientes */}
                      {searchTerm && filteredCustomers.length > 0 && (
                        <div className="mb-3">
                          <div
                            className="list-group"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {filteredCustomers.map((customer) => (
                              <button
                                type="button"
                                key={customer.id}
                                className={`list-group-item list-group-item-action ${
                                  selectedCustomer?.id === customer.id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setSearchTerm(customer.name);
                                }}
                              >
                                <FaUser className="me-2" />
                                {customer.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Listado de deudas */}
                      {/* Listado de deudas */}
                      <div className="table-responsive">
                        {debts.length > 0 ? (
                          <table className="table table-sm table-hover bg-black">
                            <thead className="ttable bg-gradient-dark text-white">
                              <tr>
                                <th>Deuda Total</th>
                                <th>Pagado</th>
                                <th>Pendiente</th>
                                <th>Último Pago</th>
                              </tr>
                            </thead>
                            <tbody>
                              {debts.map((debt, index) => (
                                <tr key={index}>
                                  <td>
                                    $
                                    {debt.total_debt?.toLocaleString("es-ES") ||
                                      "0"}
                                  </td>
                                  <td>
                                    $
                                    {debt.total_paid?.toLocaleString("es-ES") ||
                                      "0"}
                                  </td>
                                  <td
                                    className={
                                      (debt.pending_amount || 0) > 0
                                        ? "text-danger fw-bold"
                                        : "text-success"
                                    }
                                  >
                                    $
                                    {(debt.pending_amount || 0).toLocaleString(
                                      "es-ES"
                                    )}
                                  </td>
                                  <td>{formatDate(debt.last_payment_date)}</td>
                                </tr>
                              ))}
                              {/* Fila de totales */}
                              {debts.length > 0 && (
                                <tr
                                  className="fw-bold bg-gradient-dark text-white"
                                  style={{ backgroundColor: "#f8f9fa" }}
                                >
                                  <td>
                                    $
                                    {debts
                                      .reduce(
                                        (sum, debt) =>
                                          sum + (debt.total_debt || 0),
                                        0
                                      )
                                      .toLocaleString("es-ES")}
                                  </td>
                                  <td>
                                    $
                                    {debts
                                      .reduce(
                                        (sum, debt) =>
                                          sum + (debt.total_paid || 0),
                                        0
                                      )
                                      .toLocaleString("es-ES")}
                                  </td>
                                  <td
                                    className={
                                      debts.reduce(
                                        (sum, debt) =>
                                          sum + (debt.pending_amount || 0),
                                        0
                                      ) > 0
                                        ? "text-danger"
                                        : "text-success"
                                    }
                                  >
                                    $
                                    {debts
                                      .reduce(
                                        (sum, debt) =>
                                          sum + (debt.pending_amount || 0),
                                        0
                                      )
                                      .toLocaleString("es-ES")}
                                  </td>
                                  <td>TOTAL</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <div className="alert alert-info">
                            No se encontraron deudas para este cliente
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </div>
                <div className="modal-footer">
                  {showDebts ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowDebts(false)}
                    >
                      <FaTimes className="me-2" />
                      Volver a buscar
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          resetForm();
                          setShowModal(false);
                        }}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={handleGetDebts}
                        disabled={loading || !selectedCustomer}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Buscando...
                          </>
                        ) : (
                          "Ver Deudas"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDebt;
