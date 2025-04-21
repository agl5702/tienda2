import { useState } from "react";
import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import List from "../components/List.jsx"; // este será el componente que muestra productos y el botón "+"
import MenuInferior from "../components/MenuInferior.jsx";
import VentaForm from "../components/VentaForm.jsx"; // mostrará la tabla de productos seleccionados

export default function Home() {
  // Estado para productos seleccionados
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Agregar producto (sumar cantidad si ya existe)
  const agregarProducto = (producto) => {
    setProductosSeleccionados((prev) => {
      const yaExiste = prev.find((p) => p.id === producto.id);
      if (yaExiste) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto }];
    });
  };

  // Eliminar producto completamente
  const eliminarProducto = (id) => {
    setProductosSeleccionados((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
        <div className="row m-0">
          {/* List pasa la función agregarProducto */}
          <List onAgregar={agregarProducto} />

          {/* VentaForm recibe la lista y función para eliminar */}
          <div className="col p-0">
            <VentaForm
              productos={productosSeleccionados}
              onEliminar={eliminarProducto}
            />
          </div>
        </div>

        <Sidebar />
        <MenuInferior />
      </div>
    </>
  );
}
