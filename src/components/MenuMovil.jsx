import React from 'react';
import './css/BottomNav.css'; // Importa los estilos (ver más abajo)
import { NavLink, useLocation } from "react-router-dom";
import {
  FaMoneyBillWave, FaBoxOpen, FaUndoAlt, FaUserCog, FaUsers,
  FaChartBar, FaClipboardList, FaFileInvoiceDollar, FaHome,
  FaShoppingCart
} from 'react-icons/fa';
import { RiShutDownLine } from 'react-icons/ri';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FiSettings } from 'react-icons/fi';
import { MdFullscreen } from "react-icons/md";
import Visor from "./Visor.jsx";
import { useState } from "react";

export default function BottomNav() {
    const location = useLocation();
      const [isFullscreen, setIsFullscreen] = useState(false);
    
      const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().then(() => {
            setIsFullscreen(true);
          }).catch((err) => {
            console.error("Error al activar pantalla completa:", err);
          });
        } else {
          document.exitFullscreen().then(() => {
            setIsFullscreen(false);
          }).catch((err) => {
            console.error("Error al salir de pantalla completa:", err);
          });
        }
      };
    
      const isCategoriaActive = location.pathname.startsWith('/categorias') || location.pathname.startsWith('/form_categorias');
      const isProductosActive = location.pathname.startsWith('/productos') || location.pathname.startsWith('/form_producto');
      const isVentasActive = location.pathname.startsWith('/ventas') || location.pathname.startsWith('/form_ventas');
      const isReportesActive = location.pathname.startsWith('/reportes') || location.pathname.startsWith('/reporte/');
    
  return (
    <div className="">
      <div className="position-fixed p-0 bottom-1 d-md-none mb-n2" style={{ zIndex: 999, width: '100%' }}>
        <div className="container-fluid d-flex p-1">
            
            <div className="d-flex desplaceY py-1 px-1" style={{ borderRadius: '0.60rem', backgroundColor: '#1a1a1a', width: '100%' }}>

                <NavLink to="/" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaHome color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Home</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/categorias" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <BiSolidCategoryAlt color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Categorias</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/productos" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaBoxOpen color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Productos</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/deudas" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaMoneyBillWave color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Deudas</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/clientes" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaUsers color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Clientes</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/devoluciones" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaUndoAlt color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Devolucion</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/reportes" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FaChartBar color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Reportes</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>

                <NavLink to="/reportes" className={({ isActive }) => `col-2 p-1 ventana2 text-center ${isActive ? '' : ''}`}>
                    {({ isActive }) => (
                    <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                        <FiSettings color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Ajustes</p>
                        <span className={isActive ? 'selector2' : 'd-none'}></span>
                    </div>
                    )}
                </NavLink>


              
            </div>

            <div className="d-flex ps-1">
                <div className="d-flex p-0" style={{ borderRadius: '0.60rem', backgroundColor: '#1a1a1a', width: '100%' }}>
                    <NavLink to="/ventas" className={({ isActive }) => `col-2 px-2 my-auto ventana2 text-center ${isActive ? '' : ''}`}>
                        {({ isActive }) => (
                        <div className={` mx-auto card-menu2  ${isActive ? 'card-select2 ' : ''}`} style={{ width: '60px' }}>
                            <FaShoppingCart color={isActive ? '#00bfff' : ''} className="simbolo-icon " />
                            <p className="text-white texto-menu mb-0 ">Ventas</p>
                            <span className={isActive ? 'selector2' : 'd-none'}></span>
                        </div>
                        )}
                    </NavLink>
                </div>
            </div>
            

        </div>
      </div>
    </div>
  );
}
