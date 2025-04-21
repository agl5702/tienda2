import { Link } from 'react-router-dom';
import { FaClipboardList, FaShoppingCart} from 'react-icons/fa';
import { NavLink, useLocation } from "react-router-dom";
import "./css/MenuInferior.css"; // O tu archivo CSS general



 const MenuInferior = () => {
    const location = useLocation();


  return (

    <div className="col w-100 position-fixed bottom-0 end-0" style={{backgroundColor: "#1b1b1b", zIndex: "997"}}>
        <div className="" style={{ paddingLeft: "4.5rem",}}>
            <div className="d-flex table-responsive m-0 p-0">

                <NavLink to="/ventas" className={({ isActive }) => `col-2 col-md-1 carrito my-1 border-end border-1  ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 text-center">
                        <FaShoppingCart color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon "/>
                    </div>
                    </>
                    )}
                    
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>

                <NavLink to="/form_ventas"  className={({ isActive }) => `col-auto ventana my-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                    {({ isActive }) => (
                    <>
                    <div className="p-1 position-relative">
                        <div className='text-center' style={{ position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px", width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white", fontSize: "12px", borderRadius: "50%", cursor: "pointer", }}>
                        x
                        </div>
                        <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{fontSize:"17px"}}/>
                        <span className="text-white d-none d-sm-inline"> 200203</span>

                    </div>
                    </>
                    )}
                </NavLink>


                {/* ... */}
                <NavLink to="/form_ventas" className="col-auto text-center my-1 border-start border-1 position-sticky " style={{right: "0px", backgroundColor: "#1b1b1b"}}>
                    <div className=" pt-1 px-3 cursor-pointer">
                        <span className="text-white text-bold text-bold" style={{fontSize: "16px"}}>+</span>
                    </div>
                </NavLink>
                
            </div>
        </div>
    </div>

  );
}
export default MenuInferior;
