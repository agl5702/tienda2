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
          <div className="container-fluid">
            <h3 className="text-dark text-center my-1">Panel de Inicio</h3>

            <div className="row">
              {/* Ventas Totales */}
              <div className="col-sm-6 col-lg-3 mb-4 ">
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
              <div className="col-sm-6 col-lg-3 mb-4 ">
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
              <div className="col-sm-6 col-lg-3 mb-4 ">
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
              <div className="col-sm-6 col-lg-3 mb-4 ">
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

            <div className="col ">
                <SalesDashboard />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
