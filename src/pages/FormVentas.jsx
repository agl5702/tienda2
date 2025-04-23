import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import List from "../components/List.jsx";
import MenuInferior from "../components/MenuInferior.jsx";
import VentaForm from "../components/VentaForm.jsx";

export default function Ventas() {
  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <div className="row m-0">
        <List/>
        <div className="col-md py-0 px-2">
          
          <VentaForm/>
        </div>
      </div>

      <Sidebar />
      <MenuInferior />
    </div>
  );
}
