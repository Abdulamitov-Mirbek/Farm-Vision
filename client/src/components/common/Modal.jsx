import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Центрирование модального окна */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Модальное окно */}
        <div
          className={`inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Заголовок */}
          {(title || showCloseButton) && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900" id="modal-headline">
                    {title}
                  </h3>
                )}
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                    aria-label="Закрыть"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Содержимое */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Футер */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const ModalHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const ModalBody = ({ children, className = '', padding = true }) => (
  <div className={`${padding ? 'px-6 py-4' : ''} ${className}`}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
    <div className="flex justify-end space-x-3">
      {children}
    </div>
  </div>
);

// Вспомогательный хук для управления состоянием модального окна
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
};

export default Modal;