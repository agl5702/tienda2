import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  createOrder,
  getAllOrders,
  putOrder,
  deleteOrder,
} from "../services/requests/orders";
import { getAllProducts } from "../services/requests/products";
import { createSale } from "../services/requests/sales";
import { getAllCustomers } from "../services/requests/customers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Helpers de localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al guardar los datos localmente",
    });
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error al cargar desde localStorage:", error);
    return defaultValue;
  }
};

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [activeTab, setActiveTab] = useState("pedidos");
  const [productos, setProductos] = useState([]);
  const [detalleVentas, setDetalleVentas] = useState({});
  const [orderUsers, setOrderUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [editandoPrecio, setEditandoPrecio] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const navigate = useNavigate();

  // Constante para el ID del producto a filtrar (precio 0)
  const PRODUCTO_A_FILTRAR = 1;

  // Función para mostrar alerta de éxito
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: message,
      timer: 900,
      showConfirmButton: false,
    });
  };

  // Función para mostrar alerta de error
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
  };

  // Función para confirmar eliminación
  const confirmDelete = async (message) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    return result.isConfirmed;
  };

  // Función para calcular el total de una venta
  const calcularTotalVenta = (ventaId) => {
    const items = (detalleVentas[ventaId] || []).filter(
      (item) => item.product_id !== PRODUCTO_A_FILTRAR
    );
    return items.reduce(
      (sum, item) => sum + item.price_unit * item.quantity,
      0
    );
  };

  // Función para calcular el total de una orden
  const calcularTotalOrden = (orden) => {
    const itemsFiltrados = orden.items.filter(
      (item) => item.product_id !== PRODUCTO_A_FILTRAR
    );
    return itemsFiltrados.reduce(
      (sum, item) => sum + item.price_unit * item.quantity,
      0
    );
  };

  // Función para quitar un producto
  const quitarProductoDeVenta = (ventaId, productId) => {
    setDetalleVentas((prev) => {
      const items = prev[ventaId] || [];
      const existingItemIndex = items.findIndex(
        (i) => i.product_id === productId
      );

      if (existingItemIndex >= 0) {
        const item = items[existingItemIndex];
        if (item.quantity > 1) {
          const nuevosItems = items.map((i) =>
            i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
          );
          return { ...prev, [ventaId]: nuevosItems };
        } else {
          const nuevosItems = items.filter((i) => i.product_id !== productId);
          return { ...prev, [ventaId]: nuevosItems };
        }
      }
      return prev;
    });
  };

  // Función para editar precio de un producto
  const editarPrecioProducto = (ventaId, productId) => {
    const items = detalleVentas[ventaId] || [];
    const item = items.find((i) => i.product_id === productId);
    if (item) {
      setEditandoPrecio({ ventaId, productId });
      setNuevoPrecio(item.price_unit.toString());
    }
  };

  // Función para guardar el nuevo precio
  const guardarNuevoPrecio = () => {
    if (!editandoPrecio || !nuevoPrecio || isNaN(parseFloat(nuevoPrecio))) {
      showErrorAlert("Por favor ingrese un precio válido");
      return;
    }

    const precioNumerico = parseFloat(nuevoPrecio);
    if (precioNumerico <= 0) {
      showErrorAlert("El precio debe ser mayor que cero");
      return;
    }

    setDetalleVentas((prev) => {
      const items = prev[editandoPrecio.ventaId] || [];
      const nuevosItems = items.map((item) =>
        item.product_id === editandoPrecio.productId
          ? { ...item, price_unit: precioNumerico }
          : item
      );
      return { ...prev, [editandoPrecio.ventaId]: nuevosItems };
    });

    setEditandoPrecio(null);
    setNuevoPrecio("");
    showSuccessAlert("Precio actualizado correctamente");
  };

  // Función para completar una orden
  const completarOrden = async (ordenId) => {
    try {
      await createSale({ order_id: ordenId });

      // Actualizar listas de órdenes
      const ordenesActualizadas = await getAllOrders();

      // Filtrar órdenes pendientes
      const nuevasPendientes = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "pending" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      // Filtrar órdenes completadas
      const nuevasCompletadas = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "completed" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);

      showSuccessAlert("Orden completada correctamente");
    } catch (error) {
      console.error("Error al completar la orden:", error);
      showErrorAlert("Error al completar la orden");
    }
  };

  // Función para editar una orden pendiente
  const editarOrdenPendiente = (ordenId) => {
    const ventaId = `venta-${ordenId}`;

    if (ventas.includes(ventaId)) {
      setActiveTab(ventaId);
      return;
    }

    const orden = ordenesPendientes.find((o) => o.id === ordenId);
    if (!orden) return;

    const nuevoDetalleVentas = {
      [ventaId]: orden.items
        .filter((item) => item.product_id !== PRODUCTO_A_FILTRAR)
        .map((item) => ({
          product_id: item.product_id,
          name:
            productos.find((p) => p.id === item.product_id)?.name ||
            `Producto ${item.product_id}`,
          price_unit: item.price_unit,
          quantity: item.quantity,
          image_url:
            productos.find((p) => p.id === item.product_id)?.image_url || null,
        })),
    };

    const clienteId = orden.customer_id;

    // Actualizamos el estado de orderUsers antes de setVentas
    setOrderUsers((ou) => ({ ...ou, [ventaId]: clienteId }));
    setVentas((v) => [...v, ventaId]);
    setDetalleVentas((d) => ({ ...d, ...nuevoDetalleVentas }));
    setActiveTab(ventaId);

    // Actualizar localStorage
    saveToStorage("ventas", [...ventas, ventaId]);
    saveToStorage("orderUsers", { ...orderUsers, [ventaId]: clienteId });
    saveToStorage("detalleVentas", { ...detalleVentas, ...nuevoDetalleVentas });
  };
  // Función para eliminar una orden pendiente
  const eliminarOrdenPendiente = async (ordenId) => {
    const confirmed = await confirmDelete(
      "¿Deseas eliminar esta orden pendiente?"
    );
    if (!confirmed) return;

    try {
      await deleteOrder(ordenId);

      // Actualizar listas de órdenes
      const ordenesActualizadas = await getAllOrders();

      // Filtrar órdenes pendientes
      const nuevasPendientes = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "pending" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      // Filtrar órdenes completadas
      const nuevasCompletadas = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "completed" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);

      showSuccessAlert("Orden eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      showErrorAlert("Error al eliminar la orden");
    }
  };

  // Carga inicial
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      // Cargar datos del localStorage
      const storedVentas = loadFromStorage("ventas", []);
      const storedDetalleVentas = loadFromStorage("detalleVentas", {});
      const storedOrderUsers = loadFromStorage("orderUsers", {});

      // Filtrar ventas que tienen un cliente válido en orderUsers
      const ventasValidas = storedVentas.filter(
        (ventaId) => storedOrderUsers[ventaId] !== undefined
      );

      setVentas(ventasValidas);
      setDetalleVentas(storedDetalleVentas);
      setOrderUsers(storedOrderUsers);

      try {
        const [productosData, ordenesData, clientesData] = await Promise.all([
          getAllProducts(),
          getAllOrders(),
          getAllCustomers(),
        ]);

        // Filtrar órdenes pendientes
        const ordenesPendientesFiltradas = ordenesData.filter(
          (orden) =>
            orden.status === "pending" &&
            orden.customer?.name &&
            orden.customer.name.trim() !== ""
        );

        // Filtrar órdenes completadas
        const ordenesCompletadasFiltradas = ordenesData.filter(
          (orden) =>
            orden.status === "completed" &&
            orden.customer?.name &&
            orden.customer.name.trim() !== ""
        );

        setProductos(productosData);
        setOrdenesPendientes(ordenesPendientesFiltradas);
        setOrdenesCompletadas(ordenesCompletadasFiltradas);
        setClientes(clientesData);
      } catch (err) {
        console.error("Error cargando datos iniciales", err);
        showErrorAlert("Error al cargar los datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Persistencia en localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage("ventas", ventas);
      saveToStorage("detalleVentas", detalleVentas);
      saveToStorage("orderUsers", orderUsers);
    }, 300);

    return () => clearTimeout(timer);
  }, [ventas, detalleVentas, orderUsers]);

  // Crear nueva venta
  const crearVenta = async () => {
    const defaultCustomerId = clientes.length > 0 ? clientes[0].id : null;

    if (!defaultCustomerId) {
      showErrorAlert("No hay clientes disponibles para crear una venta");
      return;
    }

    const defaultProductId = PRODUCTO_A_FILTRAR;

    try {
      const defaultProduct = productos.find((p) => p.id === defaultProductId);

      if (!defaultProduct) {
        throw new Error("Producto predeterminado no encontrado");
      }

      const nuevaOrden = {
        customer_id: defaultCustomerId,
        items: [
          {
            product_id: defaultProductId,
            quantity: 1,
            price_unit: defaultProduct.sale_price,
          },
        ],
        status: "pending",
      };

      const createdOrder = await createOrder(nuevaOrden);
      const nuevaVentaId = `venta-${createdOrder.id}`;

      setVentas((v) => [...v, nuevaVentaId]);
      setOrderUsers((ou) => ({ ...ou, [nuevaVentaId]: defaultCustomerId }));

      // No agregamos el producto inicial (ID 1) al detalle de ventas
      setDetalleVentas((d) => ({
        ...d,
        [nuevaVentaId]: [],
      }));

      setActiveTab(nuevaVentaId);
      setOrdenesPendientes((prev) => [...prev, createdOrder]);

      saveToStorage("ventas", [...ventas, nuevaVentaId]);
      saveToStorage("orderUsers", {
        ...orderUsers,
        [nuevaVentaId]: defaultCustomerId,
      });
      saveToStorage("detalleVentas", {
        ...detalleVentas,
        [nuevaVentaId]: [],
      });
    } catch (error) {
      console.error("Error al crear la orden:", error);
      showErrorAlert("Error al crear la orden");
    }
  };

  // Actualizar orden
  const actualizarOrden = async (ventaId) => {
    try {
      const orderId = ventaId.replace("venta-", "");
      const customerId = orderUsers[ventaId];
      // Filtrar el producto 1 para que no se envíe al backend
      const items = (detalleVentas[ventaId] || []).filter(
        (item) => item.product_id !== PRODUCTO_A_FILTRAR
      );

      const orderData = {
        customer_id: customerId,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_unit: item.price_unit,
        })),
        status: "pending",
      };

      await putOrder(orderId, orderData);
      const ordenesActualizadas = await getAllOrders();

      // Filtrar órdenes pendientes
      const nuevasPendientes = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "pending" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      // Filtrar órdenes completadas
      const nuevasCompletadas = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "completed" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);

      showSuccessAlert("Orden actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      showErrorAlert("Error al actualizar la orden");
    }
  };

  // Eliminar venta
  const eliminarVenta = async (ventaId) => {
    if (!ventas.includes(ventaId)) return;

    const confirmed = await confirmDelete("¿Deseas eliminar esta venta?");
    if (!confirmed) return;

    try {
      const orderId = ventaId.replace("venta-", "");
      await deleteOrder(orderId);

      setVentas((v) => v.filter((x) => x !== ventaId));
      setDetalleVentas((d) => {
        const { [ventaId]: _, ...rest } = d;
        return rest;
      });
      setOrderUsers((ou) => {
        const { [ventaId]: _, ...rest } = ou;
        return rest;
      });

      const ordenesActualizadas = await getAllOrders();

      // Filtrar órdenes pendientes
      const nuevasPendientes = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "pending" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      // Filtrar órdenes completadas
      const nuevasCompletadas = ordenesActualizadas.filter(
        (orden) =>
          orden.status === "completed" &&
          orden.customer?.name &&
          orden.customer.name.trim() !== ""
      );

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);

      if (activeTab === ventaId) setActiveTab("pedidos");

      showSuccessAlert("Venta eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      showErrorAlert("Error al eliminar la orden");
    }
  };

  // Cambiar usuario
  const cambiarUsuarioVenta = (ventaId, userId) => {
    if (!orderUsers.hasOwnProperty(ventaId)) return;
    setOrderUsers((ou) => ({ ...ou, [ventaId]: userId }));
  };

  // Agregar producto
  const agregarProductoAVenta = (ventaId, producto) => {
    setDetalleVentas((prev) => {
      const items = prev[ventaId] || [];
      const existingItemIndex = items.findIndex(
        (i) => i.product_id === producto.id
      );

      if (existingItemIndex >= 0) {
        const nuevosItems = items.map((i) =>
          i.product_id === producto.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { ...prev, [ventaId]: nuevosItems };
      }

      const nuevoItem = {
        product_id: producto.id,
        name: producto.name,
        price_unit: producto.sale_price,
        quantity: 1,
        image_url: producto.image_url || null,
      };

      return { ...prev, [ventaId]: [...items, nuevoItem] };
    });
  };

  // Función para manejar el cierre de pestaña
  const handleCloseTab = (ventaId, e) => {
    e.stopPropagation();
    setVentas((v) => v.filter((x) => x !== ventaId));
    setOrderUsers((ou) => {
      const { [ventaId]: _, ...rest } = ou;
      return rest;
    });
    if (activeTab === ventaId) setActiveTab("pedidos");
  };

  // Filtrar clientes por nombre
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.name.toLowerCase().includes(filtroCliente.toLowerCase())
  );

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((producto) =>
    producto.name.toLowerCase().includes(filtroProducto.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <Sidebar />
          </div>
          <div
            className="col-11 d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="col-11">
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h2>Gestión de Ventas</h2>
            <button className="btn btn-success" onClick={crearVenta}>
              + Nueva Venta
            </button>
          </div>

          <ul className="nav nav-tabs mt-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "pedidos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pedidos")}
              >
                Pedidos Pendientes
              </button>
            </li>
            {ventas.map((id) => (
              <li className="nav-item" key={id}>
                <button
                  className={`nav-link ${activeTab === id ? "active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  {id.replace("venta-", "Venta #")}
                  <button
                    type="button"
                    className="ms-2 btn-close btn-close-white"
                    style={{ fontSize: "0.5rem" }}
                    onClick={(e) => handleCloseTab(id, e)}
                    aria-label="Cerrar"
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content mt-3">
            {activeTab === "pedidos" && (
              <div className="tab-pane fade show active">
                <h4>Pedidos Pendientes</h4>
                {ordenesPendientes.length === 0 ? (
                  <div className="alert alert-info">
                    No hay órdenes pendientes.
                  </div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Alias</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesPendientes
                        .filter((orden) => {
                          // Filtrar órdenes con total mayor a 0
                          const itemsFiltrados = orden.items.filter(
                            (item) => item.product_id !== PRODUCTO_A_FILTRAR
                          );
                          const total = itemsFiltrados.reduce(
                            (sum, item) =>
                              sum + item.price_unit * item.quantity,
                            0
                          );
                          return total > 0;
                        })
                        .map((orden) => {
                          // Filtrar el producto 1 para no mostrarlo
                          const itemsFiltrados = orden.items.filter(
                            (item) => item.product_id !== PRODUCTO_A_FILTRAR
                          );
                          const total = itemsFiltrados.reduce(
                            (sum, item) =>
                              sum + item.price_unit * item.quantity,
                            0
                          );

                          return (
                            <tr key={orden.id}>
                              <td>{orden.id}</td>
                              <td>
                                {orden.customer?.name ||
                                  "Cliente no especificado"}
                              </td>
                              <td>{orden.customer?.alias || "-"}</td>
                              <td>
                                <ul className="list-unstyled">
                                  {itemsFiltrados.map((item) => (
                                    <li key={item.product_id}>
                                      {item.quantity} x{" "}
                                      {productos.find(
                                        (p) => p.id === item.product_id
                                      )?.name || `Producto ${item.product_id}`}
                                      (${item.price_unit})
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td>${total.toFixed(2)}</td>
                              <td>
                                <span className="badge bg-warning text-dark">
                                  Pendiente
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => completarOrden(orden.id)}
                                  >
                                    Completar
                                  </button>
                                  <button
                                    className="btn btn-info btn-sm"
                                    onClick={() =>
                                      editarOrdenPendiente(orden.id)
                                    }
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      eliminarOrdenPendiente(orden.id)
                                    }
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}

                <h4 className="mt-5">Pedidos Completados</h4>
                {ordenesCompletadas.length === 0 ? (
                  <div className="alert alert-info">
                    No hay órdenes completadas.
                  </div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Alias</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesCompletadas.map((orden) => {
                        // Filtrar el producto 1 para no mostrarlo
                        const itemsFiltrados = orden.items.filter(
                          (item) => item.product_id !== PRODUCTO_A_FILTRAR
                        );
                        const total = itemsFiltrados.reduce(
                          (sum, item) => sum + item.price_unit * item.quantity,
                          0
                        );

                        return (
                          <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>
                              {orden.customer?.name ||
                                "Cliente no especificado"}
                            </td>
                            <td>{orden.customer?.alias || "-"}</td>
                            <td>
                              <ul className="list-unstyled">
                                {itemsFiltrados.map((item) => (
                                  <li key={item.product_id}>
                                    {item.quantity} x{" "}
                                    {productos.find(
                                      (p) => p.id === item.product_id
                                    )?.name || `Producto ${item.product_id}`}
                                    (${item.price_unit})
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>${total.toFixed(2)}</td>
                            <td>
                              <span className="badge bg-success">
                                Completado
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {ventas.map(
              (id) =>
                activeTab === id && (
                  <div key={id} className="tab-pane fade show active">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <strong>Cliente:</strong>{" "}
                        {clientes.find((u) => u.id === orderUsers[id])?.name ||
                          "Cliente no encontrado"}
                      </div>
                      <div>
                        <button
                          className="btn btn-info me-2"
                          onClick={() => actualizarOrden(id)}
                        >
                          Guardar Orden
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => eliminarVenta(id)}
                        >
                          Eliminar Venta
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Filtrar clientes por nombre..."
                        value={filtroCliente}
                        onChange={(e) => setFiltroCliente(e.target.value)}
                      />
                      <div className="d-flex flex-wrap gap-2">
                        {clientesFiltrados.map((cliente) => {
                          const isActive = orderUsers[id] === cliente.id;
                          return (
                            <button
                              key={cliente.id}
                              className={`btn d-flex align-items-center ${
                                isActive ? "btn-info" : "btn-outline-info"
                              }`}
                              onClick={() =>
                                cambiarUsuarioVenta(id, cliente.id)
                              }
                              style={{ height: "40px" }}
                            >
                              {cliente.avatar && (
                                <img
                                  src={cliente.avatar}
                                  alt={cliente.name}
                                  className="rounded-circle me-2"
                                  width="30"
                                  height="30"
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                              <span>{cliente.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <h5>Productos</h5>
                        <input
                          type="text"
                          className="form-control mb-3"
                          placeholder="Filtrar productos por nombre..."
                          value={filtroProducto}
                          onChange={(e) => setFiltroProducto(e.target.value)}
                        />
                        <div className="row">
                          {productosFiltrados
                            .filter((p) => p.id !== PRODUCTO_A_FILTRAR) // Filtrar producto con ID 1
                            .map((p) => (
                              <div
                                key={p.id}
                                className="col-md-3 col-sm-6 mb-3"
                              >
                                <div className="card">
                                  {p.image_url && (
                                    <img
                                      src={p.image_url}
                                      className="card-img-top"
                                      alt={p.name}
                                      style={{
                                        height: "120px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  <div className="card-body">
                                    <h6>{p.name}</h6>
                                    <p>${p.sale_price}</p>
                                    <div className="d-flex justify-content-between">
                                      <button
                                        className="btn btn-info btn-sm"
                                        onClick={() =>
                                          agregarProductoAVenta(id, p)
                                        }
                                      >
                                        + Añadir
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          quitarProductoDeVenta(id, p.id)
                                        }
                                      >
                                        - Quitar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <h5>Detalles de la Venta</h5>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Precio</th>
                              <th>Cantidad</th>
                              <th>Total</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(detalleVentas[id] || [])
                              .filter(
                                (item) => item.product_id !== PRODUCTO_A_FILTRAR
                              ) // Filtramos el producto 1
                              .map((i) => (
                                <tr key={i.product_id}>
                                  <td>{i.name}</td>
                                  <td>
                                    {editandoPrecio?.ventaId === id &&
                                    editandoPrecio?.productId ===
                                      i.product_id ? (
                                      <div className="d-flex align-items-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          value={nuevoPrecio}
                                          onChange={(e) =>
                                            setNuevoPrecio(e.target.value)
                                          }
                                          style={{ width: "80px" }}
                                        />
                                        <button
                                          className="btn btn-success btn-sm ms-2"
                                          onClick={guardarNuevoPrecio}
                                        >
                                          ✓
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm ms-1"
                                          onClick={() => {
                                            setEditandoPrecio(null);
                                            setNuevoPrecio("");
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <span
                                        onClick={() =>
                                          editarPrecioProducto(id, i.product_id)
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        ${i.price_unit}
                                      </span>
                                    )}
                                  </td>
                                  <td>{i.quantity}</td>
                                  <td>
                                    ${(i.price_unit * i.quantity).toFixed(2)}
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        quitarProductoDeVenta(id, i.product_id)
                                      }
                                    >
                                      Quitar
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="text-end">
                          <strong>
                            Total: ${calcularTotalVenta(id).toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
