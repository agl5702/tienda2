import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { FaBoxOpen, FaUsers, FaDollarSign, FaShoppingCart } from "react-icons/fa";


export default function About() {
  return (
    <>

      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
        <div className="container-fluid py-4">
        <h2 className="text-dark mb-4">Deudas</h2>

        {/* Tabla o historial */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-dark text-white border-0 shadow-sm">
              <div className="card-header border-bottom">
                <h5 className="mb-0 text-dack">Tabla de deudas</h5>
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
  