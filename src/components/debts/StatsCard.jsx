const StatsCard = ({ title, value, color = "primary", icon }) => {
  const colors = {
    dark: "bg-dark",
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
  };

  return (
    <div className="col-md-3 mb-4 p-2">
      <div className={`card ${colors[color]} shadow-sm`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0 text-white">{title}</h6>
              <h3 className="mb-0 text-white">{value}</h3>
            </div>
            {icon && (
              <div className="bg-opacity-25 p-3 text-success rounded-circle">
                {icon}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
