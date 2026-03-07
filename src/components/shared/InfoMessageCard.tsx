import React, { useEffect } from "react";

interface InfoMessageCardProps {
  message: string;
  isSuccess: boolean;
  onClose: () => void;
}

const icons = {
  success: (
    <span className="text-green-500 text-xl" role="img" aria-label="success">✅</span>
  ),
  error: (
    <span className="text-red-500 text-xl" role="img" aria-label="error">❌</span>
  ),
};

export const InfoMessageCard: React.FC<InfoMessageCardProps> = ({ message, isSuccess, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-6 py-4 bg-gray-50 text-gray-800 border-l-4 
        rounded-lg shadow-lg z-[9999] font-medium text-sm flex items-center gap-3 transition-all duration-300 animate-slideIn 
        ${
          isSuccess
          ? 'border-green-500 bg-green-50'
          : 'border-red-400 bg-red-50 animate-shake'
      }`}
      role="alert"
    >
      <span>{isSuccess ? icons.success : icons.error}</span>
      <span>{message}</span>
      <button
        className={`ml-auto bg-transparent border-none text-lg cursor-pointer flex items-center transition-colors duration-200 ${
          isSuccess ? 'text-green-500 hover:text-green-700' : 'text-red-400 hover:text-gray-800'
        }`}
        onClick={onClose}
        aria-label="Close notification"
        type="button"
      >
        ×
      </button>
    </div>
  );
};
