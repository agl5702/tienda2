import DebtCard from "./DebtCard.jsx";

const DebtList = ({
  debtors,
  customers,
  formatDate,
  getCustomerName,
  onPaymentSuccess,
}) => {
  // Función para consolidar las deudas por cliente
  const consolidateDebtsByCustomer = () => {
    const consolidated = {};

    debtors.forEach((debtor) => {
      if (!consolidated[debtor.customer_id]) {
        consolidated[debtor.customer_id] = {
          id: debtor.customer_id, // Usamos el customer_id como ID para la key
          customer_id: debtor.customer_id,
          total_amount: 0,
          paid_amount: 0,
          status: "PAID", // Inicialmente asumimos que está pagado
          created_at: debtor.created_at,
          updated_at: debtor.updated_at,
          debtsCount: 0,
          debts: [], // Almacenamos las deudas individuales
        };
      }

      // Sumamos los montos
      consolidated[debtor.customer_id].total_amount += parseFloat(
        debtor.total_amount
      );
      consolidated[debtor.customer_id].paid_amount += parseFloat(
        debtor.paid_amount
      );
      consolidated[debtor.customer_id].debtsCount += 1;
      consolidated[debtor.customer_id].debts.push(debtor);

      // Si alguna deuda está pendiente, el estado general es PENDING
      if (debtor.status === "PENDING") {
        consolidated[debtor.customer_id].status = "PENDING";
      }

      // Actualizamos las fechas
      if (
        new Date(debtor.updated_at) >
        new Date(consolidated[debtor.customer_id].updated_at)
      ) {
        consolidated[debtor.customer_id].updated_at = debtor.updated_at;
      }
    });

    return Object.values(consolidated);
  };

  const consolidatedDebts = consolidateDebtsByCustomer();

  if (debtors.length === 0) {
    return (
      <div className="col-12">
        <div className="alert alert-info">No hay deudas registradas</div>
      </div>
    );
  }

  return (
    <div className="row">
      {consolidatedDebts.map((debtor) => (
        <DebtCard
          key={debtor.id}
          debtor={debtor}
          customerName={getCustomerName(debtor.customer_id)}
          formatDate={formatDate}
          onPaymentSuccess={onPaymentSuccess}
          isConsolidated={true}
        />
      ))}
    </div>
  );
};

export default DebtList;
