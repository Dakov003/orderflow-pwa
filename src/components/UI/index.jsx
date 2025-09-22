import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

// --- COMPONENTE UI REUTILIZABILE ---
export const PrimaryButton = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export const DangerButton = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200 ${className}`}
    >
        {children}
    </button>
);

export const InputField = ({ value, onChange, placeholder, type = 'text', name, step, ...rest }) => (
    <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        {...rest}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
);

export const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <X size={24} />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <p className="mb-6 text-gray-600">{message}</p>
                <div className="flex justify-center space-x-4 w-full">
                    <button onClick={onClose} className="py-2 px-4 rounded-lg border">Anulează</button>
                    <DangerButton onClick={onConfirm}>Confirmă</DangerButton>
                </div>
            </div>
        </Modal>
    );
};

export const Toast = ({ message, type, onHide }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onHide();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onHide]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor}`}>
            {message}
        </div>
    );
};
