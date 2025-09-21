import React, { useState, useEffect } from "react";
import { BarChart, Users, ShoppingCart, DollarSign, Package, FileText, X, PlusCircle, Trash2, Edit, AlertTriangle, CheckCircle, Archive, Download, Menu } from "lucide-react";

// --- HELPERS ---
const formatCurrency = (amount) => {
    const numberAmount = typeof amount === "number" ? amount : parseFloat(amount || 0);
    if (isNaN(numberAmount)) {
        return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(0);
    }
    return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(numberAmount);
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getLocalStorageData = (key, defaultValue) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const setLocalStorageData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// --- COMPONENTE ---
const Toast = ({ message, type, onHide }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onHide();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onHide]);

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === "error" ? "bg-red-500 text-white" : 
            type === "success" ? "bg-green-500 text-white" : 
            "bg-blue-500 text-white"
        }`}>
            {message}
        </div>
    );
};

const App = () => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [dayClosings, setDayClosings] = useState([]);
    const [userId] = useState(() => {
        const id = localStorage.getItem("orderflow_user_id") || generateId();
        localStorage.setItem("orderflow_user_id", id);
        return id;
    });

    // --- FUNCȚII ---
    const showToast = (message, type = "info") => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // --- EFFECTS ---
    useEffect(() => {
        // Încarcă datele din localStorage
        setCustomers(getLocalStorageData("orderflow_customers", []));
        setProducts(getLocalStorageData("orderflow_products", []));
        setOrders(getLocalStorageData("orderflow_orders", []));
        setPayments(getLocalStorageData("orderflow_payments", []));
        setDayClosings(getLocalStorageData("orderflow_dayClosings", []));
        setIsLoading(false);
    }, []);

    // --- CALCULĂRI ---
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-white">Se încarcă aplicația...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">OrderFlow PWA</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-300">User ID: {userId}</span>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-gray-800 p-4">
                <div className="flex space-x-4">
                    {[
                        { id: "dashboard", label: "Panou de Bord", icon: BarChart },
                        { id: "orders", label: "Comenzi", icon: ShoppingCart },
                        { id: "customers", label: "Clienți", icon: Users },
                        { id: "products", label: "Produse", icon: Package },
                        { id: "payments", label: "Încasări", icon: DollarSign },
                        { id: "reports", label: "Rapoarte", icon: FileText }
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                activeTab === id 
                                    ? "bg-blue-600 text-white" 
                                    : "text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6">
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400">Total Comenzi</p>
                                    <p className="text-3xl font-bold">{totalOrders}</p>
                                </div>
                                <ShoppingCart className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400">Venituri Totale</p>
                                    <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-500" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400">Clienți</p>
                                    <p className="text-3xl font-bold">{totalCustomers}</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400">Produse</p>
                                    <p className="text-3xl font-bold">{totalProducts}</p>
                                </div>
                                <Package className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Comenzi</h2>
                        <p className="text-gray-400">Total comenzi: {totalOrders}</p>
                        <p className="text-gray-400">Venituri totale: {formatCurrency(totalRevenue)}</p>
                    </div>
                )}

                {activeTab === "customers" && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Clienți</h2>
                        <p className="text-gray-400">Total clienți: {totalCustomers}</p>
                    </div>
                )}

                {activeTab === "products" && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Produse</h2>
                        <p className="text-gray-400">Total produse: {totalProducts}</p>
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Încasări</h2>
                        <p className="text-gray-400">Venituri totale: {formatCurrency(totalRevenue)}</p>
                    </div>
                )}

                {activeTab === "reports" && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Rapoarte</h2>
                        <p className="text-gray-400">Rapoarte disponibile în curând...</p>
                    </div>
                )}
            </main>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={hideToast}
                />
            )}
        </div>
    );
};

export default App;
