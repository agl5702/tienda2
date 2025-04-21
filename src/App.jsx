import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Productos from './pages/Productos';
import Categorias from "./pages/Categorias"
import FormProducto from './pages/FormProducto';
import FormVentas from './pages/FormVentas';
import Deudas from './pages/Deudas';
import Clientes from './pages/Clientes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/form_producto" element={<FormProducto />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/form_ventas/:id" element={<FormVentas />} />
        <Route path="/deudas" element={<Deudas />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
