import TablaProductos from "../components/TablaProductos.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MenuMovil from "../components/MenuMovil.jsx";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Productos() {
  return (
    <>

      <div className="m-0 padding-menu">

        <Sidebar />
        <MenuMovil />

        <div className="col p-2" style={{ minHeight: "100vh" }}>
            <div className=" ">
              <div className="row m-0">
                <h3 className="col my-auto">Lista de Productos</h3>
                <div className="my-auto col-auto">
                  <Link to="/form_producto" className="btn bg-info text-white btn-sm my-2">nuevo producto</Link>
                </div>
              </div>
                <TablaProductos/>
            </div>

            <Footer/>

        </div>
        
      </div>
      
    </>
  );
}
  