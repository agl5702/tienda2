import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import SalesDashboard from "../components/Graphs.jsx";
import {
  FaBoxOpen,
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
export default function About() {
  return (
    <>
      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid py-4">
            <h2 className="text-dark mb-4">Panel de Inicio</h2>

            <div className="row">
              {/* Ventas Totales */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 bg-gradient-primary text-white">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-0 text-white">Ventas Totales</h6>
                      <h4 className="text-white">$25,430</h4>
                    </div>
                    <FaDollarSign size={30} />
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 bg-gradient-info text-white">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-0 text-white">Productos</h6>
                      <h4 className="text-white">124</h4>
                    </div>
                    <FaBoxOpen size={30} />
                  </div>
                </div>
              </div>

              {/* Pedidos del día */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 bg-gradient-warning text-white">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-0 text-white">Pedidos hoy</h6>
                      <h4 className="text-white">16</h4>
                    </div>
                    <FaShoppingCart size={30} />
                  </div>
                </div>
              </div>

              {/* Clientes */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 bg-gradient-success text-white">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-0 text-white">Clientes</h6>
                      <h4 className="text-white">85</h4>
                    </div>
                    <FaUsers size={30} />
                  </div>
                </div>
              </div>
            </div>

            <SalesDashboard />

            {/* Tabla o historial */}
            <div className="row">
              <div className="col-12">
                <div className="card bg-dark text-white border-0 shadow-sm">
                  <div className="card-header border-bottom">
                    <h5 className="mb-0 text-dark">Últimas ventas</h5>
                  </div>
                  <div className="table-responsive p-0">
                    <table className="table table-dark table-striped mb-0">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Producto</th>
                          <th>Fecha</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Juan Pérez</td>
                          <td>Smartphone</td>
                          <td>2025-04-17</td>
                          <td>$300</td>
                        </tr>
                        <tr>
                          <td>Ana Gómez</td>
                          <td>Laptop</td>
                          <td>2025-04-16</td>
                          <td>$850</td>
                        </tr>
                        <tr>
                          <td>Carlos Ruiz</td>
                          <td>Teclado</td>
                          <td>2025-04-15</td>
                          <td>$45</td>
                        </tr>
                        {/* Más registros si quieres... */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
