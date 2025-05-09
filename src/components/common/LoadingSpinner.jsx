import Sidebar from "../Sidebar";
import MenuMovil from "../MenuMovil";
Sidebar;
const LoadingSpinner = () => (
  <div className="m-0 padding-menu">
    <Sidebar />
        <MenuMovil />
    <div className="col p-4" style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
