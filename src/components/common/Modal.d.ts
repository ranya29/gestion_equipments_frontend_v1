import { ReactNode, ReactElement } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

declare const Modal: ({ isOpen, onClose, children, className }: ModalProps) => ReactElement;

export default Modal;
