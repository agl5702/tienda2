import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, deleteOrder } from "../services/requests/orders";
import { createSale } from "../services/requests/sales";
import { FaTrash, FaClipboardList } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import Swal from "sweetalert2";

export default function OrdersTable({ onSaleCreated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1) Carga inicial de órdenes pendientes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const all = await getAllOrders();
        setOrders(all.filter((o) => o.status === "pending"));
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2) Eliminar orden
  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto borrará la orden!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return;

    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      Swal.fire("Eliminada", "Orden borrada.", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar.", "error");
    }
  };

  // 3) Crear venta y refrescar ventas en el padre
  const handleCreateSale = async (order) => {
    try {
      await createSale({
        order_id: order.id,
        transfer_payment: 0,
        balance: 0,
      });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      Swal.fire("Venta creada", "", "success");
      onSaleCreated(); // <— 🚀 Avisamos al padre que vuelva a cargar ventas
    } catch {
      Swal.fire("Error", "No se pudo crear la venta.", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-3">
        Cargando órdenes…
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="d-flex justify-content-center py-3">
        No hay órdenes pendientes.
      </div>
    );
  }

  return (
    <div className="table-responsive mb-4">
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Vender</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/form_ventas/${o.id}`)}
              >
                <FaClipboardList /> {o.id}
              </td>
              <td>{o.customer?.name || o.customer_id}</td>
              <td>{new Date(o.date).toLocaleString()}</td>
              <td>{o.status === "pending" ? "Pendiente" : o.status}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => handleCreateSale(o)}
                >
                  <CiCircleCheck size={18} />
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(o.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
