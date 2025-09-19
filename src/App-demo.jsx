import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Users, ShoppingCart, DollarSign, Package, FileText, X, PlusCircle, Trash2, Edit, AlertTriangle, CheckCircle, Archive, Download, Menu } from 'lucide-react';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';

// --- HELPERS ---
const formatCurrency = (amount) => {
    const numberAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    if (isNaN(numberAmount)) {
        return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(0);
    }
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(numberAmount);
};

// --- COMPONENTE UI REUTILIZABILE ---
const PrimaryButton = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
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

const InputField = ({ value, onChange, placeholder, type = 'text', name, step, ...rest }) => (
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

// --- DATE MOCK PENTRU DEMONSTRAȚIE ---
const mockData = {
    customers: [
        { id: '1', name: 'Ion Popescu', phone: '0712345678', notes: 'Client fidel' },
        { id: '2', name: 'Maria Ionescu', phone: '0798765432', notes: 'Plătește la timp' },
        { id: '3', name: 'Gheorghe Vasile', phone: '0755555555', notes: 'Datorie veche' }
    ],
    products: [
        { id: '1', name: 'Cafea', price: 12.50 },
        { id: '2', name: 'Ceai', price: 8.00 },
        { id: '3', name: 'Sandwich', price: 25.00 },
        { id: '4', name: 'Paste', price: 18.00 }
    ],
    orders: [
        { 
            id: '1', 
            customerId: '1', 
            customerName: 'Ion Popescu', 
            items: [
                { productId: '1', name: 'Cafea', price: 12.50, quantity: 2 },
                { productId: '3', name: 'Sandwich', price: 25.00, quantity: 1 }
            ],
            totalAmount: 50.00,
            paidAmount: 30.00,
            status: 'Plătită Parțial',
            createdAt: { toDate: () => new Date('2024-01-15') }
        },
        { 
            id: '2', 
            customerId: '2', 
            customerName: 'Maria Ionescu', 
            items: [
                { productId: '2', name: 'Ceai', price: 8.00, quantity: 1 },
                { productId: '4', name: 'Paste', price: 18.00, quantity: 1 }
            ],
            totalAmount: 26.00,
            paidAmount: 26.00,
            status: 'Plătită Integral',
            createdAt: { toDate: () => new Date('2024-01-16') }
        }
    ],
    payments: [
        {
            id: '1',
            customerId: '1',
            customerName: 'Ion Popescu',
            amount: 30.00,
            createdAt: { toDate: () => new Date('2024-01-15') },
            settlementDetails: [
                { orderId: '1', amountSettled: 30.00 }
            ]
        }
    ],
    dayClosings: []
};

// --- COMPONENTE MODULE ---
const Dashboard = ({ orders, setActiveModule, onNewOrderClick, payments, dayClosings, showToast }) => {
    const { salesToday, totalDebt, openOrdersCount } = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const isDayClosed = dayClosings.some(closing => closing.closingDate?.toDate() >= todayStart);

        let totalDebtCalc = 0;
        orders.forEach(order => {
            if (order.status === 'Deschisă' || order.status === 'Plătită Parțial' || order.status === 'Transferată') {
                totalDebtCalc += order.totalAmount - (order.paidAmount || 0);
            }
        });

        if (isDayClosed) {
            return { salesToday: 0, totalDebt: totalDebtCalc, openOrdersCount: 0 };
        }

        let salesTodayCalc = 0;
        let openOrdersCountCalc = 0;

        orders.forEach(order => {
            if (order.createdAt?.toDate() >= todayStart) {
                if (order.status !== 'Stornată' && order.status !== 'Transferată') {
                    salesTodayCalc += order.totalAmount;
                }
                if (order.status === 'Deschisă' || order.status === 'Plătită Parțial') {
                    openOrdersCountCalc++;
                }
            }
        });

        return { salesToday: salesTodayCalc, totalDebt: totalDebtCalc, openOrdersCount: openOrdersCountCalc };
    }, [orders, dayClosings]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panou de Bord - DEMO</h1>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
                <p className="text-yellow-700 text-sm">Aplicația funcționează cu date mock pentru demonstrație.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Vânzări Astăzi" value={formatCurrency(salesToday)} icon={<DollarSign className="text-white"/>} color="bg-green-500" />
                <StatCard title="Total Datorii" value={formatCurrency(totalDebt)} icon={<Users className="text-white"/>} color="bg-red-500" />
                <StatCard title="Comenzi Deschise" value={openOrdersCount} icon={<ShoppingCart className="text-white"/>} color="bg-yellow-500" />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton onClick={onNewOrderClick}>+ Adaugă Comandă</PrimaryButton>
                <button onClick={() => setActiveModule('payments')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600">Încasează</button>
                <button onClick={() => showToast("Funcție disponibilă în versiunea completă", "error")} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-800">Închidere Zi</button>
            </div>
        </div>
    );
};

const Customers = ({ customers, showToast }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestiune Clienți - DEMO</h1>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Listă Clienți</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Nume / Identificator</th>
                                <th className="p-3 font-semibold">Telefon</th>
                                <th className="p-3 font-semibold">Notițe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{customer.name}</td>
                                    <td className="p-3">{customer.phone || '-'}</td>
                                    <td className="p-3">{customer.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Products = ({ products, showToast }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestiune Produse/Servicii - DEMO</h1>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Nomenclator Produse</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Denumire</th>
                                <th className="p-3 font-semibold text-right">Preț Unitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3 text-right font-mono">{formatCurrency(product.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Orders = ({ orders, setActiveModule, onNewOrderClick, customers, products, showToast }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Comenzi - DEMO</h1>
                <PrimaryButton onClick={onNewOrderClick}>+ Comandă Nouă</PrimaryButton>
            </div>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Istoric Comenzi</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Client</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Data</th>
                                <th className="p-3 font-semibold text-right">Total / Achitat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{order.customerName}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            order.status === 'Plătită Integral' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Plătită Parțial' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{order.createdAt?.toDate().toLocaleDateString('ro-RO')}</td>
                                    <td className="p-3 text-right font-mono">
                                        {formatCurrency(order.totalAmount)}
                                        <br/>
                                        <span className="text-green-600">({formatCurrency(order.paidAmount || 0)})</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Payments = ({ customers, orders, showToast }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Încasări și Plăți - DEMO</h1>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
                <p className="text-center text-gray-600">Funcția de încasări este disponibilă în versiunea completă cu Firebase.</p>
            </div>
        </div>
    );
};

const Reports = ({ orders, showToast }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Rapoarte - DEMO</h1>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 font-semibold">⚠️ Modul DEMO - Date simulate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Rapoarte Disponibile</h2>
                <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Registru Datorii</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Jurnal Vânzări</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Top Produse</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Top Clienți</span>
                    </li>
                </ul>
                <p className="mt-4 text-gray-600">Rapoartele sunt disponibile în versiunea completă cu Firebase.</p>
            </div>
        </div>
    );
};

const Toast = ({ message, type, onHide }) => {
    React.useEffect(() => {
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

// --- COMPONENTA PRINCIPALĂ A APLICAȚIEI ---
export default function App() {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [openNewOrder, setOpenNewOrder] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isInstallable, isInstalled, installApp } = usePWAInstall();

    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    const handleNewOrderClick = () => { 
        setActiveModule('orders'); 
        setOpenNewOrder(true);
        showToast("Funcția de comandă nouă este disponibilă în versiunea completă", "error");
    };

    const renderModule = () => {
        switch (activeModule) {
            case 'dashboard': return <Dashboard orders={mockData.orders} payments={mockData.payments} dayClosings={mockData.dayClosings} setActiveModule={setActiveModule} onNewOrderClick={handleNewOrderClick} showToast={showToast} />;
            case 'products': return <Products products={mockData.products} showToast={showToast} />;
            case 'customers': return <Customers customers={mockData.customers} showToast={showToast} />;
            case 'orders': return <Orders orders={mockData.orders} setActiveModule={setActiveModule} onNewOrderClick={handleNewOrderClick} customers={mockData.customers} products={mockData.products} showToast={showToast} />;
            case 'payments': return <Payments customers={mockData.customers} orders={mockData.orders} showToast={showToast} />;
            case 'remaining_debts': return <div><h1 className="text-3xl font-bold text-gray-800 mb-6">Datorii Rămase - DEMO</h1><p>Funcția este disponibilă în versiunea completă.</p></div>;
            case 'reports': return <Reports orders={mockData.orders} showToast={showToast} />;
            default: return <Dashboard orders={mockData.orders} payments={mockData.payments} dayClosings={mockData.dayClosings} setActiveModule={setActiveModule} onNewOrderClick={handleNewOrderClick} showToast={showToast} />;
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Panou de Bord', icon: <BarChart size={20} /> },
        { id: 'orders', label: 'Comenzi', icon: <ShoppingCart size={20} /> },
        { id: 'remaining_debts', label: 'Datorii Rămase', icon: <Archive size={20} /> },
        { id: 'products', label: 'Produse', icon: <Package size={20} /> },
        { id: 'customers', label: 'Clienți', icon: <Users size={20} /> },
        { id: 'payments', label: 'Încasări', icon: <DollarSign size={20} /> },
        { id: 'reports', label: 'Rapoarte', icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}

            <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="p-6 text-2xl font-bold text-blue-600 border-b">OrderFlow DEMO</div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setActiveModule(item.id); setIsSidebarOpen(false); }}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${ activeModule === item.id ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}>
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-2 border-t text-center text-xs text-gray-500">
                    <p>DEMO Mode</p>
                    <p className="font-mono break-all">Mock Data</p>
                    {isInstallable && !isInstalled && (
                        <button
                            onClick={installApp}
                            className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                        >
                            <Download size={16} className="mr-1" />
                            Instalează App
                        </button>
                    )}
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                 <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-bold text-blue-600">OrderFlow DEMO</span>
                    {isInstallable && !isInstalled && (
                        <button
                            onClick={installApp}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            <Download size={16} className="inline mr-1" />
                            Instalează
                        </button>
                    )}
                </header>
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {renderModule()}
                </main>
            </div>
            {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
            <InstallPrompt />
            <OfflineIndicator />
        </div>
    );
}
