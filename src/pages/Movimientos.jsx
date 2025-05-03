import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDebtByCustomerId,
  deleteDebtMovement,
} from "../services/requests/debts";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaTrash,
} from "react-icons/fa";
import { getCustomerById } from "../services/requests/customers";
import Footer from "../components/Footer";
import MenuMovil from "../components/MenuMovil";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";

const Movimientos = () => {
  const { id_cliente } = useParams();
  const navigate = useNavigate();
  const [debtData, setDebtData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id_cliente || isNaN(Number(id_cliente))) {
          throw new Error("ID de cliente inválido");
        }

        // Obtener información del cliente
        const customerData = await getCustomerById(Number(id_cliente));
        setCustomer(customerData);

        // Obtener datos completos de la deuda (que incluye movimientos con IDs)
        const debtResponse = await getDebtByCustomerId(Number(id_cliente));

        if (!debtResponse) {
          throw new Error("No se encontró deuda para este cliente");
        }

        setDebtData(debtResponse);
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

  const handleDeleteMovement = async (movementId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el movimiento y ajustará el saldo. ¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDebtMovement(movementId);

        // Recargar los datos después de eliminar
        const updatedDebt = await getDebtByCustomerId(Number(id_cliente));
        setDebtData(updatedDebt);

        Swal.fire("¡Eliminado!", "El movimiento ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo eliminar el movimiento: " +
            (error.response?.data?.detail || error.message),
          "error"
        );
      }
    }
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
    <>
      <div className="m-0 padding-menu">
        <Sidebar />
        <MenuMovil />
        <div className="col p-2" style={{ minHeight: "100vh" }}>
          <div className="card">
            <div className="card-header p-3 bg-dark text-white">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <button
                  className="btn btn-light d-flex align-items-center btn-sm mb-2 mb-md-0"
                  onClick={() => navigate("/deudas")}
                >
                  <FaArrowLeft className="me-2" />
                  Volver
                </button>
                <h4 className="mb-0 text-white">
                  Movimientos de{" "}
                  {customer ? customer.name : `Cliente ${id_cliente}`}
                </h4>
              </div>
            </div>
            <div className="card-body p-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 col-6">Historial de movimientos</h5>
                <div className="border p-2 card">
                  <span className="text-muted">Saldo actual</span>
                  <h3 className="mb-0 text-success">
                    {formatCurrency(debtData?.current_balance || 0)}
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtData?.movements?.map((movement) => (
                      <tr key={movement.id}>
                        <td>{formatDate(movement.movement_date)}</td>
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
                            {formatCurrency(movement.amount)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteMovement(movement.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Movimientos;
