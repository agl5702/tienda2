const DebtStatusBadge = ({ status }) => {
  return (
    <span
      className={`badge ${
        status === "PENDING" ? "bg-secondary" : "bg-success"
      } text-dark`}
    >
      {status === "PENDING" ? "Pendiente" : "Pagado"}
    </span>
  );
};

export default DebtStatusBadge;
