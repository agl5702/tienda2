import { useState, useEffect, useRef } from "react";
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
import MenuMovil from "../components/MenuMovil.jsx";
import AddDebButton from "../components/AddDebButton.jsx";
import DownloadInvoiceButton from "../components/DownloadInvoiceButton.jsx";
import "../components/css/MenuInferior.css";
import { LuChevronDown } from "react-icons/lu";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { CiBadgeDollar } from "react-icons/ci";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { TbClipboardList } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import Footer from "../components/Footer.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "../components/FacturaPDF.jsx";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { PiFileArrowDownLight } from "react-icons/pi";
import { FaFileDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
// import WhatsAppButton from "../components/WhatsAppButton.jsx"

import { formatQuantity } from "../services/utils/formatQuantity";
import { formatNumber } from "../services/utils/format.js";

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

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
  
  const audioRef = useRef(null);
  const [editandoItem, setEditandoItem] = useState(null); // Ahora guardará {ventaId, productId}
  const [nuevoValores, setNuevoValores] = useState({
    precio: "",
    cantidad: "",
  });
  const [busqueda, setBusqueda] = useState("");

  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(15); // Cantidad de items por página

  const navigate = useNavigate();

  const limpiarInput = () => {
    setBusqueda("");
  };

  // Filtrado dinámico por nombre (puedes ampliar a otro dato si quieres)
  const ordenesCompletadasFiltradas = ordenesCompletadas.filter((orden) => {
    const idCoincide = orden.id
      .toString()
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const nombreClienteCoincide = orden.customer?.name
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const aliasClienteCoincide = orden.customer?.alias
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    return idCoincide || nombreClienteCoincide || aliasClienteCoincide;
  });

  // Precarga el sonido cuando el componente se monta
  useEffect(() => {
    audioRef.current = new Audio('/sonidos/delete.mp3');
    // Opcional: precarga el sonido
    audioRef.current.load();
    
    // Limpieza al desmontar el componente
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 3. Función para reproducir el sonido
  const playSound = () => {
    try {
      // Si ya existe una instancia de audio, la reutilizamos
      if (!audioRef.current) {
        audioRef.current = new Audio('/sonidos/delete.mp3');
      }
      audioRef.current.currentTime = 0; // Reinicia el audio si ya estaba reproduciéndose
      audioRef.current.play();
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    }
  };

  // Cálculos para la paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = ordenesCompletadasFiltradas.slice(
    indicePrimerItem,
    indiceUltimoItem
  );
  const totalPaginas = Math.ceil(
    ordenesCompletadasFiltradas.length / itemsPorPagina
  );

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    // Opcional: Scroll hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Constante para el ID del producto a filtrar (precio 0)
  const PRODUCTO_A_FILTRAR = 2;

  // Función para mostrar alerta de éxito
  const showSuccessAlert = (message) => {
    Swal.fire({
      toast: true,
      icon: "success",
      position: "bottom-end", // esquina inferior derecha
      title: "Éxito",
      text: message,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: "small-toast", // clase personalizada para hacerlo más pequeño
      },
    });
  };

  const showSuccessAlertCorto = (message) => {
    Swal.fire({
      toast: true,
      icon: "success",
      position: "bottom-end", // esquina inferior derecha
      title: "Éxito",
      text: message,
      timer: 800,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: "small-toast", // clase personalizada para hacerlo más pequeño
      },
    });
  };

  // Función para mostrar alerta de error
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      toast: true,
      position: "bottom-end", // esquina inferior derecha
      text: message,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: "small-toast", // clase personalizada para hacerlo más pequeño
      },
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
          // QUITAR COMPLETAMENTE EL PRODUCTO
          const nuevosItems = items.filter((i) => i.product_id !== productId);
          return { ...prev, [ventaId]: nuevosItems };
        } else {
          const nuevosItems = items.filter((i) => i.product_id !== productId);
          return { ...prev, [ventaId]: nuevosItems };
        }
      }
      return prev;
    });
  };

  // Función para guardar los nuevos valores
  const guardarNuevosValores = () => {
    if (!editandoItem || !nuevoValores.precio || !nuevoValores.cantidad) {
      showErrorAlert("Por favor complete todos los campos");
      return;
    }

    const precioNumerico = parseFloat(nuevoValores.precio);
    const cantidadNumerica = parseFloat(nuevoValores.cantidad);

    if (isNaN(precioNumerico) || isNaN(cantidadNumerica)) {
      showErrorAlert("Por favor ingrese valores válidos");
      return;
    }

    if (precioNumerico <= 0 || cantidadNumerica <= 0) {
      showErrorAlert("El precio y la cantidad deben ser mayores que cero");
      return;
    }

    setDetalleVentas((prev) => {
      const items = prev[editandoItem.ventaId] || [];
      const nuevosItems = items.map((item) =>
        item.product_id === editandoItem.productId
          ? {
              ...item,
              price_unit: precioNumerico,
              quantity: cantidadNumerica,
            }
          : item
      );
      return { ...prev, [editandoItem.ventaId]: nuevosItems };
    });

    setEditandoItem(null);
    setNuevoValores({ precio: "", cantidad: "" });
    showSuccessAlertCorto("Valores actualizados correctamente");
  };

  // Función para iniciar la edición
  const editarItem = (ventaId, productId, precioActual, cantidadActual) => {
    setEditandoItem({ ventaId, productId });
    setNuevoValores({
      precio: precioActual.toString(),
      cantidad: cantidadActual.toString(),
    });
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
      const nuevasCompletadas = ordenesActualizadas
        .filter(
          (orden) =>
            orden.status === "completed" &&
            orden.customer?.name &&
            orden.customer.name.trim() !== ""
        )
        .sort((a, b) => b.id - a.id); // Orden descendente (ID más alto primero)

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);
      setPaginaActual(1); // <-- Añade aquí

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
          unit: item.product.unit,
          image_url:
            productos.find((p) => p.id === item.product_id)?.image_url || null,
        })),
    };

    const clienteId = orden.customer.id;

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
      setPaginaActual(1); // <-- Añade aquí

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
        const ordenesCompletadasFiltradas = ordenesData
          .filter(
            (orden) =>
              orden.status === "completed" &&
              orden.customer?.name &&
              orden.customer.name.trim() !== ""
          )
          .sort((a, b) => b.id - a.id); // Orden descendente (ID más alto primero)
        setProductos(productosData);
        setOrdenesPendientes(ordenesPendientesFiltradas);
        setOrdenesCompletadas(ordenesCompletadasFiltradas);
        setPaginaActual(1); // <-- Añade aquí
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
  const actualizarOrden = async (ventaId, shouldCloseTab = false) => {
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
      const nuevasCompletadas = ordenesActualizadas
        .filter(
          (orden) =>
            orden.status === "completed" &&
            orden.customer?.name &&
            orden.customer.name.trim() !== ""
        )
        .sort((a, b) => b.id - a.id); // Orden descendente (ID más alto primero)

      setOrdenesPendientes(nuevasPendientes);
      setOrdenesCompletadas(nuevasCompletadas);
      setPaginaActual(1); // <-- Añade aquí

      // NUEVO: Cierra la pestaña si se solicita
      if (shouldCloseTab) {
        handleCloseTab(ventaId, { stopPropagation: () => {} });
      }

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
      setPaginaActual(1); // <-- Añade aquí

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

  // saber si ya se agrego un producto

  const productoEstaEnVenta = (ventaId, productId) => {
    const items = detalleVentas[ventaId] || [];
    return items.some(item => item.product_id === productId);
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
        unit: producto.unit,
        quantity: 1,
        image_url: producto.image_url || null,
      };
      // Reproduce el sonido solo cuando es un producto nuevo
      playSound();
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

  // mostrar el dropdown
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  // modal productos
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCliente, setIsOpenCliente] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <Sidebar />
            <MenuMovil />
          </div>
          <div
            className="col-12 d-flex justify-content-center align-items-center"
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
    <>
      <div className="m-0 padding-menu">
        <Sidebar />
        <MenuMovil />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid zp-2">
            {/*  */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mt-1">
                <h3 className="my-auto">Gestión de Ventas</h3>
                <button
                  className="btn bg-info btn-sm text-white mt-1 pt-2"
                  onClick={crearVenta}
                >
                  + Nuevo pedido
                </button>
              </div>

              {/* ventanas */}
              <div className="d-flex mt-1">
                {/* Dropdown para seleccionar ventas abiertas */}
                <div
                  className="my-auto mb-2"
                  style={{ position: "relative", display: "inline-block" }}
                  ref={ref}
                >
                  <div
                    className={`list me-1 mb-n1 border bg-gradient-dark text-white ms-1 px-2 py-1`}
                  >
                    <div className="">
                      <LuChevronDown
                        onClick={() => setOpen(!open)}
                        size={20}
                        className=""
                      />
                    </div>
                  </div>
                  {open && (
                    <div
                      className="ventana-list bg-gradient-dark border border-1 border-dark card"
                      style={{
                        position: "absolute",
                        top: "122%",
                        left: 0,
                        zIndex: 1000,
                        borderRadius: "10px",
                      }}
                    >
                      {ventas.map((id) => (
                        <div
                          className={`col-auto text-center my-auto py-1 px-2 ${
                            activeTab === id
                              ? "bg-white text-dark"
                              : "text-white"
                          }`}
                          style={{ borderRadius: "10px" }}
                          key={id}
                        >
                          <div
                            className="py-1"
                            onClick={() => setActiveTab(id)}
                          >
                            {id.replace("venta-", "Venta #")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* /Dropdown */}

                <div className="d-flex table-responsive">
                  <div
                    className={`col-auto ventana my-auto px-3 ${
                      activeTab === "pedidos"
                        ? "active-ventana"
                        : "border text-dark"
                    }`}
                  >
                    <div
                      className="py-2"
                      onClick={() => setActiveTab("pedidos")}
                    >
                      <TbClipboardList className="mt-n1" /> Pedidos
                    </div>
                  </div>

                  {ventas.map((id) => (
                    <div
                      className={`col-auto ventana my-auto px-3 ${
                        activeTab === id ? "active-ventana" : "border text-dark"
                      }`}
                      key={id}
                    >
                      <div className="py-2" onClick={() => setActiveTab(id)}>
                        {id.replace("venta-", "Pedido #")}
                        <button
                          type="button"
                          className={`ms-4 me-n2 btn-close border border-radius-2xl p-1 bg-danger ${
                            activeTab === id ? "" : "d-none"
                          }`}
                          style={{ fontSize: "0.5rem" }}
                          onClick={(e) => handleCloseTab(id, e)}
                          aria-label="Cerrar"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* /ventanas */}

              <div
                className="tab-content card border border-1 border-dark p-2"
                style={{ marginTop: "-1px" }}
              >
                {/* Pedidos Pendientes */}
                {activeTab === "pedidos" && (
                  <div className="tab-pane fade show active">
                    <h4>Pedidos Pendientes</h4>
                    {ordenesPendientes.length === 0 ? (
                      <div className="alert">No hay órdenes pendientes.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover table-sm align-middle text-center">
                          <thead className="bg-gradient-dark text-white ">
                            <tr>
                              <th>#</th>
                              <th>Cliente</th>
                              <th>Alias</th>
                              {/* <th>Productos</th> */}
                              <th>Total</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordenesPendientes
                              .filter((orden) => {
                                const customerId =
                                  orden.customer?.id || orden.customer_id;
                                if (!customerId) {
                                  console.warn(
                                    `Orden ${orden.id} no tiene ID de cliente`
                                  );
                                  return false;
                                }

                                // Filtrar órdenes con total mayor a 0
                                const itemsFiltrados = orden.items.filter(
                                  (item) =>
                                    item.product_id !== PRODUCTO_A_FILTRAR
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

                                const ordenConCustomerId = {
                                  ...orden,
                                  customer_id:
                                    orden.customer?.id || orden.customer_id,
                                };
                                const itemsFiltrados = orden.items.filter(
                                  (item) =>
                                    item.product_id !== PRODUCTO_A_FILTRAR
                                );
                                const total = itemsFiltrados.reduce(
                                  (sum, item) =>
                                    sum + item.price_unit * item.quantity,
                                  0
                                );

                                return (
                                  <tr key={orden.id}>
                                    <td className=" text-bold text-lg text-dark">{orden.id}</td>
                                    <td className=" text-bold text-lg text-danger">
                                      {orden.customer?.name ||
                                        "Cliente no especificado"}
                                    </td>
                                    <td className=" text-bold text-lg text-dark">{orden.customer?.alias || "-"}</td>
                                    <td className=" text-bold text-lg text-dark">$ {formatNumber(total)}</td>
                                    <td>
                                      <span className="badge border border-warning text-warning">
                                        Pendiente
                                      </span>
                                    </td>
                                    <td>
                                      <div className="">
                                        {/* <AddDebButton
                                          order={ordenConCustomerId}
                                          createDebt={createDebt}
                                          paymentDebts={paymentDebts} // Asegúrate de incluir esto siempre
                                        /> */}
                                        
                                        {/* <WhatsAppButton
                                          invoiceId={orden.id}          // ID de la factura
                                          defaultMessage="Hola, Se ha generado la factura de tu pedido, Mirala desde este link:" // Mensaje opcional
                                        /> */}
                                        
                                        <DownloadInvoiceButton order={orden} />

                                        <button
                                          className="btn btn-success btn-sm ms-2"
                                          onClick={() =>
                                            completarOrden(orden.id)
                                          }
                                        >
                                          Completar ✓
                                        </button>
                                        <button
                                          className="btn btn-warning btn-sm ms-2"
                                          onClick={() =>
                                            editarOrdenPendiente(orden.id)
                                          }
                                        >
                                          Editar
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm ms-2"
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
                      </div>
                    )}
                  </div>
                )}

                {/* Renderizar las pestañas de ventas individuales */}

                {ventas.map(
                  (id) =>
                    activeTab === id && (
                      <div key={id} className="tab-pane fade show active">
                        {/* Modal productos */}
                        <div className="">
                          {isOpen && (
                            <div
                              className="modal modal-xl fade show d-block"
                              tabIndex="-1"
                              role="dialog"
                              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                              onClick={() => setIsOpen(false)}
                            >
                              <div
                                className="modal-dialog modal-dialog-centered"
                                role="document"
                                onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Añadir Productos
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close bg-danger"
                                      onClick={() => setIsOpen(false)}
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    {/* productos */}
                                    <div className="col-12">
                                      <input
                                        type="text"
                                        className="form-control mb-3 border ps-3"
                                        placeholder="Filtrar productos por nombre..."
                                        value={filtroProducto}
                                        onChange={(e) =>
                                          setFiltroProducto(e.target.value)
                                        }
                                      />
                                      <div
                                        className="row"
                                        style={{
                                          maxHeight: "400px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        {productosFiltrados
                                          .filter(
                                            (p) => p.id !== PRODUCTO_A_FILTRAR
                                          ) // Filtrar producto con ID 1
                                          .map((p) => (
                                            <>
                                              <div
                                                key={p.id}
                                                className="col-12 col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3 mb-3 px-2"
                                              >
                                                <div className="card bg-gray position-relative">
                                                  <span
                                                    className="bg-success opacity-9 pb-1 col-sm-3 text-white text-center position-absolute"
                                                    style={{
                                                      zIndex: 3,
                                                      borderRadius:
                                                        "10px 0px 20px",
                                                    }}
                                                  >
                                                    {" "}
                                                    20%
                                                  </span>
                                                  <div
                                                    className="card-header p-0 position-relative z-index-2"
                                                    style={{
                                                      borderRadius:
                                                        "0.75rem 0.75rem 0px 0px",
                                                    }}
                                                  >
                                                    <div className="d-block blur-shadow-image cursor-pointer img-marco ">
                                                      <img
                                                        src={p.image_url}
                                                        width="100%"
                                                        height="160vh"
                                                        alt="producto"
                                                        className="border-bottom img-size img-oferta "
                                                        style={{
                                                          borderRadius:
                                                            "0.75rem 0.75rem 0px 0px",
                                                        }}
                                                      />
                                                    </div>
                                                    <div
                                                      className="blur opacity-9 col-8 col-sm-6 text-dark text-center position-absolute"
                                                      style={{
                                                        zIndex: 3,
                                                        borderRadius:
                                                          "7px 0px 0px",
                                                        bottom: "1px",
                                                        right: "1px",
                                                        height: "20px",
                                                        fontSize: "15px",
                                                      }}
                                                    >
                                                      {p.category.name}
                                                    </div>
                                                    <div
                                                      className="colored-shadow"
                                                      style={{
                                                        backgroundImage: `url('${p.image_url}')`,
                                                      }}
                                                    ></div>
                                                  </div>
                                                  <div className="px-2 py-0">
                                                    <p className="text-dark text-center nombre mt-1 mb-0">
                                                      {p.name}
                                                    </p>
                                                    <div className="row justify-space-between text-center"></div>
                                                    <div className="text-dark text-center border-bottom pb-1 border-gray mb-2">
                                                      ${" "}
                                                      {formatNumber(
                                                        p.sale_price
                                                      )}{" "}
                                                      / {p.unit}
                                                    </div>
                                                    <div className="row m-0 mb-2 px-0 px-md-4 px-xl-5 text-center">
                                                    {!productoEstaEnVenta(id, p.id) ? (
                                                        <button
                                                          className="btn btn-sm bg-info text-white"
                                                          onClick={() => agregarProductoAVenta(id, p)}
                                                        >
                                                          Añadir
                                                        </button>
                                                      ) : (
                                                        <button
                                                          className="btn btn-sm bg-danger text-white"
                                                          onClick={() => quitarProductoDeVenta(id, p.id)}
                                                        >
                                                          Eliminar
                                                        </button>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      Cerrar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Modal clientes */}
                        <div className="">
                          {isOpenCliente && (
                            <div
                              className="modal modal-xl fade show d-block"
                              tabIndex="-1"
                              role="dialog"
                              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                              onClick={() => setIsOpenCliente(false)}
                            >
                              <div
                                className="modal-dialog modal-dialog-centered"
                                role="document"
                                onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro
                              >
                                <div className="modal-content">
                                  {/* Modal Header */}
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Seleccionar cliente
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close bg-danger"
                                      onClick={() => setIsOpenCliente(false)}
                                      aria-label="Close"
                                    ></button>
                                  </div>

                                  <div className="modal-body">
                                    {/* productos */}
                                    <div className="col-12">
                                      <input
                                        type="text"
                                        className="form-control mb-2 border ps-3"
                                        placeholder="Filtra Clientes por nombre o apodo"
                                        value={filtroCliente}
                                        onChange={(e) =>
                                          setFiltroCliente(e.target.value)
                                        }
                                      />

                                      {/* selecionar cliente */}
                                      <div
                                        className="row m-0"
                                        style={{
                                          maxHeight: "400px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        {clientesFiltrados.map((cliente) => {
                                          const isActive =
                                            orderUsers[id] === cliente.id;
                                          return (
                                            <div className="col-auto px-1 py-1">
                                              <div
                                                key={cliente.id}
                                                className={`btn px-3 ${
                                                  isActive
                                                    ? "btn-info"
                                                    : "btn-outline-dark"
                                                }`}
                                                onClick={() =>
                                                  cambiarUsuarioVenta(
                                                    id,
                                                    cliente.id
                                                  )
                                                }
                                              >
                                                {cliente.avatar && (
                                                  <img
                                                    src={cliente.avatar}
                                                    alt={cliente.name}
                                                    className="rounded-circle me-2"
                                                    width="30"
                                                    height="30"
                                                    style={{
                                                      objectFit: "cover",
                                                    }}
                                                  />
                                                )}
                                                <span>{cliente.name}</span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={() => setIsOpenCliente(false)}
                                    >
                                      Cerrar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="">
                          <h5 className="">Detalles del Pedido</h5>

                          {/* Seleccionar cliente */}
                          <div className="col-12 d-flex">
                            <h6 className="mb-0 mt-1 pe-2">Cliente</h6>
                            <button
                              onClick={() => setIsOpenCliente(true)}
                              className="btn btn-sm bg-info text-white "
                            >
                              Seleccionar otro
                            </button>
                          </div>

                          {/* mostrar cliente seleccionado */}

                          <div className="row">
                            <div className="col-auto">
                              <div className="card p-2 border border-dark mt-2">
                                <div className="row m-0">
                                  <div className="col-auto">
                                    {clientes.find(
                                      (u) => u.id === orderUsers[id]
                                    )?.avatar && (
                                      <img
                                        src={
                                          clientes.find(
                                            (u) => u.id === orderUsers[id]
                                          )?.avatar
                                        }
                                        alt={
                                          clientes.find(
                                            (u) => u.id === orderUsers[id]
                                          )?.name
                                        }
                                        className="rounded-circle me-2"
                                        width="30"
                                        height="30"
                                        style={{ objectFit: "cover" }}
                                      />
                                    )}
                                  </div>
                                  <div className="col-auto my-auto">
                                    <span className="text-dark">
                                      {clientes.find(
                                        (u) => u.id === orderUsers[id]
                                      )?.name || "Cliente no encontrado"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tabla de pedido */}

                          <h5 className=" mt-3">Productos agregados</h5>
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover table-sm align-middle text-center">
                              <thead className="bg-gradient-dark text-white ">
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
                                    (item) =>
                                      item.product_id !== PRODUCTO_A_FILTRAR
                                  )
                                  .map((i) => (
                                    <tr key={i.product_id}>
                                      <td>{i.name}</td>
                                      <td>
                                        {editandoItem?.ventaId === id &&
                                        editandoItem?.productId ===
                                          i.product_id ? (
                                          <div className="d-flex justify-content-center  border border-warning border-2">
                                            <input
                                              type="number"
                                              className="form-control form-control-sm"
                                              value={nuevoValores.precio}
                                              onChange={(e) =>
                                                setNuevoValores({
                                                  ...nuevoValores,
                                                  precio: e.target.value,
                                                })
                                              }
                                              placeholder="Precio"
                                            />
                                            <div className="my-auto pe-2">
                                              {i.unit}
                                            </div>
                                          </div>
                                        ) : (
                                          `$ ${formatNumber(i.price_unit)} /${
                                            i.unit
                                          }`
                                        )}
                                      </td>
                                      <td>
                                        {editandoItem?.ventaId === id &&
                                        editandoItem?.productId ===
                                          i.product_id ? (
                                          <input
                                            type="number"
                                            className="form-control form-control-sm border border-warning border-2"
                                            value={nuevoValores.cantidad}
                                            onChange={(e) =>
                                              setNuevoValores({
                                                ...nuevoValores,
                                                cantidad: e.target.value,
                                              })
                                            }
                                            placeholder="Cantidad"
                                          />
                                        ) : (
                                          <td className="">
                                            {formatQuantity(i.quantity)}
                                          </td>
                                        )}
                                      </td>
                                      <td>
                                        ${" "}
                                        {formatNumber(
                                          i.price_unit * i.quantity
                                        )}
                                      </td>
                                      <td>
                                        <div className="d-flex">
                                          {editandoItem?.ventaId === id &&
                                          editandoItem?.productId ===
                                            i.product_id ? (
                                            <>
                                              <button
                                                className="btn btn-success btn-sm me-1"
                                                onClick={guardarNuevosValores}
                                              >
                                                ✓
                                              </button>
                                              <button
                                                className="btn btn-danger btn-sm me-1"
                                                onClick={() => {
                                                  setEditandoItem(null);
                                                  setNuevoValores({
                                                    precio: "",
                                                    cantidad: "",
                                                  });
                                                }}
                                              >
                                                cancelar
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                className="btn btn-sm btn-outline-warning me-1"
                                                onClick={() =>
                                                  editarItem(
                                                    id,
                                                    i.product_id,
                                                    i.price_unit,
                                                    i.quantity
                                                  )
                                                }
                                                title="Editar"
                                              >
                                                <FaRegEdit />
                                              </button>

                                              <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                  quitarProductoDeVenta(
                                                    id,
                                                    i.product_id
                                                  )
                                                }
                                              >
                                                Quitar
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Botón para abrir el modal */}
                          <button
                            onClick={() => setIsOpen(true)}
                            className="btn btn-sm bg-info text-white mt-n3"
                          >
                            + Añadir productos
                          </button>

                          {/* total */}
                          <div className="text-end text-dark">
                            <h5 className="mt-3">
                              Total ${formatNumber(calcularTotalVenta(id))}
                            </h5>
                          </div>
                        </div>

                        <div
                          className="bg-white col-12 border-top border-2 py-2 text-center"
                          style={{ position: "sticky", bottom: "0px" }}
                        >
                          {/* si no quiero que se cierre la ventana no paso el true */}
                          <button
                            className="btn btn-info me-2 mb-n2"
                            onClick={() => actualizarOrden(id, true)}
                          >
                            Guardar
                          </button>

                          <button
                            className="btn btn-outline-danger mb-n2"
                            onClick={() => eliminarVenta(id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )
                )}
              </div>

              {/* Pedidos completadas*/}

              {activeTab === "pedidos" && (
                <div className="card mt-3 border border-1 border-dark p-2">
                  <h4 className="">Pedidos Completados ✓</h4>
                  <div className="d-flex my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                    <input
                      type="text"
                      className="form-control border border-2 ps-3"
                      placeholder="🔍 Buscar Venta por # o por cliente..."
                      value={busqueda}
                      onChange={(e) => {
                        setBusqueda(e.target.value);
                        // Resetear a página 1 cuando se busca
                        setPaginaActual(1);
                      }}
                    />
                    {busqueda && (
                      <button
                        onClick={limpiarInput}
                        className="bg-danger btn btn-sm text-white ms-1"
                      >
                        X
                      </button>
                    )}
                  </div>
                  {itemsActuales.length === 0 ? (
                    <div className="alert">No hay órdenes completadas.</div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover table-sm align-middle text-center">
                          <thead className="bg-gradient-dark text-white ">
                            <tr>
                              <th>#</th>
                              <th>Cliente</th>
                              <th>Alias</th>
                              {/* <th>Productos</th> */}
                              <th>Total</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsActuales.map((orden) => {
                              // Verificar que orden.items existe
                              const items = orden.items || [];
                              const itemsFiltrados = items.filter(
                                (item) => item.product_id !== PRODUCTO_A_FILTRAR
                              );
                              const total = itemsFiltrados.reduce(
                                (sum, item) =>
                                  sum + item.price_unit * item.quantity,
                                0
                              );

                              return (
                                <tr key={orden.id}>
                                  <td className=" text-bold text-lg text-dark">{orden.id}</td>
                                  <td className=" text-bold text-lg text-danger">
                                    {orden.customer?.name ||
                                      "Cliente no especificado"}
                                  </td>
                                  <td className=" text-bold text-lg text-dark">{orden.customer?.alias || "-"}</td>

                                  <td className=" text-bold text-lg text-dark">$ {formatNumber(total)}</td>
                                  <td>
                                  <span className="badge border border-success text-success">
                                      Completado
                                    </span>
                                  </td>
                                  <td>
                                    
                                    <DownloadInvoiceButton order={orden} />

                                    {/* <WhatsAppButton
                                      invoiceId={orden.id}          // ID de la factura
                                      defaultMessage="Hola, Se ha generado la factura de tu pedido, Mirala desde este link:" // Mensaje opcional
                                    /> */}

                                    <Link
                                      to={`/factura/${orden.id}`}
                                      className="badge d-none d-md-inline border ms-2 border-info text-info"
                                    >
                                      <FaEye /> ver
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Componente de Paginación */}
                      {ordenesCompletadasFiltradas.length > itemsPorPagina && (
                        <div className="col-12 d-flex justify-content-center mt-3">
                          <div className="table-responsive">
                            <div className="pagination py-1">
                              {/* Botón Anterior */}
                              <li
                                className={`page-item bg-white ${
                                  paginaActual === 1 ? "disabled" : ""
                                }`}
                              >
                                <button
                                  className={`page-link ${
                                    paginaActual === 1
                                      ? "disabled"
                                      : "text-info border-info"
                                  }`}
                                  onClick={() =>
                                    cambiarPagina(paginaActual - 1)
                                  }
                                  disabled={paginaActual === 1}
                                >
                                  <AiFillCaretLeft />
                                </button>
                              </li>

                              {/* Números de página */}
                              {Array.from(
                                { length: totalPaginas },
                                (_, i) => i + 1
                              ).map((numero) => (
                                <div key={numero}>
                                  <button
                                    className={`page-link ${
                                      paginaActual === numero
                                        ? "bg-info text-white"
                                        : "text-dark"
                                    }`}
                                    onClick={() => cambiarPagina(numero)}
                                    style={{
                                      cursor: "pointer",
                                      borderRadius: "50%",
                                      minWidth: "40px",
                                      height: "40px",
                                    }}
                                  >
                                    {numero}
                                  </button>
                                </div>
                              ))}

                              {/* Botón Siguiente */}
                              <li
                                className={`page-item ms-1 ${
                                  paginaActual === totalPaginas
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <button
                                  className={`page-link ${
                                    paginaActual === totalPaginas
                                      ? "disabled"
                                      : "text-info border-info"
                                  }`}
                                  onClick={() =>
                                    cambiarPagina(paginaActual + 1)
                                  }
                                  disabled={paginaActual === totalPaginas}
                                >
                                  <AiFillCaretRight />
                                </button>
                              </li>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            {/*  */}
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}
