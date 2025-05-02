import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal modal-md fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()} // evitar cerrar al hacer clic dentro
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close bg-danger"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className={`modal-footer ${footer}`}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
