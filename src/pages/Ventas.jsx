import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import List from "../components/List.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import VentaForm from "../components/VentaForm.jsx";
import { getAllProducts } from "../services/requests/products.js";
import { getAllCustomers } from "../services/requests/customers.js";

export default function Ventas() {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteBuscado, setClienteBuscado] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        const data = await getAllCustomers();
        setClientes(data); // Asignar los datos de clientes cargados
      } catch (error) {
        console.error("Error al cargar clientes", error);
      }
    };

    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        const productosTransformados = data.map(p => ({
          ...p,
          nombre: p.name,
          precio: p.sale_price,
          cantidad: p.quantity || 1,
        }));
        setProducts(productosTransformados);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };

    loadClientes();
    loadProducts();
  }, []);

  // Función para agregar productos seleccionados
  const agregarProducto = (producto) => {
    setProductosSeleccionados((prev) => {
      const existente = prev.find((p) => p.id === producto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      } else {
        return [...prev, { ...producto }];
      }
    });
  };

  // Función para eliminar productos seleccionados
  const eliminarProducto = (id) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.id !== id));
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: nuevaCantidad } : p))
    );
  };

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <div className="row m-0">
        <List
          productos={products}
          onAgregarProducto={agregarProducto}
        />
        <div className="col p-0 m-0">
          {/* Se pasa clienteSeleccionado al formulario de ventas */}
          <VentaForm
            productos={productosSeleccionados}
            onEliminarProducto={eliminarProducto}
            onActualizarCantidad={actualizarCantidad}
            cliente={clienteSeleccionado}
            clientes={clientes} // Asegúrate de pasar los clientes a VentaForm
            setClienteSeleccionado={setClienteSeleccionado}
            setClienteBuscado={setClienteBuscado}
            clienteBuscado={clienteBuscado}
          />
        </div>
      </div>

      <Sidebar />
      <MenuInferior />
    </div>
  );
}
