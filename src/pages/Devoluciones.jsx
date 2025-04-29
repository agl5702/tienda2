import TablaDevoluciones from "../components/TablaDevoluciones.jsx"
import Sidebar from "../components/Sidebar.jsx";
import { Link } from 'react-router-dom';
import React from 'react';
import Footer from "../components/Footer.jsx";

export default function Categorias() {
  return (
    <>

      <div className="m-0 padding-menu">

        <Sidebar />

        <div className="col p-2" style={{ minHeight: "100vh" }}>
            <div className="card p-2">
              <div className="row m-0">
                <h3 className="col my-auto">Devoluciones</h3>
                <div className="my-auto col-auto">
                  <Link to="/devolucion/nueva" className="btn bg-info text-white btn-sm my-2">nueva Devolución</Link>
                </div>
              </div>
                <TablaDevoluciones/>
            </div>
            <Footer/>

        </div>
        
      </div>
      
    </>
  );
}
  