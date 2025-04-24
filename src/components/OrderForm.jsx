// OrderForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  patchOrder,
  createOrder,
  deleteOrder,
} from "../services/requests/orders";
import { getAllCustomers } from "../services/requests/customers";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const OrderForm = ({ orden: propOrden }) => {
  const navigate = useNavigate();

  const [order, setOrder] = useState(
    propOrden || {
      id: null,
      customer: null,
      date: new Date().toISOString(),
      status: "pending",
      items: [],
    }
  );
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(
    propOrden?.customer?.id || ""
  );
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (propOrden) {
      setOrder(propOrden);
      setSelectedCustomer(propOrden.customer?.id || "");
    }
  }, [propOrden]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllCustomers();
        const filtered = data.filter((c) => c.name && c.name.trim() !== "");
        setCustomers(filtered);
        setFilteredCustomers(filtered);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      } finally {
        setLoadingCustomers(false);
      }
    })();
  }, []);

  const handleCustomerChange = (e) => {
    const id = parseInt(e.target.value, 10);
    const customer = customers.find((c) => c.id === id) || null;
    setSelectedCustomer(id);
    setOrder((o) => ({ ...o, customer }));
  };

  const handleRemoveItem = async (productId) => {
    if (!order.id) {
      Swal.fire({ icon: "warning", title: "La orden no existe aún" });
      return;
    }

    // marcar el ítem eliminado con qty 0 y price 0
    const updatedItems = order.items.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: 0, price_unit: 0 }
        : item
    );

    const payload = {
      customer_id: order.customer.id,
      status: order.status,
      items: updatedItems.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
        price_unit: it.price_unit,
      })),
    };

    try {
      await patchOrder(order.id, payload);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto eliminado correctamente",
        showConfirmButton: false,
        timer: 800,
      }).then(() => window.location.reload());
    } catch (err) {
      console.error("Error al actualizar el pedido:", err);
      Swal.fire({ icon: "error", title: "No se pudo eliminar el producto" });
    }
  };

  const handleDeleteOrder = async () => {
    if (!order.id) {
      Swal.fire({ icon: "warning", title: "La orden no existe aún" });
      return;
    }
    const result = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción eliminará todo el pedido. ¡No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteOrder(order.id);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Pedido eliminado",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/ventas");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error al eliminar pedido" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        customer_id: order.customer.id,
        status: order.status,
        items: order.items.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          price_unit: it.price_unit,
        })),
      };
      let orderId = order.id;
      if (orderId) {
        await patchOrder(orderId, payload);
      } else {
        const created = await createOrder(payload);
        orderId = created.id;
        setOrder((o) => ({ ...o, id: orderId }));
      }
      navigate("/ventas");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error al guardar pedido" });
    } finally {
      setSaving(false);
    }
  };

  const visibleItems = order.items.filter(
    (item) =>
      item.product &&
      item.product.name &&
      item.product.sale_price > 0 &&
      item.quantity > 0
  );

  return (
    <div className="card p-3">
      <h4>Orden #{order.id ?? "(nueva)"}</h4>
      <p>
        <strong>Fecha:</strong> {new Date(order.date).toLocaleString()}
      </p>
      <p>
        <strong>Total:</strong> $
        {visibleItems.reduce(
          (sum, i) => sum + i.quantity * i.product.sale_price,
          0
        )}
      </p>

      <h5>Seleccionar Cliente</h5>
      {loadingCustomers ? (
        <p>Cargando clientes…</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mb-4"
            value={selectedCustomer}
            onChange={handleCustomerChange}
          >
            <option value="">-- Seleccione un cliente --</option>
            {filteredCustomers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      )}

      <h5>Productos</h5>
      <ul className="list-group mb-3">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <li
              key={`${item.product_id}-${item.quantity}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                Nombre: {item.product.name} — Cantidad: {item.quantity} —
                Precio: ${item.product.sale_price}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveItem(item.product_id)}
              >
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <li className="list-group-item">No hay productos agregados.</li>
        )}
      </ul>

      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteOrder}
          disabled={!order.id}
        >
          Eliminar Pedido
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={handleSubmit}
          disabled={saving || !order.customer}
        >
          {saving
            ? order.id
              ? "Actualizando…"
              : "Creando…"
            : order.id
            ? "Actualizar Pedido"
            : "Crear Pedido"}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
