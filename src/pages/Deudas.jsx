import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DebtHeader from "../components/debts/DebtHeader";
import MenuMovil from "../components/MenuMovil";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"
// Iconos
import { FaPlusCircle, FaUser, FaSearch, FaHistory } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";

import { getAllCustomers } from "../services/requests/customers";
import {
  createDebt,
  getAllDebt,
  createDebtMovement,
} from "../services/requests/debts";
import Swal from "sweetalert2";

export default function Deudas() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [initialBalance, setInitialBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState(""); // 'payment' o 'increment'

  useEffect(() => {
    fetchCustomers();
    fetchDebts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      if (response && Array.isArray(response)) {
        setCustomers(response);
      }
    } catch (error) {
      showErrorAlert("Error al cargar los clientes", error);
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await getAllDebt();
      if (response && Array.isArray(response)) {
        setDebts(response);
      }
    } catch (error) {
      showErrorAlert("Error al cargar las deudas", error);
    }
  };

  const getCustomerDebt = (customerId) => {
    return debts.find((debt) => debt.customer_id === customerId);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Cliente no encontrado";
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const hasDebt = debts.some((debt) => debt.customer_id === customer.id);
    return matchesSearch && hasDebt;
  });

  const showModal = () => {
    setIsModalOpen(true);
    setError(null);
    setSearchTerm("");
    setSelectedCustomer(null);
  };

  const showActionModal = (customer, type) => {
    setSelectedCustomer(customer);
    setActionType(type);
    const customerDebt = getCustomerDebt(customer.id);
    setSelectedDebt(customerDebt);
    setActionModalOpen(true);
    setAmount("");
    setError(null);
  };

  const handleViewMovements = (customerId) => {
    navigate(`/deudas/movimiento/${customerId}`);
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "¡Éxito!",
      text: message,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
    });
  };

  const showErrorAlert = (defaultMessage, error) => {
    console.error("Error completo:", error);

    let errorMessage = defaultMessage;

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#d33",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !initialBalance) {
      setError("Debes seleccionar un cliente y especificar un monto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        customer_id: selectedCustomer.id,
        initial_balance: parseFloat(initialBalance),
      };

      const response = await createDebt(data);

      if (response) {
        showSuccessAlert("Deuda creada exitosamente");
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setInitialBalance("");
        fetchDebts();
      }
    } catch (error) {
      showErrorAlert("Error al crear la deuda", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    if (!amount) {
      setError("Debes especificar un monto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        amount: parseFloat(amount),
        description:
          actionType === "payment" ? "Pago en efectivo" : "Incremento de deuda",
        movement_type: actionType === "payment" ? "PAYMENT" : "NEW_BALANCE",
        notes:
          actionType === "payment"
            ? "Recibido por caja principal"
            : "Incremento registrado",
      };

      const response = await createDebtMovement(selectedDebt.id, data);

      if (response) {
        showSuccessAlert(
          actionType === "payment"
            ? "Pago registrado exitosamente"
            : "Deuda incrementada exitosamente"
        );
        setActionModalOpen(false);
        setAmount("");
        fetchDebts();
      }
    } catch (error) {
      showErrorAlert(
        actionType === "payment"
          ? "Error al registrar el pago"
          : "Error al incrementar la deuda",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <>

      <div className="m-0 padding-menu">

        <Sidebar />
        <MenuMovil />
        <div className="col p-1" style={{ minHeight: "100vh" }}>
          <div className="">
            <div className="mx-2 mb-1 border-bottom border-2">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h3 className="my-auto">
                  <DebtHeader />
                </h3>
                <button
                  className="btn bg-info btn-sm text-white d-flex align-items-center"
                  onClick={showModal}
                >
                  <FaPlusCircle className="me-2" />
                  Crear deudor
                </button>
              </div>

              {/* Barra de búsqueda */}
              <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 pb-1">
                <input
                  type="text"
                  className="form-control border border-2 ps-3 bg-white"
                  placeholder="Buscar deudor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            

            {/* Cards de clientes con deudas */}
            <div className="row mx-0">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const debt = getCustomerDebt(customer.id);
                  return (
                    <div className="col-12 col-sm-6 col-lg-4 col-xl-4 p-2" key={customer.id}>
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3 text-info">
                              <FaUser size={24} />
                            </div>
                            <div>
                              <h5 className="card-title mb-0">{customer.name}</h5>
                            </div>
                          </div>

                          {debt && (
                            <>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold">Saldo actual:</span>
                                <span
                                  className={`badge ${
                                    debt.current_balance > 0
                                      ? "bg-danger"
                                      : "bg-success"
                                  }`}
                                >
                                  ${debt.current_balance.toFixed(2)}
                                </span>
                              </div>

                              <div className="d-flex justify-content-between flex-wrap gap-2">
                                <button
                                  className="btn btn-sm btn-dark d-flex align-items-center flex-grow-1"
                                  onClick={() =>
                                    showActionModal(customer, "payment")
                                  }
                                >
                                  <MdPayment className="me-1" />
                                  Abonar
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary d-flex align-items-center flex-grow-1"
                                  onClick={() =>
                                    showActionModal(customer, "increment")
                                  }
                                >
                                  <FaMoneyBillTrendUp className="me-1" />
                                  Incrementar
                                </button>
                                <button
                                  className="btn btn-sm btn-info d-flex align-items-center flex-grow-1"
                                  onClick={() => handleViewMovements(customer.id)}
                                >
                                  <FaHistory className="me-1" />
                                  Movimientos
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="alert alert-info">
                    {searchTerm
                      ? "No se encontraron clientes con deudas que coincidan con la búsqueda"
                      : "No hay clientes con deudas registradas"}
                  </div>
                </div>
              )}
            </div>

            {/* Modal para crear deuda */}
            <div
              className={`modal fade ${isModalOpen ? "show d-block" : ""}`}
              tabIndex="-1"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Crear Nueva Deuda</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setIsModalOpen(false)}
                    ></button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="mb-4">
                        <label className="form-label d-flex align-items-center">
                          <FaUser className="me-2" />
                          Seleccionar Cliente
                        </label>

                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <FaSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control border border-2 ps-3"
                            placeholder="Buscar cliente por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <div
                          className="customer-selection-container"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {customers.filter((c) =>
                            c.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ).length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 g-3">
                              {customers
                                .filter((c) =>
                                  c.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                )
                                .map((customer) => (
                                  <div className="col" key={customer.id}>
                                    <div
                                      className={`card h-100 cursor-pointer ${
                                        selectedCustomer?.id === customer.id
                                          ? "border-primary bg-light"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setSelectedCustomer(customer)
                                      }
                                    >
                                      <div className="card-body d-flex align-items-center">
                                        <div className="me-3 text-primary">
                                          <FaUser size={24} />
                                        </div>
                                        <div>
                                          <h6 className="mb-0">
                                            {customer.name}
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p>No se encontraron clientes</p>
                            </div>
                          )}
                        </div>

                        {selectedCustomer && (
                          <div className="alert alert-info mt-3">
                            <strong>Cliente seleccionado:</strong>{" "}
                            {selectedCustomer.name}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Monto Inicial</label>
                        <input
                          type="number"
                          className="form-control border border-2 ps-3"
                          placeholder="Ingrese el monto"
                          value={initialBalance}
                          onChange={(e) => setInitialBalance(e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-info"
                        disabled={loading || !selectedCustomer}
                      >
                        {loading ? "Creando..." : "Crear Deuda"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Modal para acciones (abonar/incrementar) */}
            <div
              className={`modal fade ${actionModalOpen ? "show d-block" : ""}`}
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {actionType === "payment"
                        ? "Abonar a Deuda"
                        : "Incrementar Deuda"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setActionModalOpen(false)}
                    ></button>
                  </div>

                  <form onSubmit={handleActionSubmit}>
                    <div className="modal-body">
                      {error && <div className="alert alert-danger">{error}</div>}

                      {selectedCustomer && selectedDebt && (
                        <>
                          <div className="mb-3">
                            <label className="form-label">Cliente</label>
                            <input
                              type="text"
                              className="form-control border border-2 ps-3"
                              value={selectedCustomer.name}
                              disabled
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Saldo Actual</label>
                            <input
                              type="text"
                              className="form-control border border-2 ps-3"
                              value={`$${selectedDebt.current_balance.toFixed(
                                2
                              )}`}
                              disabled
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              {actionType === "payment"
                                ? "Monto a Abonar"
                                : "Monto a Incrementar"}
                            </label>
                            <input
                              type="number"
                              className="form-control border border-2 ps-3"
                              placeholder={`Ingrese el monto a ${
                                actionType === "payment"
                                  ? "abonar"
                                  : "incrementar"
                              }`}
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              min="0.01"
                              step="0.01"
                              required
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActionModalOpen(false)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className={`btn ${
                          actionType === "payment" ? "btn-success" : "btn-warning"
                        }`}
                        disabled={loading}
                      >
                        {loading
                          ? "Procesando..."
                          : actionType === "payment"
                          ? "Registrar Pago"
                          : "Incrementar Deuda"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Backdrops para los modales */}
            {(isModalOpen || actionModalOpen) && (
              <div
                className="modal-backdrop fade show"
                onClick={() => {
                  setIsModalOpen(false);
                  setActionModalOpen(false);
                }}
              ></div>
            )}
          </div>
          <Footer/>
        </div>
      </div>
      
    </>
  );
}
