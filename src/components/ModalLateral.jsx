import React, { useState, useRef, useEffect } from 'react';
import '../components/css/SideModal.css';
import { IoMenu } from "react-icons/io5";
// imporaciones sidebar
import "./css/SidebarLateral.css";
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
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// fin de imporaciones de sidebar
const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Funciones de Sidebar

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
    <div>
      <button onClick={toggleMenu} className={`menu-button btn px-3 ${isOpen ? 'd-none' : ''}`} style={{ backgroundColor: "#1b1b1b" }}>
        {isOpen ? 'X' : <IoMenu size={30} color="white" className="simbolo-icon" />}
      </button>

      <div 
        ref={menuRef} 
        className={`side-menu ${isOpen ? 'open' : ''}`}
      >
        <div className="menu-content">

          {/* Sidebar */}
          
          <div className="sidebar d-flex flex-column" style={{ backgroundColor: "#1b1b1b" }}>
            <NavLink to="/" className="border-bottom text-center mt-2 mb-1 pb-2 position-sticky" style={{ backgroundColor: "#1b1b1b", zIndex: 1000, top: "0px" }}>  
              <img src="/logo_empresa.png" alt="imglogo" style={{ width: "50px" }} />
            </NavLink>

            <NavLink to="/" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
              {({ isActive }) => (
                <>
                  <FaHome color={isActive ? '#00bfff' : ''} className="simbolo-icon" />
                  <p className="pt-2 text-white text-menu">Home</p>
                  <span className={isActive ? 'selector' : 'no-selector'}></span>
                </>
              )}
            </NavLink>

            <NavLink to="/categorias" className={`my-1 p-1 text-center card-menu mx-2 ${isCategoriaActive ? 'active-link' : ''}`}>
              <>
                <BiSolidCategoryAlt color={isCategoriaActive ? '#00bfff' : ''} className="simbolo-icon" />
                <p className="pt-2 text-white text-menu">Categorias</p>
                <span className={isCategoriaActive ? 'selector' : 'no-selector'}></span>
              </>
            </NavLink>

            <NavLink to="/productos" className={`my-1 p-1 text-center card-menu mx-2 ${isProductosActive ? 'active-link' : ''}`}>
              <>
                <FaBoxOpen color={isProductosActive ? '#00bfff' : ''} className="simbolo-icon" />
                <p className="pt-2 text-white text-menu">Productos</p>
                <span className={isProductosActive ? 'selector' : 'no-selector'}></span>
              </>
            </NavLink>

            <NavLink to="/ventas" className={`my-1 p-1 text-center card-menu mx-2 ${isVentasActive ? 'active-link' : ''}`}>
              <>
                <FaShoppingCart color={isVentasActive ? '#00bfff' : ''} className="simbolo-icon" />
                <p className="pt-2 text-white text-menu">Ventas</p>
                <span className="globo-pedidos">2</span>
                <span className={isVentasActive ? 'selector' : 'no-selector'}></span>
              </>
            </NavLink>

            <NavLink to="/deudas" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
              {({ isActive }) => (
                <>
                  <FaMoneyBillWave color={isActive ? '#00bfff' : ''} className="simbolo-icon" />
                  <p className="pt-2 text-white text-menu">Deudas</p>
                  <span className={isActive ? 'selector' : 'no-selector'}></span>
                </>
              )}
            </NavLink>

            <NavLink to="/clientes" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 position-relative ${isActive ? 'active-link' : ''}`}>
              {({ isActive }) => (
                <>
                  <FaUsers color={isActive ? '#00bfff' : ''} className="simbolo-icon" />
                  <p className="pt-2 text-white text-menu">Clientes</p>
                  <span className={isActive ? 'selector' : 'no-selector'}></span>
                </>
              )}
            </NavLink>

            <NavLink to="/devoluciones" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
              {({ isActive }) => (
                <>
                  <FaUndoAlt color={isActive ? '#00bfff' : ''} className="simbolo-icon" />
                  <p className="pt-2 text-white text-menu">Devolucion</p>
                  <span className={isActive ? 'selector' : 'no-selector'}></span>
                </>
              )}
            </NavLink>

            {/* <NavLink to="/users" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
              {({ isActive }) => (
                <>
                  <FaUserCog color={isActive ? '#00bfff' : ''} className="simbolo-icon" />
                  <p className="pt-2 text-white text-menu">Users</p>
                  <span className={isActive ? 'selector' : 'no-selector'}></span>
                </>
              )}
            </NavLink> */}

            <NavLink to="/reportes" className={`my-1 p-1 text-center card-menu mx-2 ${isReportesActive ? 'active-link' : ''}`}>
              <>
                <FaChartBar color={isReportesActive ? '#00bfff' : ''} className="simbolo-icon" />
                <p className="pt-2 text-white text-menu">Reportes</p>
                <span className={isReportesActive ? 'selector' : 'no-selector'}></span>
              </>
            </NavLink>



            {/* Botón de pantalla completa */}
            <div className="my-1 p-1 text-center mt-auto card-menu mx-2">
              <button onClick={toggleFullscreen} className="btn btn-sm border m-0 ms-n1">
                <MdFullscreen size={20} color="white" className="simbolo-icon" />
              </button>
            </div>

            <hr className="text-white bg-white mx-2 my-0" />

            <button className="my-1 p-1 text-center py-1 bg-info card-menu mx-2 " onClick={handleLogout}>
              <RiShutDownLine className="simbolo-icon" />
              <p className="pt-2 text-white text-menu">Cierre</p>
            </button>
          </div>

          {/* Sidebar */}

        </div>
      </div>
      
      {/* Overlay que aparece cuando el menú está abierto */}
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} />
    </div>
  );
};

export default SideMenu;