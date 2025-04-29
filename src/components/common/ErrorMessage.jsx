import Sidebar from "../Sidebar.jsx";

const ErrorMessage = ({ message }) => (
  <div className="m-0 padding-menu">
    <Sidebar />
        <MenuMovil />
    <div className="col p-4" style={{ minHeight: "100vh" }}>
      <div className="alert alert-danger">{message}</div>
    </div>
  </div>
);

export default ErrorMessage;
