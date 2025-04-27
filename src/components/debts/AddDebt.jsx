import { useState } from "react";
import { FaUser, FaSearch, FaPlus, FaMoneyBillWave } from "react-icons/fa";
import { createDebt } from "../../services/requests/debts";

const AddDebt = ({ customers, onDebtAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!selectedCustomer) {
      setError("Seleccione un cliente válido");
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Ingrese un monto válido mayor a 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createDebt({
        customer_id: selectedCustomer.id,
        total_amount: amount,
      });

      // Resetear formulario
      setSelectedCustomer(null);
      setAmount("");
      setSearchTerm("");
      setShowForm(false);

      // Notificar actualización
      onDebtAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la deuda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {!showForm ? (
          <button
            className="btn btn-dark w-100"
            onClick={() => setShowForm(true)}
          >
            <FaPlus className="me-2" />
            Añadir Nueva Deuda
          </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Añadir Nueva Deuda</h5>

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
                        selectedCustomer?.id === customer.id ? "active" : ""
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

            {/* Campo para el monto */}
            <div className="mb-3">
              <label className="form-label">Monto Total</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaMoneyBillWave />
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ej: 150.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  setSelectedCustomer(null);
                  setAmount("");
                  setSearchTerm("");
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !selectedCustomer || !amount}
              >
                {loading ? "Guardando..." : "Guardar Deuda"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDebt;
