import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/requests/products';
import { getAllCategories } from '../services/requests/categories';
import Sidebar from "../components/Sidebar.jsx";
import Swal from 'sweetalert2';


const FormProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id); // Verifica si estamos en modo edición

  const [producto, setProducto] = useState({
    name: '',
    image_url: '',
    category_id: '',
    unit: '',
    purchase_price: 0,
    profit_percentage: 0,
    sale_price: 0 // Para almacenar el precio de venta introducido
  });

  const [categorias, setCategorias] = useState([]);
  const unidades = ['UNIDAD', 'GRAMOS', 'KILOGRAMOS', 'MILILITROS', 'LITROS', 'METROS'];

  useEffect(() => {
    // Cargar las categorías disponibles

    getAllCategories().then(data => {
      const filtradas = data.filter(cat =>
        typeof cat.name === 'string' && cat.name.trim() !== ''
      );
      setCategorias(filtradas);
    });

    if (esEdicion) {
      // Obtener los datos del producto si estamos en modo edición
      getProductById(id).then(data => {
        setProducto({
          name: data.name,
          category_id: data.category.id,
          unit: data.unit,
          image_url: data.image_url || 'https://biblioteca.acropolis.org/wp-content/uploads/2014/12/azul.png', // Asegúrate de que la URL de la imagen esté definida
          purchase_price: data.purchase_price || 0,
          profit_percentage: data.profit_percentage || 0,
          sale_price: data.sale_price || 0, // Traer el precio de venta
        });
      }).catch(err => {
        console.error('Error al cargar producto', err);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProducto(prev => {
      if (name === 'purchase_price') {
        // Si el campo está vacío, lo establecemos en 0
        const purchase_price = value === '' ? '' : parseFloat(value);
        let sale_price = prev.sale_price;

        // Recalcular el precio de venta si hay un nuevo precio de compra
        if (purchase_price !== '') {
          sale_price = purchase_price * (1 + prev.profit_percentage / 100);
        }

        return {
          ...prev,
          [name]: purchase_price,
          sale_price: isNaN(sale_price) ? 0 : sale_price, // Asegurarse de que sale_price no sea NaN
        };
      }

      // Recalcular el precio de venta si el precio de venta cambia
      if (name === 'sale_price') {
        const sale_price = parseFloat(value);
        const purchase_price = parseFloat(prev.purchase_price);
        const profit_percentage = ((sale_price - purchase_price) / purchase_price) * 100;
        return {
          ...prev,
          [name]: sale_price,
          profit_percentage: isNaN(profit_percentage) ? 0 : profit_percentage,
        };
      }

      // Recalcular el porcentaje de ganancia si se cambia
      if (name === 'profit_percentage') {
        const profit_percentage = parseFloat(value);
        const purchase_price = parseFloat(prev.purchase_price);
        const sale_price = purchase_price * (1 + profit_percentage / 100);
        return {
          ...prev,
          [name]: profit_percentage,
          sale_price: isNaN(sale_price) ? 0 : sale_price,
        };
      }

      return {
        ...prev,
        [name]: name === 'purchase_price' || name === 'profit_percentage' ? parseFloat(value) || 0 : value
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoConPrecioVenta = {
      ...producto,
      state: true  // Agregar state como true
    };

    try {
      if (esEdicion) {
        // Si estamos en modo edición, actualiza el producto
        await updateProduct(id, productoConPrecioVenta);
      } else {
        // Si no, crea un nuevo producto
        await createProduct(productoConPrecioVenta);
      }
      navigate('/productos'); // Redirige a la lista de productos
    } catch (error) {
      console.error('Error al guardar producto', error);
    }
  };


    const abrirAlerta = () => {
      Swal.fire({
        title: 'Indicaciones!',
        showConfirmButton: false,
        showCancelButton: false,
        html: `
          <p>Dirigete a la pagina y selecciona la imagen a subir:</p><img class="w-50" src="/img/guia1.png" alt="guia1"><p>Espera que cargue la imagen y copia la URL que dice "Enlace directo"</p><img class="w-80" src="/img/guia3.png" alt="guia1"><p>luego vuelve y pega la URL copiada</p><a class="btn bg-info text-white" href="https://postimages.org/" target="_blank">ir a la pagina</a>
        `, // Aquí usas HTML
      });
    };

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <Sidebar />
      <div className="col p-2" style={{ minHeight: "100vh" }}>
        <div className="card p-3">
          <h2>{esEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="row m-0">
              <div className="col-md-6 mb-3">
              <label className="">Nombre</label>
              <input
                  type="text"
                  name="name"
                  value={producto.name}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
              <label className="">Categoría</label>
                <select
                  name="category_id"
                  value={producto.category_id}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
              <label className="">Unidad</label>
                <select
                  name="unit"
                  value={producto.unit}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                >
                  {unidades.map((u, i) => (
                    <option key={i} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
              <label className="">Precio de Compra</label>
                <input
                  type="number"
                  step="0.01"
                  name="purchase_price"
                  value={producto.purchase_price}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
              <label className="">% Ganancia</label>
                <input
                  type="number"
                  step="0.1"
                  name="profit_percentage"
                  value={producto.profit_percentage}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
              <label className="">Precio de Venta</label>
                <input
                  type="number"
                  step="0.01"
                  name="sale_price"
                  value={producto.sale_price}
                  onChange={handleChange}
                  className="form-control border ps-2"
                />
              </div>

              <div className="col-12 col-md-6 mx-auto mb-4">
                <label className="col-12">URL de Imagen</label> 
                <div className="row ">
                  <div className="col-9  my-auto">
                    <input type="url" className="form-control border ps-2" value={producto.image_url} onChange={handleChange} name="image_url" required=""/>
                  </div> 
                  <div className="col-3 my-auto">
                    <button type='button' onClick={abrirAlerta} className="btn btn-sm btn-outline-success">subir nueva</button>
                  </div>
                </div>
              </div>

            </div>

            <div className="text-center py-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/productos')}>
                Cancelar
              </button>
              <button type="submit" className="btn bg-info text-white ms-2">
                {esEdicion ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormProducto;
