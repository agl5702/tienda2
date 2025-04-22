import TablaCategorias from "../components/TablaCategorias.jsx"
import Sidebar from "../components/Sidebar.jsx";
import { Link } from 'react-router-dom';
import React from 'react';

export default function Categorias() {
  return (
    <>

      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

        <Sidebar />

        <div className="col p-2" style={{ minHeight: "100vh" }}>
            <div className="card p-2">
              <div className="row m-0">
                <h2 className="col my-auto">Categorías</h2>
                <div className="my-auto col-auto">
                  <Link to="/categorias/nueva" className="btn bg-info text-white btn-sm my-2">nueva categoria</Link>
                </div>
              </div>
                <TablaCategorias/>
            </div>
        </div>
        
      </div>
      
    </>
  );
}
  