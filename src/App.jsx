import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Users, ShoppingCart, DollarSign, Package, FileText, X, PlusCircle, Trash2, Edit, AlertTriangle, CheckCircle, Archive, Download, Menu } from 'lucide-react';
import { initializeFirebase, ensureAuth, APP_ID } from './firebase.js';
import { isFirebaseConfigValid } from './config/firebase.js';
import { formatCurrency } from './utils/helpers.js';
import { PrimaryButton, DangerButton, InputField, StatCard, Modal, ConfirmationModal, Toast } from './components/UI/index.jsx';

// Import Firebase functions
// import { 
//   collection, 
//   onSnapshot, 
//   query
// } from 'firebase/firestore';

// --- COMPONENTA PRINCIPALĂ A APLICAȚIEI ---
export default function App() {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [firebaseDb, setFirebaseDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    // const [customers, setCustomers] = useState([]);
    // const [products, setProducts] = useState([]);
    // const [rawOrders, setRawOrders] = useState([]);
    // const [payments, setPayments] = useState([]);
    // const [dayClosings, setDayClosings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    // const orders = useMemo(() => {
    //     return [...rawOrders].sort((a, b) => {
    //         const dateA = a.createdAt?.toDate() || 0;
    //         const dateB = b.createdAt?.toDate() || 0;
    //         return dateB - dateA;
    //     });
    // }, [rawOrders]);

    // Initialize Firebase
    useEffect(() => {
        // For development, allow app to work without Firebase
        if (!isFirebaseConfigValid()) {
            console.warn("Firebase config is missing. Running in demo mode.");
            setIsLoading(false);
            setIsAuthReady(true);
            return;
        }

        try {
            const { app, db: firestoreDb, auth: firebaseAuth } = initializeFirebase();
            if (app && firestoreDb && firebaseAuth) {
                setFirebaseDb(firestoreDb);
                setAuth(firebaseAuth);
            } else {
                console.warn("Failed to initialize Firebase. Running in demo mode.");
                setIsLoading(false);
                setIsAuthReady(true);
            }
        } catch (error) {
            console.error("Firebase initialization error:", error);
            console.warn("Running in demo mode without Firebase.");
            setIsLoading(false);
            setIsAuthReady(true);
        }
    }, [showToast]);

    // Handle authentication
    useEffect(() => {
        if (!auth) return;
        
        const handleAuth = async () => {
            try {
                const user = await ensureAuth();
                if (user) {
                    setUserId(user.uid);
                }
            } catch (error) {
                console.error("Auth error:", error);
                showToast("Authentication failed", "error");
            } finally {
                setIsAuthReady(true);
            }
        };

        handleAuth();
    }, [auth, showToast]);

    // Load data from Firestore
    useEffect(() => {
        if (!firebaseDb || !isAuthReady) return;
        
        setIsLoading(true);
        // const collections = {
        //     // customers: setCustomers,
        //     // products: setProducts,
        //     // orders: setRawOrders,
        //     // payments: setPayments,
        //     // dayClosings: setDayClosings
        // };

        // const unsubscribers = Object.entries(collections).map(([name, setter]) => {
        //     const q = query(collection(firebaseDb, `/artifacts/${APP_ID}/public/data/${name}`));
        //     return onSnapshot(q, 
        //         (snapshot) => {
        //             setter(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
        //             if (name === 'dayClosings') setIsLoading(false);
        //         },
        //         (error) => {
        //             console.error(`Error fetching ${name}:`, error);
        //             showToast(`Eroare la încărcarea datelor: ${name}`, 'error');
        //             setIsLoading(false);
        //         }
        //     );
        // });

        // return () => { unsubscribers.forEach(unsub => unsub()); };
        setIsLoading(false);
    }, [firebaseDb, isAuthReady, showToast]);

    const handleNewOrderClick = () => { setActiveModule('orders'); };

    const renderModule = () => {
        if (!isAuthReady || isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Se încarcă aplicația...</p>
                    </div>
                </div>
            );
        }
        
        switch (activeModule) {
            case 'dashboard':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panou de Bord</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Vânzări Astăzi" value={formatCurrency(0)} icon={<DollarSign className="text-white"/>} color="bg-green-500" />
                            <StatCard title="Total Datorii" value={formatCurrency(0)} icon={<Users className="text-white"/>} color="bg-red-500" />
                            <StatCard title="Comenzi Deschise" value={0} icon={<ShoppingCart className="text-white"/>} color="bg-yellow-500" />
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <PrimaryButton onClick={handleNewOrderClick}>+ Adaugă Comandă</PrimaryButton>
                            <button onClick={() => setActiveModule('payments')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600">Încasează</button>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Comenzi</h1>
                            <PrimaryButton onClick={() => {}}>+ Comandă Nouă</PrimaryButton>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișate comenzile. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Produse</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișate produsele. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            case 'customers':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Clienți</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișați clienții. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            case 'payments':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Încasări</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișate încasările. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Rapoarte</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișate rapoartele. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            case 'remaining_debts':
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Datorii Rămase</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aici vor fi afișate datoriile rămase. Pentru a funcționa complet, configurează Firebase.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">OrderFlow PWA</h1>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-gray-600">Aplicația OrderFlow PWA este gata! Configurează Firebase pentru funcționalitate completă.</p>
                        </div>
                    </div>
                );
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
        <div className="min-h-screen flex bg-gray-100 font-sans">
            {/* Mobile overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}

            {/* Sidebar - fixed width, not absolute */}
            <aside className={`w-64 shrink-0 bg-white shadow-md flex flex-col z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:relative`}>
                <div className="p-6 text-2xl font-bold text-blue-600 border-b">OrderFlow</div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setActiveModule(item.id); setIsSidebarOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${ activeModule === item.id ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}>
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-2 border-t text-center text-xs text-gray-500">
                    <p>User ID:</p>
                    <p className="font-mono break-all">{userId || 'N/A'}</p>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-bold text-blue-600">OrderFlow</span>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {!firebaseDb && (
                        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                            <p className="font-bold">Mod Demo</p>
                            <p className="text-sm">Aplicația rulează în mod demo. Pentru funcționalitate completă, configurează Firebase.</p>
                        </div>
                    )}
                    {renderModule()}
                </main>
            </div>

            {/* Toast notifications */}
            {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
        </div>
    );
}