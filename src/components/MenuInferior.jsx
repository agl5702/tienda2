import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import { IoCartOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "./css/MenuInferior.css";
import { createOrder, getAllOrders, deleteOrder } from '../services/requests/orders';
import Swal from 'sweetalert2';


const MenuInferior = () => {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const registerOrders = async () => {
        try {
            const newOrder = {
                customer_id: 1,
                items: [
                    {
                        product_id: 7,
                        quantity: 1,
                        price_unit: 1
                    }
                ]
            };
            const createdOrder = await createOrder(newOrder);
            setOrders(prev => [...prev, createdOrder]);
            navigate(`/form_ventas/${createdOrder.id}`);
        } catch (error) {
            console.error('Error al crear la orden:', error);
        }
    };

    const handleDeleteOrder = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la orden. ¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteOrder(id);
                setOrders(prev => prev.filter(order => order.id !== id));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "La orden ha sido eliminada.",
                    showConfirmButton: false,
                    timer: 500
                  });
                  navigate(`/ventas`);
            } catch (error) {
                console.error('Error al eliminar la orden:', error);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "No se pudo eliminar la orden.",
                    showConfirmButton: false,
                    timer: 1000
                  });
            }
        }
    };

    const FechOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
        }
    };

    useEffect(() => {
        FechOrders(); // Solo obtenemos las órdenes al montar el componente
    }, []);

    return (
        <div className="col w-100 position-fixed bottom-0 end-0 py-1" style={{ backgroundColor: "#1b1b1b", zIndex: "997" }}>
            <div style={{ paddingLeft: "4.5rem" }}>
                <div className="d-flex table-responsive m-0 p-0">

                    <NavLink to="/ventas" className={({ isActive }) => `col-2 col-md-1 carrito py-1 border-end border-1 ${isActive ? 'active-link' : ''}`}>
                        {({ isActive }) => (
                            <div className="p-1 text-center">
                                <IoCartOutline color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon " />
                            </div>
                        )}
                    </NavLink>

                    {orders.length > 0 ? (
                        orders
                            .filter(order => order.status === "pending")
                            .map((order) => (
                                <NavLink key={order.id} to={`/form_ventas/${order.id}`} className={({ isActive }) => `col-auto ventana my-auto border-end py-1 border-1 ${isActive ? 'active-link' : ''}`}>
                                    {({ isActive }) => (
                                        <div className="p-1 position-relative">
                                            <div onClick={(e) => {
                                                e.preventDefault(); // Evita que el NavLink se dispare
                                                e.stopPropagation();
                                                handleDeleteOrder(order.id);
                                                }}
                                            className='text-center' 
                                            style={{
                                                position: "absolute", fontFamily: "sans-serif", top: "6px", right: "5px",
                                                width: "20px", height: "20px", backgroundColor: "#2d2d2d", color: "white",
                                                fontSize: "12px", borderRadius: "50%", cursor: "pointer"
                                            }}>x</div>
                                            <FaClipboardList color={isActive ? '#00bfff' : '#fff'} className="simbolo-icon mt-n1" style={{ fontSize: "17px" }} />
                                            <span className="text-white d-none d-sm-inline"> {order.id}</span>
                                        </div>
                                    )}
                                </NavLink>
                            ))
                    ) : (
                        <div className="d-none"></div>
                    )}

                    {/* BOTÓN "+" PARA CREAR NUEVA ORDEN */}
                    <button onClick={registerOrders} className="col-auto text-center border-start border-1 position-sticky" style={{ right: "0px", backgroundColor: "#1b1b1b", border: "none" }}>
                        <div className="border-radius-md bg-info px-3 py-1 cursor-pointer">
                            <span className="text-white text-bold" style={{ fontSize: "18px" }}>+</span>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default MenuInferior;
