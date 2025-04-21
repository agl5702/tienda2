// components/Sidebar.jsx
import "./css/Sidebar.css"; // O tu archivo CSS general
import { NavLink, useLocation } from "react-router-dom";
// Iconos de react-icons
import { FaMoneyBillWave, FaBoxOpen, FaUndoAlt, FaUserCog, FaUsers, FaChartBar, FaClipboardList, FaFileInvoiceDollar, FaHome, FaShoppingCart} from 'react-icons/fa';
import { RiShutDownLine } from 'react-icons/ri';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FiSettings } from 'react-icons/fi';
import Visor from "./Visor.jsx";


const Sidebar = () => {
  const location = useLocation();

  const isCategoriaActive = location.pathname.startsWith('/categorias') || 
                            location.pathname.startsWith('/form_categorias')
  ;

  const isProductosActive = location.pathname.startsWith('/productos') || 
                            location.pathname.startsWith('/form_producto')
  ;
  const isVentasActive = location.pathname.startsWith('/ventas') || 
                            location.pathname.startsWith('/form_ventas')
  ;

  return (
    <div id="sidebar" className="d-flex flex-column" style={{ backgroundColor: "#1b1b1b" }}>
      <NavLink to="/" className="border-bottom text-center mt-2 mb-1 pb-1">
        <img className="" src="/src/assets/react.svg" alt="imglogo" style={{ width: "30px" }} />
        <span className="text-white">Tienda</span>
      </NavLink>

      <NavLink to="/" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaHome color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Home</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <NavLink to="/categorias" className={`my-1 p-1 text-center card-menu mx-2 ${isProductosActive ? 'active-link' : ''}`}>
      <>  
      <BiSolidCategoryAlt color={isCategoriaActive ? '#00bfff' : ''} className="simbolo-icon "/>
        <p className="pt-2 text-white text-menu">Categorias</p>
        <span className={isCategoriaActive ? 'selector' : 'no-selector'}></span>
      </>
    </NavLink>


      <NavLink to="/productos" className={`my-1 p-1 text-center card-menu mx-2 ${isProductosActive ? 'active-link' : ''}`}>
      <>  
      <FaBoxOpen color={isProductosActive ? '#00bfff' : ''} className="simbolo-icon "/>
        <p className="pt-2 text-white text-menu">Productos</p>
        <span className={isProductosActive ? 'selector' : 'no-selector'}></span>
      </>
    </NavLink>

      <NavLink to="/ventas" className={`my-1 p-1 text-center card-menu mx-2 ${isVentasActive ? 'active-link' : ''}`}>
        <>
        <FaShoppingCart color={isVentasActive ? '#00bfff' : ''} className="simbolo-icon "/>
        <p className="pt-2 text-white text-menu">Ventas</p>
        <span className="globo-pedidos">2</span>
        <span className={isVentasActive ? 'selector' : 'no-selector'}></span>
        </>
      </NavLink>

      <NavLink to="/deudas" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaMoneyBillWave color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Deudas</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <NavLink to="/clientes" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 position-relative ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaUsers color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Clientes</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <NavLink to="/devoluciones" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaUndoAlt color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Devolucion</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <NavLink to="/users" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaUserCog color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Users</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <NavLink to="/reportes" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FaChartBar color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Reportes</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <div className="mx-auto">
        
        <Visor/>

      </div>

      <NavLink to="/ajustes" className={({ isActive }) => `my-1 p-1 text-center card-menu mx-2 mt-auto ${isActive ? 'active-link' : ''}`}>
        {({ isActive }) => (
            <>
            <FiSettings color={isActive ? '#00bfff' : ''} className="simbolo-icon "/>
            <p className="pt-2 text-white text-menu">Ajustes</p>
            <span className={isActive ? 'selector' : 'no-selector'}></span>
            </>
        )}
      </NavLink>

      <hr className="text-white bg-white mx-2 my-0" />

      <NavLink to="/cierre" className={({ isActive }) => `my-1 p-1 text-center py-1 card-menu mx-2 ${isActive ? 'active-link' : 'bg-info'}`}>
        <RiShutDownLine className="simbolo-icon "/>
        <p className="pt-2 text-white text-menu">Cierre</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
