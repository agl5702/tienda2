import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import PdfReportDay from "../components/PdfReportDay.jsx";
import PdfReportDian from "../components/PdfReportDian.jsx";
import DownloadButton from "../components/DownloadButton.jsx";
import { Link } from 'react-router-dom';


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

            <div className="row">
            <h3 className="text-dark text-center">Reporte del {fechaFormateada}</h3>
              <div className="col-6">
              <PdfReportDay/>
              </div>
              <div className="col-6">
              <PdfReportDian/>
              </div>

              <div className="col-6">
                <DownloadButton productos={productos}/>
                <Link to="/vista-pdf" className="btn ms-2 mb-0 bg-info text-sm text-white btn-sm">
                    VER
                    </Link>
              </div>
            </div>

          </div>
        </div>
        
      </div>
      
    </>
  );
}
  