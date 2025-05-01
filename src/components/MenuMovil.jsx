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
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
     
      const navigate = useNavigate();

      const handleLogout = () => {
        Swal.fire({
          title: '¿Cerrar sesión?',
          text: '¿Estás seguro de que deseas salir?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Vacía el token (sin eliminar el atributo)
            localStorage.setItem('token', ''); // Opción 1: Cadena vacía
            // localStorage.setItem('token', null); // Opción 2: Null
            navigate('/login');
            Swal.fire(
              'Sesión cerrada',
              'Has cerrado sesión correctamente.',
              'success'
            );
          }
        });
      };


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

                <div className="col-2 p-1 ventana2 text-center">
                    <button className={` mx-auto card-menu2 bg-info`} style={{ width: '60px' }} onClick={handleLogout}>
                        <RiShutDownLine className="simbolo-icon " />
                        <p className="text-white texto-menu mb-0 ">Cierre</p>
                    </button>
                </div>


              
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

      <div className="d-md-none p-1 position-fixed text-white text-center" style={{ borderRadius: '0.60rem', backgroundColor: '#1a1a1a', zIndex: 999, bottom: '69px', left: '5px',}}>
        <button onClick={toggleFullscreen} className="btn btn-sm border p-2 m-0">
          <MdFullscreen size={20} color="white" className="simbolo-icon" />
        </button>
      </div>
    </div>
  );
}
