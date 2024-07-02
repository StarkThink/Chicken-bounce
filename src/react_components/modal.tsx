import React from 'react';
import './components.css';

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          {children}
        </div>
        <button className="close-button" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
