import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import List from "../components/List.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import OrderForm from "../components/OrderForm.jsx";
import { getOrderById } from "../services/requests/orders.js";

export default function Ventas() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        const data = await getOrderById(id);
        setOrden({
          ...data,
          items: data.items || [], // <- esto es clave
        });
      } catch (error) {
        console.error("Error cargando la orden:", error);
      }
    };

    if (id) fetchOrden();
  }, [id]);

  const agregarProducto = (producto) => {
    const productoExistente = orden.items.find(
      (item) => item.product_id === producto.id
    );

    let nuevosItems;
    if (productoExistente) {
      nuevosItems = orden.items.map((item) =>
        item.product_id === producto.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price_unit,
            }
          : item
      );
    } else {
      nuevosItems = [
        ...orden.items,
        {
          product_id: producto.id,
          price_unit: producto.precio,
          quantity: 1,
          subtotal: producto.precio,
          product: {
            name: producto.nombre,
            sale_price: producto.precio,
          },
        },
      ];
    }

    const nuevaOrden = {
      ...orden,
      items: nuevosItems,
    };

    setOrden(nuevaOrden);
    console.log("Orden actualizada:", nuevaOrden);
  };

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <div className="row m-0">
        <List onAgregarProducto={agregarProducto} />
        <div className="col-md py-0 px-2">
          <OrderForm orden={orden} />
        </div>
      </div>
      <Sidebar />
      <MenuInferior />
    </div>
  );
}
