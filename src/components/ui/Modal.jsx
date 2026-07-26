import { useEffect } from "react";

/**
 * Modal Component
 */

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-bold mb-4">{title}</h2>

        {children}

        <button
          className="mt-4 border px-4 py-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;