import "./css/Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaBoxOpen,
  FaUndoAlt,
  FaUserCog,
  FaUsers,
  FaChartBar,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaHome,
  FaShoppingCart,
} from "react-icons/fa";
import { RiShutDownLine } from "react-icons/ri";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth/logout.js";
import ModalLateral from "./ModalLateral.jsx";

const Sidebar = () => {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error al activar pantalla completa:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Error al salir de pantalla completa:", err);
        });
    }
  };

  const isCategoriaActive =
    location.pathname.startsWith("/categorias") ||
    location.pathname.startsWith("/form_categorias");
  const isProductosActive =
    location.pathname.startsWith("/productos") ||
    location.pathname.startsWith("/form_producto");
  const isVentasActive =
    location.pathname.startsWith("/ventas") ||
    location.pathname.startsWith("/form_ventas");
  const isReportesActive =
    location.pathname.startsWith("/reportes") ||
    location.pathname.startsWith("/reporte/");

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        // 1. Llama al endpoint de logout en tu API
        await logoutUser(token);

        // 2. Limpia el almacenamiento local
        localStorage.removeItem("token");
        localStorage.removeItem("userData");

        // 3. Muestra confirmación
        await Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // 4. Redirige al login y recarga
        navigate("/login");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire(
          "Error",
          "Hubo un problema al cerrar la sesión. Inténtalo nuevamente.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <ModalLateral />
      <div
        id="sidebar"
        className=" flex-column"
        style={{ backgroundColor: "#1b1b1b" }}
      >
        <NavLink to="/" className="border-bottom text-center mt-2 mb-1 pb-2">
          <img
            src="/logo_empresa.svg"
            alt="imglogo"
            style={{ width: "50px" }}
          />
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `my-1 p-1 text-center card-menu mx-2 ${
              isActive ? "active-link" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FaHome
                color={isActive ? "#00bfff" : ""}
                className="simbolo-icon"
              />
              <p className="pt-2 text-white text-menu">Home</p>
              <span className={isActive ? "selector" : "no-selector"}></span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/categorias"
          className={`my-1 p-1 text-center card-menu mx-2 ${
            isCategoriaActive ? "active-link" : ""
          }`}
        >
          <>
            <BiSolidCategoryAlt
              color={isCategoriaActive ? "#00bfff" : ""}
              className="simbolo-icon"
            />
            <p className="pt-2 text-white text-menu">Categorias</p>
            <span
              className={isCategoriaActive ? "selector" : "no-selector"}
            ></span>
          </>
        </NavLink>

        <NavLink
          to="/productos"
          className={`my-1 p-1 text-center card-menu mx-2 ${
            isProductosActive ? "active-link" : ""
          }`}
        >
          <>
            <FaBoxOpen
              color={isProductosActive ? "#00bfff" : ""}
              className="simbolo-icon"
            />
            <p className="pt-2 text-white text-menu">Productos</p>
            <span
              className={isProductosActive ? "selector" : "no-selector"}
            ></span>
          </>
        </NavLink>

        <NavLink
          to="/ventas"
          className={`my-1 p-1 text-center card-menu mx-2 ${
            isVentasActive ? "active-link" : ""
          }`}
        >
          <>
            <FaShoppingCart
              color={isVentasActive ? "#00bfff" : ""}
              className="simbolo-icon"
            />
            <p className="pt-2 text-white text-menu">Ventas</p>
            <span className="globo-pedidos">+</span>
            <span
              className={isVentasActive ? "selector" : "no-selector"}
            ></span>
          </>
        </NavLink>

        <NavLink
          to="/deudas"
          className={({ isActive }) =>
            `my-1 p-1 text-center card-menu mx-2 ${
              isActive ? "active-link" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FaMoneyBillWave
                color={isActive ? "#00bfff" : ""}
                className="simbolo-icon"
              />
              <p className="pt-2 text-white text-menu">Deudas</p>
              <span className={isActive ? "selector" : "no-selector"}></span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `my-1 p-1 text-center card-menu mx-2 position-relative ${
              isActive ? "active-link" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FaUsers
                color={isActive ? "#00bfff" : ""}
                className="simbolo-icon"
              />
              <p className="pt-2 text-white text-menu">Clientes</p>
              <span className={isActive ? "selector" : "no-selector"}></span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/devoluciones"
          className={({ isActive }) =>
            `my-1 p-1 text-center card-menu mx-2 ${
              isActive ? "active-link" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FaUndoAlt
                color={isActive ? "#00bfff" : ""}
                className="simbolo-icon"
              />
              <p className="pt-2 text-white text-menu">Devolucion</p>
              <span className={isActive ? "selector" : "no-selector"}></span>
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

        <NavLink
          to="/reportes"
          className={`my-1 p-1 text-center card-menu mx-2 ${
            isReportesActive ? "active-link" : ""
          }`}
        >
          <>
            <FaChartBar
              color={isReportesActive ? "#00bfff" : ""}
              className="simbolo-icon"
            />
            <p className="pt-2 text-white text-menu">Reportes</p>
            <span
              className={isReportesActive ? "selector" : "no-selector"}
            ></span>
          </>
        </NavLink>

        {/* Botón de pantalla completa */}
        <div className="my-1 p-1 text-center mt-auto card-menu mx-2">
          <button
            onClick={toggleFullscreen}
            className="btn btn-sm border m-0 px-2 ms-n1"
          >
            <MdFullscreen size={20} color="white" className="simbolo-icon" />
          </button>
        </div>

        <hr className="text-white bg-white mx-2 my-0" />

        <button
          className="my-1 p-1 text-center py-1 bg-info card-menu mx-2 "
          onClick={handleLogout}
        >
          <RiShutDownLine className="simbolo-icon" />
          <p className="pt-2 text-white text-menu">Cierre</p>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
