import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import PdfReportDay from "../components/PdfReportDay.jsx";
import PdfReportDian from "../components/PdfReportDian.jsx";
import { FaBoxOpen, FaUsers, FaDollarSign, FaShoppingCart } from "react-icons/fa";
import DownloadButton from "../components/DownloadButton.jsx";
import TablaReportes from "../components/TablaReportes.jsx";
import Footer from "../components/Footer.jsx";

export default function Reportes() {
  // Obtener la fecha actual y formatearla
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const productos = [
    { nombre: 'Café', cantidad: 2, precio: 10 },
    { nombre: 'Pan', cantidad: 3, precio: 5 },
  ];
  
  return (
    <>

      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid py-4">

            <div className="card p-4">
              <TablaReportes/>
            </div>
            <Footer/>
            

          </div>
        </div>
        
      </div>
      
    </>
  );
}
  