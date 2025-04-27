import DebtCard from "./DebtCard.jsx";
import UserDebt from "./UserDebt.jsx";

const DebtList = ({
  debtors,
  customers,
  formatDate,
  getCustomerName,
  onPaymentSuccess,
}) => {
  if (debtors.length === 0) {
    return (
      <div className="col-12">
        <div className="alert alert-info">No hay deudas registradas</div>
      </div>
    );
  }

  return (
    <div className="row">
      {debtors.map((debtor) => (
        <DebtCard
          key={debtor.id}
          debtor={debtor}
          customerName={getCustomerName(debtor.customer_id)}
          formatDate={formatDate}
          onPaymentSuccess={onPaymentSuccess}
        />
      ))}
    </div>
  );
};

export default DebtList;
