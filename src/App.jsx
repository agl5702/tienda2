import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/router/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Categorias from "./pages/Categorias";
import FormCategoria from "./pages/FormCategoria";
import Productos from "./pages/Productos";
import FormProducto from "./pages/FormProducto";
import Ventas from "./pages/Ventas";
import VerFacturaPDF from "./pages/VerFacturaPDF";
import Deudas from "./pages/Deudas";
import Clientes from "./pages/Clientes";
import FormCliente from "./pages/FormCliente";
import Devoluciones from "./pages/Devoluciones";
import FormDevolucion from "./pages/FormDevolucion";
import Reportes from "./pages/Reportes";
import VerReporte from "./pages/VerReporte";
import DetalleDia from "./pages/DetalleDia";
import ModalLateral from "./components/ModalLateral";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/nueva" element={<FormCategoria />} />
          <Route path="/categorias/editar/:id" element={<FormCategoria />} />

          <Route path="/productos" element={<Productos />} />
          <Route path="/form_producto" element={<FormProducto />} />
          <Route path="/productos/editar/:id" element={<FormProducto />} />

          <Route path="/ventas" element={<Ventas />} />
          <Route path="/factura/:id" element={<VerFacturaPDF />} />

          <Route path="/deudas" element={<Deudas />} />

          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cliente/nuevo" element={<FormCliente />} />
          <Route path="/cliente/agregar/:id" element={<FormCliente />} />

          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/devolucion/nueva" element={<FormDevolucion />} />
          <Route path="/devolucion/editar/:id" element={<FormDevolucion />} />

          <Route path="/reportes" element={<Reportes />} />
          <Route path="/reportes/detalle/:date" element={<VerReporte />} />
          <Route path="/reportes/dia/:date" element={<DetalleDia />} />
        </Route>

        {/* Ruta de Not Found */}
        <Route path="*" element={<ModalLateral />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
