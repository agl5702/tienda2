import TablaClientes from "../components/TablaClientes.jsx"
import Sidebar from "../components/Sidebar.jsx";
import MenuMovil from "../components/MenuMovil.jsx";
import { Link } from 'react-router-dom';
import React from 'react';
import Footer from "../components/Footer.jsx";


export default function Categorias() {
  return (
    <>

      <div className="m-0 padding-menu">

        <Sidebar />
        <MenuMovil />

        <div className="col p-2" style={{ minHeight: "100vh" }}>
            <div className="">
              <div className="row m-0">
                <h3 className="col my-auto">Clientes</h3>
                <div className="my-auto col-auto">
                  <Link to="/cliente/nuevo" className="btn bg-info text-white btn-sm my-2">nuevo clientes</Link>
                </div>
              </div>
                <TablaClientes/>
            </div>

            <Footer/>

        </div>
        
      </div>
      
    </>
  );
}
  