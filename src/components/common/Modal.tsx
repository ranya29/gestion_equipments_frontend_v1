import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, className, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      <div className="modal-backdrop fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="modal-content relative z-10">{children}</div>
    </div>
  );
};

export default Modal;
