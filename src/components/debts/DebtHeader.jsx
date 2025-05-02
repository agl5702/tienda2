import {
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import StatsCard from "./StatsCard.jsx";

const DebtHeader = ({ stats }) => {
  return (
    <>
      <div className="row mb-4 mx-0">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header text-white">
              <h3 className="mb-n3 mt-n2">Resumen de Deudas</h3>
            </div>
            <div className="card-body px-3 mb-n4 mt-n4">
              <div className="row">
                <StatsCard
                  title="Total Deuda"
                  value={`$${stats?.total_debt?.toLocaleString() || "0"}`}
                  color="info"
                  icon={<FaMoneyBillWave size={24} color="white" />}
                />
                <StatsCard
                  title="Total Pagado"
                  value={`$${stats?.total_paid?.toLocaleString() || "0"}`}
                  color="dark"
                  icon={<FaCheckCircle size={24} color="white" />}
                />
                <StatsCard
                  title="Deudas Pendientes"
                  value={stats?.pending_debts || "0"}
                  color="info"
                  icon={<FaClock size={24} color="white" />}
                />
                <StatsCard
                  title="Deudas Pagadas"
                  value={stats?.paid_debts || "0"}
                  color="dark"
                  icon={<FaCheckCircle size={24} color="white" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DebtHeader;
