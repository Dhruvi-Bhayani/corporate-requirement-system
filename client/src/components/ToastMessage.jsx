import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ToastMessage({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      setTimeout(() => onClose(), 2000);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="toast show position-fixed top-0 end-0 m-4"
      role="alert"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-header bg-success text-white">
        <strong className="me-auto">Success</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
