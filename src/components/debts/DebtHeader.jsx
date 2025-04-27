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
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0 text-white">Resumen de Deudas</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <StatsCard
                  title="Total Deuda"
                  value={`$${stats?.total_debt?.toLocaleString() || "0"}`}
                  color="secondary"
                  icon={<FaMoneyBillWave size={24} />}
                />
                <StatsCard
                  title="Total Pagado"
                  value={`$${stats?.total_paid?.toLocaleString() || "0"}`}
                  color="dark"
                  icon={<FaCheckCircle size={24} />}
                />
                <StatsCard
                  title="Deudas Pendientes"
                  value={stats?.pending_debts || "0"}
                  color="secondary"
                  icon={<FaClock size={24} />}
                />
                <StatsCard
                  title="Deudas Pagadas"
                  value={stats?.paid_debts || "0"}
                  color="dark"
                  icon={<FaCheckCircle size={24} />}
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
