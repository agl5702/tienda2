import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ventas from './pages/Ventas';
import Productos from './pages/Productos';
import FormProducto from './pages/FormProducto';
import FormVentas from './pages/FormVentas';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/form_producto" element={<FormProducto />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/form_ventas" element={<FormVentas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
