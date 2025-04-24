import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import FormCategoria from './pages/FormCategoria';
import FormCliente from './pages/FormCliente';
import FormProducto from './pages/FormProducto';
import FormVentas from './pages/FormVentas';
import Deudas from './pages/Deudas';
import Clientes from './pages/Clientes';
import Devoluciones from './pages/Devoluciones';
import Users from './pages/Users';
import Reportes from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/nueva" element={<FormCategoria />} />
        <Route path="/categorias/editar/:id" element={<FormCategoria />} />
        
        
        <Route path="/productos" element={<Productos />} />
        <Route path="/form_producto" element={<FormProducto />} />
        <Route path="/productos/editar/:id" element={<FormProducto/>} />

        <Route path="/ventas" element={<Ventas />} />
        <Route path="/form_ventas/:id" element={<FormVentas />} />

        <Route path="/deudas" element={<Deudas />} />
        <Route path="/cliente/agregar/:id" element={<FormCliente />} />

        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cliente/nuevo" element={<FormCliente />} />
        <Route path="/cliente/editar/:id" element={<FormCliente />} />

        <Route path="/devoluciones" element={<Devoluciones />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
