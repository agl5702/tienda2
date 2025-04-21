import Sidebar from "../components/Sidebar.jsx";

export default function form_producto() {
  return (
    <>

      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
            <div className="card p-2">
                <div class=" my-4">
                <div class="card-header pb-0">
                    <h6>Agregar Producto</h6>
                </div>
                <div class="card-body">
                    <form>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label class="form-label">Nombre del Producto</label>
                        <input type="text" class="form-control" placeholder="Ej: Leche Entera" />
                        </div>

                        <div class="col-md-3 mb-3">
                        <label class="form-label">Cantidad</label>
                        <input type="number" class="form-control" placeholder="Ej: 10" />
                        </div>

                        <div class="col-md-3 mb-3">
                        <label class="form-label">Precio</label>
                        <input type="number" step="0.01" class="form-control" placeholder="Ej: 2.99" />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                        <label class="form-label">Unidad de Medida</label>
                        <select class="form-select">
                            <option value="">Seleccionar</option>
                            <option value="unidad">Unidad</option>
                            <option value="kg">Kilogramo</option>
                            <option value="l">Litro</option>
                        </select>
                        </div>

                        <div class="col-md-4 mb-3">
                        <label class="form-label">Gramaje</label>
                        <input type="text" class="form-control" placeholder="Ej: 500g" />
                        </div>

                        <div class="col-md-4 mb-3">
                        <label class="form-label">Categoría</label>
                        <select class="form-select">
                            <option value="">Seleccionar</option>
                            <option value="lacteos">Lácteos</option>
                            <option value="frutas">Frutas</option>
                            <option value="panaderia">Panadería</option>
                        </select>
                        </div>
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-primary">Guardar Producto</button>
                    </div>

                    </form>
                </div>
            </div>

            </div>
        </div>
        
      </div>
      
    </>
  );
}
  