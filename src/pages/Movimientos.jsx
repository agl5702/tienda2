

const BankStatement = () => {
  const transactions = [
    {
      date: '30 ABR 2025',
      type: 'SALDO',
      amount: 100000,
    },
    {
      date: '30 ABR 2025',
      type: 'SALDO',
      amount: 20000.00,
    },
    {
      date: '30 ABR 2025',
      type: 'SALDO',
      amount: 45000,
    },
    {
      date: '29 ABR 2025',
      type: 'ABONO',
      amount: -145000.00, // Assuming an amount since not specified

    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 20000);
  };

  return (
    <div className="card m-5 col-5 mx-auto">
      <div className="bg-dark card-header">
        <h4 className="text-white mb-0">Cuenta de Cliente</h4>
      </div>

      <div className='card-body'>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Resumen de cuenta</h5>
          <div className="balance-display">
            <span className="text-muted">Saldo disponible:</span>
            <h3 className="mb-0 text-success">{formatCurrency(calculateBalance())}</h3>
          </div>
        </div>
      </div>
      <div className="table-responsive mx-auto">
        <div hover className="table  mb-0">
        <thead>
            <tr>
            <th className="text-uppercase text-secondary text-md font-weight-bolder opacity-7 col-4">Fecha</th>
            <th className="text-uppercase text-secondary text-md font-weight-bolder opacity-7 col-4">Tipo de movimiento</th>
            <th className="text-uppercase text-secondary text-md font-weight-bolder opacity-7 col-4 text-end">Cantidad</th>
            </tr>
        </thead>
        <tbody>
            {transactions.map((transaction, index) => (
            <tr key={index}>
                <td>
                <span className="text-md font-weight-bold">{transaction.date}</span>
                </td>
                <td>
                <span className="text-md">{transaction.type}</span>
                </td>
                <td className="text-end">
                <span className={`text-md font-weight-bold ${transaction.type === 'SALDO' ? 'text-success' : 'text-danger'}`}>
                    {transaction.transactionType === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
                </td>
            </tr>
            ))}
        </tbody>
        </div>
      </div>

      <div className="bg-transparent text-center p-4">
        <div className="">
          <button className="btn-round btn bg-danger text-white">
            <i className="fas fa-plus me-2"></i>Nuevo Abono
          </button>
          <button className="btn-round ms-2 btn bg-success text-white">
            <i className="fas fa-minus me-2"></i>Nuevo SALDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankStatement;