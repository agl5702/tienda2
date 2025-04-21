import TablaCategorias from "../components/TablaCategorias.jsx"
import Sidebar from "../components/Sidebar.jsx";

export default function Categorias() {
  return (
    <>

      <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

        <Sidebar />

        <div className="col" style={{ minHeight: "100vh" }}>
            <div className="card p-2">
                <TablaCategorias/>
            </div>
        </div>
        
      </div>
      
    </>
  );
}
  