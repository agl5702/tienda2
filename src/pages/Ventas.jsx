import Sidebar from "../components/Sidebar.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import { useEffect, useState } from "react";
import { getAllSales } from "../services/requests/sales.js";
import { getCustomerById } from "../services/requests/customers.js";
import { getProductById } from "../services/requests/products.js";

export default function About() {
  const [clientes, setClientes] = useState({});
  const [productos, setProductos] = useState({});
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await getAllSales();

        const clienteMap = {};
        const productoMap = {};

        // Recorremos todas las ventas
        for (const venta of data) {
          const clienteId = venta.customer_id;
          if (!clienteMap[clienteId]) {
            const cliente = await getCustomerById(clienteId);
            clienteMap[clienteId] = cliente;
          }

          // Recorremos los detalles de cada venta para obtener los productos
          for (const item of venta.details) {
            const productoId = item.product_id;
            if (!productoMap[productoId]) {
              const producto = await getProductById(productoId);
              productoMap[productoId] = producto;
            }
          }
        }

        setClientes(clienteMap);
        setProductos(productoMap);
        setVentas(data);
      } catch (error) {
        console.error("Error cargando ventas, clientes o productos:", error);
      }
    };

    fetchVentas();
  }, []);

  return (
    <>
      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
        <Sidebar />
        <MenuInferior />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid py-4">
            <h2 className="text-dark mb-4">Listado de Ventas</h2>

            {/* Contenedor para las facturas */}
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              {ventas.map((venta) => (
                <div
                  key={venta.id}
                  className="card shadow-sm"
                  style={{
                    width: "100%",
                    maxWidth: "500px", // Añadido para limitar el ancho
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div className="card-body" style={{ padding: "1rem" }}>
                    {/* Información de la factura */}
                    <div className="text-center mb-4">
                      <h5 className="card-title">Factura #{venta.id}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Cliente: {clientes[venta.customer_id]?.name || "Cargando..."}
                      </h6>
                    </div>

                    <div className="mb-3">
                      <p><strong>Fecha:</strong> {new Date(venta.date).toLocaleString()}</p>
                      <p><strong>Pago por Transferencia:</strong> ${venta.transfer_payment}</p>
                      <p><strong>Total:</strong> ${venta.total} <br />
                        <strong>Saldo:</strong> ${venta.balance}
                      </p>
                    </div>

                    {/* Detalles de la venta como tabla */}
                    <strong>Detalles:</strong>
                    <table className="table table-sm mt-2" style={{ fontSize: "0.875rem" }}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cant.</th>
                          <th>V.R.U</th>
                          <th>V.R.T</th>
                        </tr>
                      </thead>
                      <tbody>
                        {venta.details.map((item, idx) => (
                          <tr key={idx}>
                            <td>{productos[item.product_id]?.name || "Cargando..."}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price_unit}</td>
                            <td>${item.subtotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Total de la factura */}
                    <div className="mt-3 text-right">
                      <strong>Total: ${venta.total}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
