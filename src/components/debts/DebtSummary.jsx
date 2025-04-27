import {
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartPie,
} from "react-icons/fa";

const DebtSummary = ({ customerId, debtors, customerName }) => {
  // Calcular el resumen basado en las deudas del cliente
  const calculateSummary = () => {
    const customerDebts = debtors.filter(
      (debtor) => debtor.customer_id === customerId
    );

    return customerDebts.reduce(
      (acc, debt) => {
        acc.totalDebt += parseFloat(debt.total_amount);
        acc.totalPaid += parseFloat(debt.paid_amount);
        acc.debtsCount += 1;
        return acc;
      },
      { totalDebt: 0, totalPaid: 0, debtsCount: 0 }
    );
  };

  const summary = calculateSummary();
  const pendingAmount = summary.totalDebt - summary.totalPaid;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">Resumen de Deudas - {customerName}</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card h-100 border-start border-4 border-primary">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">
                  <FaMoneyBillWave className="me-2" />
                  Total Deudas
                </h6>
                <h3 className="card-title">
                  ${summary.totalDebt.toLocaleString()}
                </h3>
                <small className="text-muted">
                  {summary.debtsCount}{" "}
                  {summary.debtsCount === 1 ? "deuda" : "deudas"}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 border-start border-4 border-success">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">
                  <FaMoneyBillWave className="me-2" />
                  Total Pagado
                </h6>
                <h3 className="card-title">
                  ${summary.totalPaid.toLocaleString()}
                </h3>
                <small className="text-muted">
                  {summary.totalDebt > 0
                    ? `${(
                        (summary.totalPaid / summary.totalDebt) *
                        100
                      ).toFixed(1)}% del total`
                    : "0% del total"}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 border-start border-4 border-danger">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">
                  <FaExclamationTriangle className="me-2" />
                  Saldo Pendiente
                </h6>
                <h3 className="card-title">
                  ${pendingAmount.toLocaleString()}
                </h3>
                <small className="text-muted">
                  {summary.totalDebt > 0
                    ? `${((pendingAmount / summary.totalDebt) * 100).toFixed(
                        1
                      )}% del total`
                    : "0% del total"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtSummary;
