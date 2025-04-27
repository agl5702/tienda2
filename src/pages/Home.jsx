import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SalesDashboard from "../components/Graphs.jsx";
import {
  FaBoxOpen,
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import { getAllSales } from "@/services/requests/sales";
import { getAllProducts } from "@/services/requests/products";
import { getAllOrders } from "@/services/requests/orders";
import { getAllCustomers } from "@/services/requests/customers";
import Footer from "../components/Footer.jsx";


export default function About() {
  const [salesCount, setSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [todayOrdersCount, setTodayOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const sales = await getAllSales();
        const validSales = sales.filter((sale) => sale.total > 0);
        const revenue = validSales.reduce((sum, sale) => sum + sale.total, 0);
        setSalesCount(validSales.length);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const products = await getAllProducts();
        const validProducts = products.filter(
          (product) =>
            product.name &&
            product.name.trim() !== "" &&
            product.sale_price &&
            product.sale_price > 0
        );
        setProductsCount(validProducts.length);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    const fetchTodayOrders = async () => {
      try {
        const orders = await getAllOrders();
        const today = new Date().toISOString().split("T")[0];

        const todaysOrders = orders.filter((order) => {
          if (
            !order.date ||
            !Array.isArray(order.items) ||
            order.items.length === 0
          )
            return false;
          const orderDate = new Date(order.date).toISOString().split("T")[0];
          return orderDate === today;
        });

        setTodayOrdersCount(todaysOrders.length);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    const fetchCustomersData = async () => {
      try {
        const customers = await getAllCustomers();
        const validCustomers = customers.filter(
          (customer) =>
            customer.name &&
            typeof customer.name === "string" &&
            customer.name.trim() !== ""
        );
        setCustomersCount(validCustomers.length);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchSalesData();
    fetchProductsData();
    fetchTodayOrders();
    fetchCustomersData();
  }, []);

  return (
    <>
      <div
        className="m-0"
        style={{ paddingLeft: "4.5rem", minHeight: "100vh" }}
      >
        <Sidebar />
        <div className="col" style={{ minHeight: "100vh" }}>
          <div className="container-fluid">
            <h3 className="text-dark text-center my-3">
              Panel de Inicio
              
            </h3>

            <div className="row">
              {/* Ventas Totales */}
              <div className="col-sm-6 col-lg-3 mb-4">
                <div
                  style={{ minHeight: "140px", maxHeight: "140px" }}
                  className="card shadow-sm border-0 bg-gradient-primary text-white equal-card"
                >
                  <div className="card-body d-flex align-items-center justify-content-between w-100">
                    <div>
                      <h6 className="mb-0 text-white">Ventas Totales</h6>
                      <h4 className="text-white">{salesCount}</h4>
                      <small>Total: ${totalRevenue.toLocaleString()}</small>
                    </div>
                    <FaDollarSign size={30} />
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="col-sm-6 col-lg-3 mb-4">
                <div
                  style={{ minHeight: "140px", maxHeight: "140px" }}
                  className="card shadow-sm border-0 bg-gradient-info text-white equal-card"
                >
                  <div className="card-body d-flex align-items-center justify-content-between w-100">
                    <div>
                      <h6 className="mb-0 text-white">Productos</h6>
                      <h4 className="text-white">{productsCount}</h4>
                    </div>
                    <FaBoxOpen size={30} />
                  </div>
                </div>
              </div>

              {/* Pedidos del día */}
              <div className="col-sm-6 col-lg-3 mb-4">
                <div
                  style={{ minHeight: "140px", maxHeight: "140px" }}
                  className="card shadow-sm border-0 bg-gradient-warning text-white equal-card"
                >
                  <div className="card-body d-flex align-items-center justify-content-between w-100">
                    <div>
                      <h6 className="mb-0 text-white">Pedidos hoy</h6>
                      <h4 className="text-white">{todayOrdersCount}</h4>
                    </div>
                    <FaShoppingCart size={30} />
                  </div>
                </div>
              </div>

              {/* Clientes */}
              <div className="col-sm-6 col-lg-3 mb-4">
                <div
                  style={{ minHeight: "140px", maxHeight: "140px" }}
                  className="card shadow-sm border-0 bg-gradient-success text-white equal-card"
                >
                  <div className="card-body d-flex align-items-center justify-content-between w-100">
                    <div>
                      <h6 className="mb-0 text-white">Clientes</h6>
                      <h4 className="text-white">{customersCount}</h4>
                    </div>
                    <FaUsers size={30} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <SalesDashboard />
            </div>
          </div>

          <Footer/>

        </div>
      </div>
    </>
  );
}
