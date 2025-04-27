import Sidebar from "../Sidebar.jsx";

const ErrorMessage = ({ message }) => (
  <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
    <Sidebar />
    <div className="col p-4" style={{ minHeight: "100vh" }}>
      <div className="alert alert-danger">{message}</div>
    </div>
  </div>
);

export default ErrorMessage;
