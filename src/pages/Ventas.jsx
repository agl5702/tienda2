import Sidebar from "../components/Sidebar.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import { useEffect, useState } from "react";
import { getAllSales } from "../services/requests/sales.js";
import { getCustomerById } from "../services/requests/customers.js";
import { getProductById } from "../services/requests/products.js";
import { FaCirclePlus } from "react-icons/fa6";

export default function About() {
  const [clientes, setClientes] = useState({});
  const [productos, setProductos] = useState({});
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasData = await getAllSales();
        
        // Cargar todos los clientes y productos en paralelo
        const clientesMap = {};
        const productosMap = {};
        
        const clientePromises = ventasData.map((venta) => 
          getCustomerById(venta.order.customer_id).then(cliente => {
            if (cliente) {
              clientesMap[venta.order.customer_id] = cliente;
            }
          })
        );

        const productoPromises = ventasData.flatMap((venta) =>
          venta.order.items.map((item) =>
            getProductById(item.product_id).then(producto => {
              if (producto) {
                productosMap[item.product_id] = producto;
              }
            })
          )
        );

        // Esperamos a que todos los clientes y productos estén cargados
        await Promise.all([...clientePromises, ...productoPromises]);

        // Una vez cargados los datos, actualizamos el estado
        setClientes(clientesMap);
        setProductos(productosMap);
        setVentas(ventasData);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
        <Sidebar />
        <MenuInferior />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid py-4">
            <button
              className="btn p-0 bg-transparent border-0 d-flex align-items-center justify-content-center"
              style={{ fontSize: "50px" }}
            >
              <FaCirclePlus color="green" />
            </button>
            <h3 className="text-dark mb-4 text-center">Listado de Ventas</h3>

            {/* Contenedor para las facturas */}
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
                  <div className="card-body" style={{ padding: "1rem" }}>
                    {/* Información de la factura */}
                    <div className="text-center mb-4">
                      <h5 className="card-title">Factura #{venta.id}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Cliente: {clientes[venta.order.customer_id]?.name || "Cargando..."}
                      </h6>
                    </div>

                    <div className="mb-3">
                      <p>
                        <strong>Fecha:</strong> {new Date(venta.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Pago por Transferencia:</strong> ${venta.transfer_payment}
                      </p>
                      <p>
                        <strong>Total:</strong> ${venta.total} <br />
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
                        {venta.order.items.map((item, idx) => (
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
