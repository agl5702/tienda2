// About.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import OrdersTable from "../components/TablaPedidos.jsx";
import { getAllSales } from "../services/requests/sales.js";
import { createOrder } from "../services/requests/orders";
import { FaCirclePlus } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function About() {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  const fetchVentas = async () => {
    try {
      const ventasData = await getAllSales();
      setVentas(ventasData);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const registerOrder = async () => {
    try {
      const newOrder = {
        customer_id: 2,
        items: [{ product_id: 4, quantity: 0, price_unit: 0 }],
      };
      const createdOrder = await createOrder(newOrder);
      navigate(`/form_ventas/${createdOrder.id}`);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      Swal.fire({ icon: "error", title: "No se pudo crear la orden" });
    }
  };

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <Sidebar />
      <MenuInferior />
      <div className="col" style={{ minHeight: "100vh" }}>
        <div className="container-fluid py-4">
          <button
            type="button"
            className="btn p-0 bg-transparent border-0 d-flex align-items-center justify-content-center mb-4"
            style={{ fontSize: "50px" }}
            onClick={registerOrder}
          >
            <FaCirclePlus className="text-info" />
          </button>
          <OrdersTable onSaleCreated={fetchVentas} />
          <h3 className="text-dark mb-4 text-center">Listado de Ventas</h3>
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            {ventas.map((venta) => (
              <div
                key={venta.id}
                className="card shadow-sm"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div className="card-body p-3">
                  <div className="text-center mb-3">
                    <h5 className="card-title">Factura #{venta.id}</h5>
                    <h6 className="card-subtitle text-muted">
                      Cliente: {venta.order.customer?.name || "—"}
                    </h6>
                  </div>
                  <div className="mb-3">
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(venta.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total:</strong> ${venta.total} <br />
                      <strong>Saldo:</strong> ${venta.balance}
                    </p>
                  </div>
                  <strong>Detalles:</strong>
                  <table className="table table-sm mt-2">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>V.R.U</th>
                        <th>V.R.T</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product?.name || item.product_id}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price_unit}</td>
                          <td>${item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-end">
                    <strong>Total: ${venta.total}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
