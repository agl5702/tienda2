import Nav from "../components/Nav.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TablaReportes from "../components/TablaReportes.jsx";
import Footer from "../components/Footer.jsx";
import VerReporteRango from "../components/VerReporteRango.jsx";

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

      <div className="m-0 padding-menu">

        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid py-4">

            <div className="card p-4">
              <TablaReportes/>
            </div>

            <div className="card p-4 mt-3">
            <VerReporteRango/>
              
            </div>
            <Footer/>
            

          </div>
        </div>
        
      </div>
      
    </>
  );
}
  