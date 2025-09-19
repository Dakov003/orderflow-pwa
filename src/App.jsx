import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Firebase imports - only loaded when needed
let initializeApp, getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged;
let getFirestore, collection, addDoc, onSnapshot, doc, setDoc, query, serverTimestamp, updateDoc, deleteDoc, writeBatch;

// Lazy load Firebase modules
const loadFirebaseModules = async () => {
    if (typeof window !== 'undefined' && !useLocalStorage) {
        try {
            const firebaseApp = await import('firebase/app');
            const firebaseAuth = await import('firebase/auth');
            const firebaseFirestore = await import('firebase/firestore');
            
            initializeApp = firebaseApp.initializeApp;
            getAuth = firebaseAuth.getAuth;
            signInAnonymously = firebaseAuth.signInAnonymously;
            signInWithCustomToken = firebaseAuth.signInWithCustomToken;
            onAuthStateChanged = firebaseAuth.onAuthStateChanged;
            
            getFirestore = firebaseFirestore.getFirestore;
            collection = firebaseFirestore.collection;
            addDoc = firebaseFirestore.addDoc;
            onSnapshot = firebaseFirestore.onSnapshot;
            doc = firebaseFirestore.doc;
            setDoc = firebaseFirestore.setDoc;
            query = firebaseFirestore.query;
            serverTimestamp = firebaseFirestore.serverTimestamp;
            updateDoc = firebaseFirestore.updateDoc;
            deleteDoc = firebaseFirestore.deleteDoc;
            writeBatch = firebaseFirestore.writeBatch;
        } catch (error) {
            console.warn('Firebase modules could not be loaded:', error);
        }
    }
};
import { BarChart, Users, ShoppingCart, DollarSign, Package, FileText, X, PlusCircle, Trash2, Edit, AlertTriangle, CheckCircle, Archive, Download, Menu } from 'lucide-react';
import { firebaseConfig } from './firebase-config.js';

// --- CONFIGURARE FIREBASE ---
// Use the imported Firebase config directly
const appId = 'order-flow-28c1b';

// Fallback pentru funcționare fără Firebase
const useLocalStorage = !firebaseConfig || Object.keys(firebaseConfig).length === 0;

// --- HELPERS ---
const formatCurrency = (amount) => {
    const numberAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    if (isNaN(numberAmount)) {
        return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(0);
    }
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(numberAmount);
};

// --- LOCAL STORAGE HELPERS ---
const getLocalStorageData = (key, defaultValue = []) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
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

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createTimestamp = () => {
    return { 
        toDate: () => new Date(),
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
    };
};

// Helper function to safely get date from timestamp (works with both Firebase and localStorage)
const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return new Date(0);
    if (typeof timestamp.toDate === 'function') {
        return timestampgetDateFromTimestamp();
    }
    if (timestamp instanceof Date) {
        return timestamp;
    }
    if (typeof timestamp === 'string') {
        return new Date(timestamp);
    }
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    return new Date(0);
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

const DangerButton = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200 ${className}`}
    >
        {children}
    </button>
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

const Modal = ({ isOpen, onClose, title, children }) => {
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
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

const Toast = ({ message, type, onHide }) => {
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

// --- COMPONENTĂ MODAL ÎNCHIDERE ZI ---
const CloseDayModal = ({ isOpen, onClose, orders, payments, db, showToast, setRawOrders, setDayClosings, dayClosings }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [confirmTransfer, setConfirmTransfer] = useState(false);

    const { dailyStats, openOrdersForTransfer } = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todaysOrders = orders.filter(o => getDateFromTimestamp(o.createdAt) >= todayStart);
        const openOrders = todaysOrders.filter(o => o.status === 'Deschisă' || o.status === 'Plătită Parțial');
        
        const todaysPayments = payments.filter(p => getDateFromTimestamp(p.createdAt) >= todayStart);

        let debtCollections = 0;
        let dailyCollections = 0;

        todaysPayments.forEach(payment => {
            if (payment.settlementDetails && payment.settlementDetails.length > 0) {
                payment.settlementDetails.forEach(detail => {
                    const settledOrder = orders.find(o => o.id === detail.orderId);
                    if (settledOrder) {
                        if (getDateFromTimestamp(settledOrder.createdAt) < todayStart) {
                            debtCollections += detail.amountSettled;
                        } else {
                            dailyCollections += detail.amountSettled;
                        }
                    } else {
                        dailyCollections += detail.amountSettled;
                    }
                });
            } else {
                dailyCollections += payment.amount;
            }
        });

        const totalCollections = debtCollections + dailyCollections;
        const expectedIncomeToday = todaysOrders
            .filter(o => o.status !== 'Stornată' && o.status !== 'Transferată')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const stats = {
            totalCollections,
            debtCollections,
            dailyCollections,
            expectedIncomeToday,
            orderCount: todaysOrders.length,
        };

        return { dailyStats: stats, openOrdersForTransfer: openOrders };
    }, [orders, payments]);

    const handleConfirmCloseDay = async () => {
        if (openOrdersForTransfer.length > 0 && !confirmTransfer) {
            showToast("Trebuie să confirmați transferul datoriilor.", "error");
            return;
        }
        setIsClosing(true);
        try {
            if (db.isLocalStorage) {
                const closingData = {
                    id: generateId(),
                    closingDate: createTimestamp(),
                    totalCollections: dailyStats.totalCollections,
                    debtCollections: dailyStats.debtCollections,
                    dailyCollections: dailyStats.dailyCollections,
                    expectedIncomeToday: dailyStats.expectedIncomeToday,
                    orderCount: dailyStats.orderCount,
                    transferredOrdersCount: openOrdersForTransfer.length
                };

                // Adaugă închiderea zilei
                const updatedDayClosings = [...dayClosings, closingData];
                setDayClosings(updatedDayClosings);
                setLocalStorageData('orderflow_dayClosings', updatedDayClosings);

                // Actualizează comenzile transferate
                const updatedOrders = orders.map(order => {
                    const transferOrder = openOrdersForTransfer.find(o => o.id === order.id);
                    if (transferOrder) {
                        return { ...order, status: 'Transferată' };
                    }
                    return order;
                });
                setRawOrders(updatedOrders);
                setLocalStorageData('orderflow_orders', updatedOrders);
            } else {
                // Logica Firebase originală
                const batch = writeBatch(db);

                const closingData = {
                    closingDate: serverTimestamp(),
                    totalCollections: dailyStats.totalCollections,
                    debtCollections: dailyStats.debtCollections,
                    dailyCollections: dailyStats.dailyCollections,
                    expectedIncomeToday: dailyStats.expectedIncomeToday,
                    orderCount: dailyStats.orderCount,
                    transferredOrdersCount: openOrdersForTransfer.length
                };
                const closingRef = doc(collection(db, `users/${userId}/dayClosings`));
                batch.set(closingRef, { ...closingData, ownerId: userId });

                openOrdersForTransfer.forEach(order => {
                    const orderRef = doc(db, `users/${userId}/orders`, order.id);
                    batch.update(orderRef, { status: 'Transferată' });
                });

                await batch.commit();
            }
            
            showToast("Ziua a fost închisă cu succes!", "success");
            onClose();
        } catch (error) {
            console.error("Eroare la închiderea zilei:", error);
            showToast("A apărut o eroare la salvarea raportului.", "error");
        } finally {
            setIsClosing(false);
            setConfirmTransfer(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Închidere Zi - ${new Date().toLocaleDateString('ro-RO')}`}>
            <div>
                <div className="p-4 bg-gray-100 rounded-lg space-y-2 mb-6">
                        <div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Valoare Comenzi Noi</span>
                                <span className="font-mono">{formatCurrency(dailyStats.expectedIncomeToday)}</span>
                            </div>
                            <p className="text-xs text-gray-500">(fără stornări/transferuri)</p>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Încasări Datorii Anterioare</span>
                            <span className="font-mono">{formatCurrency(dailyStats.debtCollections)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Încasări Comenzi Curente</span>
                            <span className="font-mono">{formatCurrency(dailyStats.dailyCollections)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2 text-green-600">
                            <span>Total Încasat Astăzi</span>
                            <span className="font-mono">{formatCurrency(dailyStats.totalCollections)}</span>
                        </div>
                </div>

                {openOrdersForTransfer.length > 0 && (
                    <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg">
                        <h4 className="font-bold mb-2">Există {openOrdersForTransfer.length} comandă/comenzi deschise:</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {openOrdersForTransfer.map(o => <li key={o.id}>{o.customerName} - Datorie: {formatCurrency(o.totalAmount - (o.paidAmount || 0))}</li>)}
                        </ul>
                        <div className="mt-4">
                            <label className="flex items-center">
                                <input type="checkbox" checked={confirmTransfer} onChange={() => setConfirmTransfer(!confirmTransfer)} className="h-4 w-4 rounded"/>
                                <span className="ml-2 font-semibold">Confirm transferul acestor datorii pe ziua următoare.</span>
                            </label>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end">
                    <PrimaryButton onClick={handleConfirmCloseDay} disabled={isClosing || (openOrdersForTransfer.length > 0 && !confirmTransfer)}>
                        {isClosing ? 'Se salvează...' : 'Confirmă Închiderea'}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

// --- MODULELE APLICAȚIEI ---

// 1. Panou de Bord (Dashboard)
const Dashboard = ({ orders, setActiveModule, onNewOrderClick, db, payments, dayClosings, showToast, setRawOrders, setDayClosings }) => {
    const [isCloseDayModalOpen, setCloseDayModalOpen] = useState(false);
    
    const { salesToday, totalDebt, openOrdersCount } = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const isDayClosed = dayClosings.some(closing => getDateFromTimestamp(closing.closingDate) >= todayStart);

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
            if (getDateFromTimestamp(order.createdAt) >= todayStart) {
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panou de Bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Vânzări Astăzi" value={formatCurrency(salesToday)} icon={<DollarSign className="text-white"/>} color="bg-green-500" />
                <StatCard title="Total Datorii" value={formatCurrency(totalDebt)} icon={<Users className="text-white"/>} color="bg-red-500" />
                <StatCard title="Comenzi Deschise" value={openOrdersCount} icon={<ShoppingCart className="text-white"/>} color="bg-yellow-500" />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton onClick={onNewOrderClick}>+ Adaugă Comandă</PrimaryButton>
                <button onClick={() => setActiveModule('payments')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600">Încasează</button>
                <button onClick={() => setCloseDayModalOpen(true)} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-800">Închidere Zi</button>
            </div>
            <CloseDayModal isOpen={isCloseDayModalOpen} onClose={() => setCloseDayModalOpen(false)} orders={orders} payments={payments} db={db} showToast={showToast} setRawOrders={setRawOrders} setDayClosings={setDayClosings} dayClosings={dayClosings} />
        </div>
    );
};

const Customers = ({ db, customers, isLoading, showToast, setCustomers }) => {
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', notes: '' });
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    
    const customersCollectionRef = !db.isLocalStorage ? collection(db, `users/${userId}/customers`) : null;

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (newCustomer.name.trim() === '') return;
        try {
            if (db.isLocalStorage) {
                const newCustomerData = { id: generateId(), ...newCustomer, createdAt: createTimestamp() };
                const updatedCustomers = [...customers, newCustomerData];
                setCustomers(updatedCustomers);
                setLocalStorageData('orderflow_customers', updatedCustomers);
            } else if (customersCollectionRef) {
                await addDoc(customersCollectionRef, { ...newCustomer, ownerId: userId });
            }
            setNewCustomer({ name: '', phone: '', notes: '' });
            showToast("Client adăugat cu succes!", "success");
        } catch (err) { console.error(err); showToast("Eroare la adăugarea clientului.", "error"); }
    };
    
    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        if (!editingCustomer || editingCustomer.name.trim() === '') return;
        try {
            if (db.isLocalStorage) {
                const updatedCustomers = customers.map(c => 
                    c.id === editingCustomer.id 
                        ? { ...c, name: editingCustomer.name, phone: editingCustomer.phone || '', notes: editingCustomer.notes || '' }
                        : c
                );
                setCustomers(updatedCustomers);
                setLocalStorageData('orderflow_customers', updatedCustomers);
            } else if (customersCollectionRef) {
                const customerRef = doc(db, `users/${userId}/customers`, editingCustomer.id);
                const dataToUpdate = {
                    name: editingCustomer.name,
                    phone: editingCustomer.phone || '',
                    notes: editingCustomer.notes || ''
                };
                await updateDoc(customerRef, dataToUpdate);
            }
            setEditingCustomer(null);
            showToast("Client actualizat cu succes!", "success");
        } catch (err) { console.error(err); showToast("Eroare la actualizarea clientului.", "error"); }
    };

    const handleDeleteCustomer = async () => {
        if (!customerToDelete) return;
        try {
            if (db.isLocalStorage) {
                const updatedCustomers = customers.filter(c => c.id !== customerToDelete.id);
                setCustomers(updatedCustomers);
                setLocalStorageData('orderflow_customers', updatedCustomers);
            } else if (customersCollectionRef) {
                const customerRef = doc(db, `users/${userId}/customers`, customerToDelete.id);
                await deleteDoc(customerRef);
            }
            setCustomerToDelete(null);
            showToast("Client șters cu succes!", "success");
        } catch(err) { console.error(err); showToast("Eroare la ștergerea clientului.", "error"); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };
    
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingCustomer(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestiune Clienți</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Adaugă Client Nou</h2>
                <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <InputField name="name" value={newCustomer.name} onChange={handleInputChange} placeholder="Nume / Identificator" />
                    <InputField name="phone" value={newCustomer.phone} onChange={handleInputChange} placeholder="Telefon (opțional)" />
                    <InputField name="notes" value={newCustomer.notes} onChange={handleInputChange} placeholder="Notițe (opțional)" />
                    <PrimaryButton type="submit" className="w-full md:w-auto md:col-span-3">Adaugă Client</PrimaryButton>
                </form>
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
                                <th className="p-3 font-semibold text-right">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan="4" className="p-3 text-center">Se încarcă...</td></tr>}
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{customer.name}</td>
                                    <td className="p-3">{customer.phone || '-'}</td>
                                    <td className="p-3">{customer.notes || '-'}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setEditingCustomer(customer)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18}/></button>
                                        <button onClick={() => setCustomerToDelete(customer)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            <Modal isOpen={!!editingCustomer} onClose={() => setEditingCustomer(null)} title="Editează Client">
                <form onSubmit={handleUpdateCustomer} className="space-y-4">
                    <InputField name="name" value={editingCustomer?.name || ''} onChange={handleEditInputChange} placeholder="Nume / Identificator" />
                    <InputField name="phone" value={editingCustomer?.phone || ''} onChange={handleEditInputChange} placeholder="Telefon (opțional)" />
                    <InputField name="notes" value={editingCustomer?.notes || ''} onChange={handleEditInputChange} placeholder="Notițe (opțional)" />
                    <PrimaryButton type="submit" className="w-full">Salvează Modificările</PrimaryButton>
                </form>
            </Modal>
            <ConfirmationModal 
                isOpen={!!customerToDelete}
                onClose={() => setCustomerToDelete(null)}
                onConfirm={handleDeleteCustomer}
                title="Confirmă Ștergerea"
                message={`Ești sigur că vrei să ștergi clientul "${customerToDelete?.name}"? Această acțiune este ireversibilă.`}
            />
        </div>
    );
};

const Products = ({ db, products, isLoading, showToast, setProducts }) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const productsCollectionRef = !db.isLocalStorage ? collection(db, `users/${userId}/products`) : null;

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const priceString = productPrice.replace(',', '.');
        const priceNumber = parseFloat(priceString);
        if (productName.trim() === '' || isNaN(priceNumber) || priceNumber <= 0) return;
        try {
            if (db.isLocalStorage) {
                const newProductData = { id: generateId(), name: productName, price: priceNumber, createdAt: createTimestamp() };
                const updatedProducts = [...products, newProductData];
                setProducts(updatedProducts);
                setLocalStorageData('orderflow_products', updatedProducts);
            } else if (productsCollectionRef) {
                await addDoc(productsCollectionRef, { name: productName, price: priceNumber, ownerId: userId });
            }
            setProductName('');
            setProductPrice('');
            showToast("Produs adăugat cu succes!", "success");
        } catch (err) { console.error(err); showToast("Eroare la adăugarea produsului.", "error"); }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        const priceString = String(editingProduct.price).replace(',', '.');
        const priceNumber = parseFloat(priceString);
        if (editingProduct.name.trim() === '' || isNaN(priceNumber) || priceNumber <= 0) return;
        
        try {
            if (db.isLocalStorage) {
                const updatedProducts = products.map(p => 
                    p.id === editingProduct.id 
                        ? { ...p, name: editingProduct.name, price: priceNumber }
                        : p
                );
                setProducts(updatedProducts);
                setLocalStorageData('orderflow_products', updatedProducts);
            } else if (productsCollectionRef) {
                const productRef = doc(db, `users/${userId}/products`, editingProduct.id);
                await updateDoc(productRef, { name: editingProduct.name, price: priceNumber });
            }
            setEditingProduct(null);
            showToast("Produs actualizat cu succes!", "success");
        } catch (err) { console.error(err); showToast("Eroare la actualizarea produsului.", "error"); }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            if (db.isLocalStorage) {
                const updatedProducts = products.filter(p => p.id !== productToDelete.id);
                setProducts(updatedProducts);
                setLocalStorageData('orderflow_products', updatedProducts);
            } else if (productsCollectionRef) {
                const productRef = doc(db, `users/${userId}/products`, productToDelete.id);
                await deleteDoc(productRef);
            }
            setProductToDelete(null);
            showToast("Produs șters cu succes!", "success");
        } catch(err) { console.error(err); showToast("Eroare la ștergerea produsului.", "error"); }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestiune Produse/Servicii</h1>
             <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Adaugă Produs Nou</h2>
                <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4">
                    <InputField value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Denumire produs (ex: Cafea)" />
                    <InputField value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Preț unitar (ex: 12.5)" type="text" inputMode="decimal" />
                    <PrimaryButton type="submit" className="w-full md:w-auto">Adaugă</PrimaryButton>
                </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Nomenclator Produse</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Denumire</th>
                                <th className="p-3 font-semibold text-right">Preț Unitar</th>
                                <th className="p-3 font-semibold text-right">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan="3" className="p-3 text-center">Se încarcă...</td></tr>}
                            {products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3 text-right font-mono">{formatCurrency(product.price)}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18}/></button>
                                        <button onClick={() => setProductToDelete(product)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title="Editează Produs">
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                    <InputField name="name" value={editingProduct?.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Denumire produs" />
                    <InputField name="price" value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Preț" type="text" inputMode="decimal" />
                    <PrimaryButton type="submit" className="w-full">Salvează Modificările</PrimaryButton>
                </form>
            </Modal>
            <ConfirmationModal 
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title="Confirmă Ștergerea"
                message={`Ești sigur că vrei să ștergi produsul "${productToDelete?.name}"?`}
            />
        </div>
    );
};
const Orders = ({ db, openNewOrder, setOpenNewOrder, customers, products, orders, isLoading, showToast, setCustomers, setRawOrders, rawOrders }) => {
    const [newOrderItems, setNewOrderItems] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderToStorno, setOrderToStorno] = useState(null);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [previousDebt, setPreviousDebt] = useState(0);
    const [customerSearchView, setCustomerSearchView] = useState('');
    const [selectedCustomerForView, setSelectedCustomerForView] = useState(null);

    const ordersCollectionRef = !db.isLocalStorage ? collection(db, `users/${userId}/orders`) : null;
    const customersCollectionRef = !db.isLocalStorage ? collection(db, `users/${userId}/customers`) : null;

    useEffect(() => {
        if (selectedCustomer) {
            const openOrder = orders.find(o => o.customerId === selectedCustomer.id && (o.status === 'Deschisă' || o.status === 'Plătită Parțial' || o.status === 'Transferată'));
            setOrderToUpdate(openOrder || null);
            setPreviousDebt(openOrder ? (openOrder.totalAmount - (openOrder.paidAmount || 0)) : 0);
        } else {
            setOrderToUpdate(null);
            setPreviousDebt(0);
        }
    }, [selectedCustomer, orders]);

    const resetNewOrderForm = () => {
        setNewOrderItems([]); 
        setCustomerSearch(''); 
        setSelectedCustomer(null); 
        setProductSearch('');
    };
    
    const handleCloseModal = () => { setOpenNewOrder(false); resetNewOrderForm(); };

    const handleAddProductToOrder = (product) => {
        setNewOrderItems(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const handleRemoveItemFromOrder = (productIdToRemove) => {
        setNewOrderItems(prev => {
            const existingItem = prev.find(item => item.productId === productIdToRemove);
            if (existingItem.quantity > 1) {
                return prev.map(item => 
                    item.productId === productIdToRemove 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
                );
            } else {
                return prev.filter(item => item.productId !== productIdToRemove);
            }
        });
    };
    
    const handleCreateCustomer = async () => {
        if (customerSearch.trim() === '') return;
        try {
            if (db.isLocalStorage) {
                const newCustomerData = { id: generateId(), name: customerSearch.trim(), createdAt: createTimestamp() };
                const updatedCustomers = [...customers, newCustomerData];
                setCustomers(updatedCustomers);
                setLocalStorageData('orderflow_customers', updatedCustomers);
                setSelectedCustomer({ id: newCustomerData.id, name: newCustomerData.name });
            } else if (customersCollectionRef) {
                const newCustomerRef = await addDoc(customersCollectionRef, { name: customerSearch.trim() });
                setSelectedCustomer({ id: newCustomerRef.id, name: customerSearch.trim() });
            }
            setCustomerSearch(customerSearch.trim());
        } catch (error) { console.error(error); }
    };
    
    const handleSaveOrder = async () => {
        if (!selectedCustomer || newOrderItems.length === 0) return;

        try {
            if (db.isLocalStorage) {
                if (orderToUpdate) {
                    const updatedItems = [...orderToUpdate.items];
                    const itemMap = new Map(updatedItems.map(item => [item.productId, item]));

                    newOrderItems.forEach(newItem => {
                        if (itemMap.has(newItem.productId)) {
                            itemMap.get(newItem.productId).quantity += newItem.quantity;
                        } else {
                            updatedItems.push(newItem);
                        }
                    });

                    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const preserveOrReopen = orderToUpdate.status === 'Plătită Integral' ? 'Deschisă' : orderToUpdate.status;

                    const updatedOrders = rawOrders.map(order => 
                        order.id === orderToUpdate.id 
                            ? { ...order, items: updatedItems, totalAmount: newTotalAmount, status: preserveOrReopen }
                            : order
                    );
                    setRawOrders(updatedOrders);
                    setLocalStorageData('orderflow_orders', updatedOrders);
                    showToast("Comanda a fost actualizată!", "success");
                } else {
                    const totalAmount = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const newOrderData = {
                        id: generateId(),
                        customerId: selectedCustomer.id, 
                        customerName: selectedCustomer.name, 
                        items: newOrderItems,
                        totalAmount, 
                        paidAmount: 0, 
                        status: 'Deschisă', 
                        createdAt: createTimestamp()
                    };
                    const updatedOrders = [...rawOrders, newOrderData];
                    setRawOrders(updatedOrders);
                    setLocalStorageData('orderflow_orders', updatedOrders);
                    showToast("Comandă nouă salvată!", "success");
                }
            } else {
                // Logica Firebase originală
                if (orderToUpdate) {
                    const updatedItems = [...orderToUpdate.items];
                    const itemMap = new Map(updatedItems.map(item => [item.productId, item]));

                    newOrderItems.forEach(newItem => {
                        if (itemMap.has(newItem.productId)) {
                            itemMap.get(newItem.productId).quantity += newItem.quantity;
                        } else {
                            updatedItems.push(newItem);
                        }
                    });

                    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const orderRef = doc(db, `users/${userId}/orders`, orderToUpdate.id);
                    
                    const preserveOrReopen = orderToUpdate.status === 'Plătită Integral' ? 'Deschisă' : orderToUpdate.status;

                    await updateDoc(orderRef, { 
                        items: updatedItems, 
                        totalAmount: newTotalAmount, 
                        status: preserveOrReopen 
                    });
                    showToast("Comanda a fost actualizată!", "success");
                } else if (ordersCollectionRef) {
                    const totalAmount = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    await addDoc(ordersCollectionRef, {
                        customerId: selectedCustomer.id, customerName: selectedCustomer.name, items: newOrderItems,
                        totalAmount, paidAmount: 0, status: 'Deschisă', createdAt: serverTimestamp(), ownerId: userId
                    });
                    showToast("Comandă nouă salvată!", "success");
                }
            }
        } catch (error) { 
            console.error("Eroare la salvarea comenzii:", error); 
            showToast("Eroare la salvarea comenzii.", "error"); 
        }
        
        handleCloseModal();
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;
        // Permite ștergerea comenzilor stornate indiferent de paidAmount
        if ((orderToDelete.paidAmount || 0) > 0 && orderToDelete.status !== 'Stornată') {
            showToast("Nu puteți șterge o comandă cu plăți asociate. Stornați comanda.", "error");
            setOrderToDelete(null);
            return;
        }
        try {
            if (db.isLocalStorage) {
                const updatedOrders = rawOrders.filter(order => order.id !== orderToDelete.id);
                setRawOrders(updatedOrders);
                setLocalStorageData('orderflow_orders', updatedOrders);
            } else if (ordersCollectionRef) {
                await deleteDoc(doc(db, `users/${userId}/orders`, orderToDelete.id));
            }
            setOrderToDelete(null);
            showToast("Comanda a fost ștearsă.", "success");
        } catch(err) { console.error(err); showToast("Eroare la ștergerea comenzii.", "error"); }
    };

    const handleStornoOrder = async () => {
        if (!orderToStorno) return;
        try {
            if (db.isLocalStorage) {
                const updatedOrders = rawOrders.map(order => 
                    order.id === orderToStorno.id 
                        ? { ...order, status: 'Stornată' }
                        : order
                );
                setRawOrders(updatedOrders);
                setLocalStorageData('orderflow_orders', updatedOrders);
            } else if (ordersCollectionRef) {
                await updateDoc(doc(db, `users/${userId}/orders`, orderToStorno.id), {
                    status: 'Stornată'
                });
            }
            setOrderToStorno(null);
            showToast("Comanda a fost stornată.", "success");
        } catch(err) { console.error(err); showToast("Eroare la stornarea comenzii.", "error"); }
    };

    const filteredCustomers = useMemo(() => 
        customerSearch ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())) : [],
    [customers, customerSearch]);

    const filteredProducts = useMemo(() => 
        productSearch ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())) : products,
    [products, productSearch]);
    
    const filteredCustomersForView = useMemo(() => 
        customerSearchView ? customers.filter(c => c.name.toLowerCase().includes(customerSearchView.toLowerCase())) : [],
    [customers, customerSearchView]);

    const filteredOrders = useMemo(() => {
        if (!selectedCustomerForView) return orders;
        return orders.filter(o => o.customerId === selectedCustomerForView.id);
    }, [orders, selectedCustomerForView]);

    const newItemsTotal = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = newItemsTotal + previousDebt;
    const isSaveDisabled = !selectedCustomer || newOrderItems.length === 0;
    const modalTitle = orderToUpdate ? "Adaugă la Comanda Existentă" : "Creează Comandă Nouă";

    const StatusBadge = ({ status }) => {
        const colors = {
            'Deschisă': 'bg-yellow-100 text-yellow-800',
            'Plătită Parțial': 'bg-blue-100 text-blue-800',
            'Plătită Integral': 'bg-green-100 text-green-800',
            'Stornată': 'bg-gray-100 text-gray-800 line-through',
            'Transferată': 'bg-purple-100 text-purple-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Comenzi</h1>
                <PrimaryButton onClick={() => setOpenNewOrder(true)}>+ Comandă Nouă</PrimaryButton>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-4 relative">
                    <label className="font-semibold text-gray-700 block mb-2">Filtrează după Client</label>
                    <div className="flex items-center space-x-2">
                        <InputField value={customerSearchView} onChange={e => { setCustomerSearchView(e.target.value); setSelectedCustomerForView(null); }} placeholder="Nume client..." />
                        <button onClick={() => { setCustomerSearchView(''); setSelectedCustomerForView(null); }} className="p-2 text-gray-500 hover:text-red-600" title="Șterge filtrul"><X size={18}/></button>
                    </div>
                    {customerSearchView && !selectedCustomerForView && (
                        <div className="absolute z-10 w-full border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
                            {filteredCustomersForView.map(c => (
                                <div key={c.id} onClick={() => { setSelectedCustomerForView(c); setCustomerSearchView(c.name); }} className="p-2 hover:bg-blue-50 cursor-pointer">{c.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold mb-4">Istoric Comenzi</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Client</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Data</th>
                                <th className="p-3 font-semibold text-right">Total / Achitat</th>
                                <th className="p-3 font-semibold text-right">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan="5" className="p-3 text-center">Se încarcă...</td></tr>}
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{order.customerName}</td>
                                    <td className="p-3"><StatusBadge status={order.status} /></td>
                                    <td className="p-3 text-sm text-gray-600">{getDateFromTimestamp(order.createdAt).toLocaleDateString('ro-RO')}</td>
                                    <td className="p-3 text-right font-mono">
                                        {formatCurrency(order.totalAmount)}
                                        <br/>
                                        <span className="text-green-600">({formatCurrency(order.paidAmount || 0)})</span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setOrderToStorno(order)} className="p-2 text-gray-500 hover:text-orange-600" title="Stornează"><X size={18}/></button>
                                        <button onClick={() => setOrderToDelete(order)} className="p-2 text-gray-500 hover:text-red-600" title="Șterge"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={openNewOrder} onClose={handleCloseModal} title={modalTitle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-bold text-lg">Adaugă Produse</h3>
                        <InputField value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Caută produs..." />
                        <div className="border rounded-lg h-64 overflow-y-auto">
                            {filteredProducts.map(p => (
                                <div key={p.id} onClick={() => handleAddProductToOrder(p)} className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer">
                                    <span>{p.name}</span>
                                    <span className="font-mono text-sm">{formatCurrency(p.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="font-bold text-lg">Detalii Comandă</h3>
                        <div>
                             <label className="font-semibold text-sm mb-1 block">Client</label>
                             <InputField value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); }} placeholder="Caută sau adaugă client..." />
                             {customerSearch && !selectedCustomer && (
                                 <div className="border rounded-lg mt-1 max-h-32 overflow-y-auto bg-white">
                                     {filteredCustomers.map(c => (
                                         <div key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); }} className="p-2 hover:bg-blue-50 cursor-pointer">
                                             {c.name}
                                         </div>
                                     ))}
                                     {filteredCustomers.length === 0 && (
                                         <div onClick={handleCreateCustomer} className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer font-semibold">
                                             + Creează client nou: "{customerSearch}"
                                         </div>
                                     )}
                                 </div>
                             )}
                        </div>
                        
                        <div className="border rounded-lg p-2 flex-grow min-h-[150px] bg-gray-50">
                             {previousDebt > 0 && (
                                 <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b text-red-600">
                                     <span>Datorie Anterioară</span>
                                     <span className="font-mono">{formatCurrency(previousDebt)}</span>
                                 </div>
                             )}
                            {newOrderItems.length === 0 ? <p className="text-gray-500 text-center mt-10">Niciun produs adăugat.</p> :
                                newOrderItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm mb-1 group">
                                        <span>{item.name} x {item.quantity}</span>
                                        <div className="flex items-center">
                                            <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                                            <button onClick={() => handleRemoveItemFromOrder(item.productId)} className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Elimină">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-between items-center font-bold text-xl border-t pt-2">
                            <span>TOTAL NOU</span>
                            <span className="font-mono">{formatCurrency(finalTotal)}</span>
                        </div>
                        <PrimaryButton onClick={handleSaveOrder} className="w-full" disabled={isSaveDisabled}>Salvează Comanda</PrimaryButton>
                    </div>
                </div>
            </Modal>
            
            <ConfirmationModal 
                isOpen={!!orderToDelete}
                onClose={() => setOrderToDelete(null)}
                onConfirm={handleDeleteOrder}
                title="Confirmă Ștergerea"
                message={`Ești sigur că vrei să ștergi comanda pentru "${orderToDelete?.customerName}"?`}
            />
            <ConfirmationModal 
                isOpen={!!orderToStorno}
                onClose={() => setOrderToStorno(null)}
                onConfirm={handleStornoOrder}
                title="Confirmă Stornarea"
                message={`Ești sigur că vrei să anulezi (stornezi) comanda pentru "${orderToStorno?.customerName}"?`}
            />
        </div>
    );
};

const Payments = ({ db, customers, orders, showToast, setRawOrders, setPayments, rawOrders, payments }) => {
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [amountPaid, setAmountPaid] = useState('');

    const { customerUnpaidOrders, totalDebt, previousDebts, todaysDebts } = useMemo(() => {
        if (!selectedCustomer) return { customerUnpaidOrders: [], totalDebt: 0, previousDebts: [], todaysDebts: [] };
        
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const filteredOrders = orders.filter(o => o.customerId === selectedCustomer.id && o.status !== 'Plătită Integral' && o.status !== 'Stornată');
        
        const prev = filteredOrders.filter(o => o.status === 'Transferată' || getDateFromTimestamp(o.createdAt) < todayStart);
        const today = filteredOrders.filter(o => o.status !== 'Transferată' && getDateFromTimestamp(o.createdAt) >= todayStart);

        const debt = filteredOrders.reduce((sum, o) => sum + (o.totalAmount - (o.paidAmount || 0)), 0);
        
        return { customerUnpaidOrders: filteredOrders, totalDebt: debt, previousDebts: prev, todaysDebts: today };
    }, [selectedCustomer, orders]);

    const change = useMemo(() => {
        const paid = parseFloat(amountPaid.replace(',', '.'));
        return (!isNaN(paid) && paid > totalDebt) ? paid - totalDebt : 0;
    }, [amountPaid, totalDebt]);
    
    const filteredCustomers = useMemo(() => 
        customerSearch ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())) : [],
    [customers, customerSearch]);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
    };

    const handleProcessPayment = async () => {
        const paid = parseFloat(amountPaid.replace(',', '.'));
        if (isNaN(paid) || paid <= 0) return;

        try {
            if (db.isLocalStorage) {
                let remainingAmountToSettle = paid;
                const sortedOrders = [...customerUnpaidOrders].sort((a, b) => (a.getDateFromTimestamp(a.createdAt).getTime()) - (b.getDateFromTimestamp(a.createdAt).getTime()));
                const settlementDetails = [];

                // Actualizează comenzile
                const updatedOrders = rawOrders.map(order => {
                    if (remainingAmountToSettle <= 0) return order;
                    
                    const customerOrder = sortedOrders.find(o => o.id === order.id);
                    if (!customerOrder) return order;
                    
                    const dueOnOrder = order.totalAmount - (order.paidAmount || 0);
                    const amountToApply = Math.min(remainingAmountToSettle, dueOnOrder);

                    if (amountToApply > 0) {
                        settlementDetails.push({
                            orderId: order.id,
                            amountSettled: amountToApply
                        });

                        remainingAmountToSettle -= amountToApply;

                        if (amountToApply >= dueOnOrder) {
                            return { ...order, paidAmount: order.totalAmount, status: 'Plătită Integral' };
                        } else {
                            return { ...order, paidAmount: (order.paidAmount || 0) + amountToApply, status: 'Plătită Parțial' };
                        }
                    }
                    return order;
                });

                const totalSettled = settlementDetails.reduce((sum, detail) => sum + detail.amountSettled, 0);
                const changeReturned = Math.max(0, paid - totalSettled);

                // Creează înregistrarea de plată
                const newPayment = {
                    id: generateId(),
                    customerId: selectedCustomer.id,
                    customerName: selectedCustomer.name,
                    amount: paid,
                    createdAt: createTimestamp(),
                    settlementDetails: settlementDetails,
                    changeReturned: changeReturned
                };

                setRawOrders(updatedOrders);
                setLocalStorageData('orderflow_orders', updatedOrders);
                
                const updatedPayments = [...payments, newPayment];
                setPayments(updatedPayments);
                setLocalStorageData('orderflow_payments', updatedPayments);
            } else {
                // Logica Firebase originală
                const batch = writeBatch(db);
                let remainingAmountToSettle = paid;
                const sortedOrders = [...customerUnpaidOrders].sort((a, b) => (a.getDateFromTimestamp(a.createdAt).getTime()) - (b.getDateFromTimestamp(a.createdAt).getTime()));
                const settlementDetails = [];

                for (const order of sortedOrders) {
                    if (remainingAmountToSettle <= 0) break;
                    
                    const orderRef = doc(db, `users/${userId}/orders`, order.id);
                    const dueOnOrder = order.totalAmount - (order.paidAmount || 0);
                    const amountToApply = Math.min(remainingAmountToSettle, dueOnOrder);

                    if (amountToApply >= dueOnOrder) {
                        batch.update(orderRef, { paidAmount: order.totalAmount, status: 'Plătită Integral' });
                    } else {
                        batch.update(orderRef, { paidAmount: (order.paidAmount || 0) + amountToApply, status: 'Plătită Parțial' });
                    }
                    
                    settlementDetails.push({
                        orderId: order.id,
                        amountSettled: amountToApply
                    });

                    remainingAmountToSettle -= amountToApply;
                }

                const totalSettled = settlementDetails.reduce((sum, detail) => sum + detail.amountSettled, 0);
                const changeReturned = Math.max(0, paid - totalSettled);

                const paymentRef = doc(collection(db, `users/${userId}/payments`));
                batch.set(paymentRef, {
                    customerId: selectedCustomer.id,
                    customerName: selectedCustomer.name,
                    amount: paid,
                    createdAt: serverTimestamp(),
                    settlementDetails: settlementDetails,
                    changeReturned: changeReturned,
                    ownerId: userId
                });
                
                await batch.commit();
            }
            
            showToast("Plata a fost procesată cu succes!", "success");
            setSelectedCustomer(null); setCustomerSearch(''); setAmountPaid('');

        } catch (error) { console.error("Eroare la procesarea plății:", error); showToast("Eroare la procesarea plății.", "error"); }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Încasări și Plăți</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
                <div className="mb-4">
                    <label className="font-semibold text-gray-700 block mb-2">Caută Client</label>
                    <InputField value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); }} placeholder="Nume client..." />
                    {customerSearch && !selectedCustomer && (
                        <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto">
                            {filteredCustomers.map(c => (
                                <div key={c.id} onClick={() => handleSelectCustomer(c)} className="p-2 hover:bg-blue-50 cursor-pointer">{c.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedCustomer && (
                    <div>
                        <div className="my-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Detalii Datorie</h3>
                            
                            {previousDebts.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="font-semibold text-sm text-gray-500">Datorii Anterioare</h4>
                                    {previousDebts.map(o => (
                                        <div key={o.id} className="flex justify-between text-xs">
                                            <span>Comanda din {getDateFromTimestamp(o.createdAt).toLocaleDateString('ro-RO')}</span>
                                            <span>{formatCurrency(o.totalAmount - (o.paidAmount || 0))}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {todaysDebts.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="font-semibold text-sm text-gray-500">Comenzi Astăzi</h4>
                                     {todaysDebts.map(o => (
                                        <div key={o.id} className="flex justify-between text-xs">
                                            <span>Comanda #{o.id.substring(0, 5)}</span>
                                            <span>{formatCurrency(o.totalAmount - (o.paidAmount || 0))}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-between items-center text-2xl font-bold text-red-600 border-t mt-2 pt-2">
                                <span>Total de Plată:</span>
                                <span>{formatCurrency(totalDebt)}</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="font-semibold text-gray-700 block mb-2">Suma Încasată</label>
                            <InputField value={amountPaid} onChange={e => setAmountPaid(e.target.value)} type="text" inputMode="decimal" placeholder="0.00" />
                        </div>
                        
                        {change > 0 && (
                             <div className="my-6 p-4 bg-green-50 rounded-lg">
                                 <div className="flex justify-between items-center text-xl font-bold text-green-600">
                                     <span>Rest de Returnat:</span>
                                     <span>{formatCurrency(change)}</span>
                                 </div>
                            </div>
                        )}

                        <PrimaryButton onClick={handleProcessPayment} className="w-full text-lg" disabled={!amountPaid || parseFloat(amountPaid.replace(',', '.')) <= 0}>
                            Încasează {amountPaid ? formatCurrency(parseFloat(amountPaid.replace(',', '.'))) : ''}
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
};

const RemainingDebts = ({ orders, isLoading }) => {
    const transferredOrders = useMemo(() => {
        return orders.filter(o => o.status === 'Transferată');
    }, [orders]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Datorii Rămase (Transferate)</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold">Client</th>
                                <th className="p-3 font-semibold">Data Originală</th>
                                <th className="p-3 font-semibold text-right">Datorie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan="3" className="p-3 text-center">Se încarcă...</td></tr>}
                            {!isLoading && transferredOrders.length === 0 && <tr><td colSpan="3" className="p-3 text-center text-gray-500">Nicio datorie transferată.</td></tr>}
                            {transferredOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{order.customerName}</td>
                                    <td className="p-3 text-sm text-gray-600">{getDateFromTimestamp(order.createdAt).toLocaleDateString('ro-RO')}</td>
                                    <td className="p-3 text-right font-mono text-red-600">{formatCurrency(order.totalAmount - (order.paidAmount || 0))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Reports = ({ orders, isLoading }) => {
    const [activeReport, setActiveReport] = useState('debt_register');

    const renderActiveReport = () => {
        switch (activeReport) {
            case 'debt_register': return <DebtRegister orders={orders} />;
            case 'sales_journal': return <SalesJournal orders={orders} />;
            case 'top_products': return <TopProductsReport orders={orders} />;
            case 'top_customers': return <TopCustomersReport orders={orders} />;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Rapoarte</h1>
            <div className="flex space-x-2 border-b mb-6 overflow-x-auto">
                <button onClick={() => setActiveReport('debt_register')} className={`py-2 px-4 whitespace-nowrap ${activeReport === 'debt_register' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Registru Datorii</button>
                <button onClick={() => setActiveReport('sales_journal')} className={`py-2 px-4 whitespace-nowrap ${activeReport === 'sales_journal' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Jurnal Vânzări</button>
                <button onClick={() => setActiveReport('top_products')} className={`py-2 px-4 whitespace-nowrap ${activeReport === 'top_products' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Top Produse</button>
                <button onClick={() => setActiveReport('top_customers')} className={`py-2 px-4 whitespace-nowrap ${activeReport === 'top_customers' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>Top Clienți</button>
            </div>
            {isLoading ? <p>Se încarcă datele...</p> : renderActiveReport()}
        </div>
    );
};

const exportToCSV = (data, filename = 'export.csv') => {
    if (data.length === 0) {
        alert('Nu există date de exportat.');
        return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    
    const csvString = csvRows.join('\r\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const ReportWrapper = ({ title, onExport, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <PrimaryButton onClick={onExport} className="flex items-center space-x-2"><Download size={16}/><span>Exportă CSV</span></PrimaryButton>
        </div>
        {children}
    </div>
);

const DebtRegister = ({ orders }) => {
    const debtData = useMemo(() => {
        const debts = {};
        orders.forEach(order => {
            if (order.status !== 'Plătită Integral' && order.status !== 'Stornată') {
                const due = order.totalAmount - (order.paidAmount || 0);
                if (due > 0.001) {
                    if (!debts[order.customerName]) {
                        debts[order.customerName] = { Client: order.customerName, Datorie: 0, "Data Primei Datorii": getDateFromTimestamp(order.createdAt) };
                    }
                    debts[order.customerName].Datorie += due;
                    if (getDateFromTimestamp(order.createdAt) < debts[order.customerName]["Data Primei Datorii"]) {
                        debts[order.customerName]["Data Primei Datorii"] = getDateFromTimestamp(order.createdAt);
                    }
                }
            }
        });
        return Object.values(debts).map(d => ({ ...d, Datorie: d.Datorie, "Data Primei Datorii": d["Data Primei Datorii"].toLocaleDateString('ro-RO') }));
    }, [orders]);
    
    const exportableDebtData = useMemo(() => debtData.map(d => ({...d, Datorie: d.Datorie.toFixed(2)})), [debtData]);

    return (
        <ReportWrapper title="Registru Datorii" onExport={() => exportToCSV(exportableDebtData, 'registru_datorii.csv')}>
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead><tr className="border-b bg-gray-50"><th className="p-3 font-semibold">Client</th><th className="p-3 font-semibold">Data Primei Datorii</th><th className="p-3 font-semibold text-right">Datorie</th></tr></thead>
                     <tbody>
                         {debtData.length === 0 && <tr><td colSpan="3" className="p-3 text-center text-gray-500">Nicio datorie.</td></tr>}
                         {debtData.map((debt, i) => (
                             <tr key={i} className="border-b"><td className="p-3">{debt.Client}</td><td className="p-3">{debt["Data Primei Datorii"]}</td><td className="p-3 text-right font-mono text-red-500">{formatCurrency(debt.Datorie)}</td></tr>
                         ))}
                     </tbody>
                  </table>
             </div>
        </ReportWrapper>
    );
};

const SalesJournal = ({ orders }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const orderDate = getDateFromTimestamp(order.createdAt);
            if (!orderDate) return false;
            if (startDate && orderDate < new Date(startDate)) return false;
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (orderDate > end) return false;
            }
            return true;
        });
    }, [orders, startDate, endDate]);
    
    const exportableData = useMemo(() => filteredOrders.map(o => ({
        Data: getDateFromTimestamp(o.createdAt).toLocaleString('ro-RO'),
        Client: o.customerName,
        Status: o.status,
        Total: o.totalAmount.toFixed(2),
        Achitat: (o.paidAmount || 0).toFixed(2)
    })), [filteredOrders]);

     return (
        <ReportWrapper title="Jurnal Vânzări" onExport={() => exportToCSV(exportableData, 'jurnal_vanzari.csv')}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <InputField type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <InputField type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead><tr className="border-b bg-gray-50"><th className="p-3 font-semibold">Data</th><th className="p-3 font-semibold">Client</th><th className="p-3 font-semibold">Status</th><th className="p-3 font-semibold text-right">Total</th></tr></thead>
                     <tbody>
                         {filteredOrders.length === 0 && <tr><td colSpan="4" className="p-3 text-center text-gray-500">Nicio vânzare în perioada selectată.</td></tr>}
                         {filteredOrders.map(order => (
                             <tr key={order.id} className="border-b"><td className="p-3">{getDateFromTimestamp(order.createdAt).toLocaleString('ro-RO')}</td><td className="p-3">{order.customerName}</td><td className="p-3">{order.status}</td><td className="p-3 text-right font-mono">{formatCurrency(order.totalAmount)}</td></tr>
                         ))}
                     </tbody>
                  </table>
             </div>
        </ReportWrapper>
       );
};

const TopProductsReport = ({ orders }) => {
    const productData = useMemo(() => {
        const stats = {};
        orders.forEach(order => {
            if(order.status !== 'Stornată') {
                order.items.forEach(item => {
                    if(!stats[item.productId]) {
                        stats[item.productId] = { Produs: item.name, Cantitate: 0, "Valoare Totala": 0 };
                    }
                    stats[item.productId].Cantitate += item.quantity;
                    stats[item.productId]["Valoare Totala"] += item.quantity * item.price;
                });
            }
        });
        return Object.values(stats)
            .sort((a, b) => b.Cantitate - a.Cantitate)
            .map(p => ({ ...p, "Valoare Totala": p["Valoare Totala"] }));
    }, [orders]);

    const exportableProductData = useMemo(() => productData.map(p => ({...p, "Valoare Totala": p["Valoare Totala"].toFixed(2)})), [productData]);

    return (
        <ReportWrapper title="Top Produse Vândute" onExport={() => exportToCSV(exportableProductData, 'top_produse.csv')}>
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead><tr className="border-b bg-gray-50"><th className="p-3 font-semibold">Produs</th><th className="p-3 font-semibold text-right">Cantitate</th><th className="p-3 font-semibold text-right">Valoare Totală</th></tr></thead>
                     <tbody>
                         {productData.map((p, i) => (
                             <tr key={i} className="border-b"><td className="p-3">{p.Produs}</td><td className="p-3 text-right font-mono">{p.Cantitate}</td><td className="p-3 text-right font-mono">{formatCurrency(p["Valoare Totala"])}</td></tr>
                         ))}
                     </tbody>
                  </table>
             </div>
        </ReportWrapper>
    );
};

const TopCustomersReport = ({ orders }) => {
    const customerData = useMemo(() => {
        const stats = {};
        orders.forEach(order => {
            if(order.status !== 'Stornată') {
                if(!stats[order.customerName]) {
                    stats[order.customerName] = { Client: order.customerName, "Total Cheltuit": 0 };
                }
                stats[order.customerName]["Total Cheltuit"] += order.totalAmount;
            }
        });
        return Object.values(stats)
            .sort((a, b) => b["Total Cheltuit"] - a["Total Cheltuit"])
            .map(c => ({...c, "Total Cheltuit": c["Total Cheltuit"]}));
    }, [orders]);

    const exportableCustomerData = useMemo(() => customerData.map(c => ({...c, "Total Cheltuit": c["Total Cheltuit"].toFixed(2)})), [customerData]);
    
    return (
        <ReportWrapper title="Top Clienți" onExport={() => exportToCSV(exportableCustomerData, 'top_clienti.csv')}>
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead><tr className="border-b bg-gray-50"><th className="p-3 font-semibold">Client</th><th className="p-3 font-semibold text-right">Total Cheltuit</th></tr></thead>
                     <tbody>
                         {customerData.map((c, i) => (
                             <tr key={i} className="border-b"><td className="p-3">{c.Client}</td><td className="p-3 text-right font-mono">{formatCurrency(c["Total Cheltuit"])}</td></tr>
                         ))}
                     </tbody>
                  </table>
             </div>
        </ReportWrapper>
    );
};


// --- COMPONENTA PRINCIPALĂ A APLICAȚIEI ---
export default function App() {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [openNewOrder, setOpenNewOrder] = useState(false);
    
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawOrders, setRawOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [dayClosings, setDayClosings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    const orders = useMemo(() => {
        return [...rawOrders].sort((a, b) => {
            const dateA = getDateFromTimestamp(a.createdAt) || 0;
            const dateB = getDateFromTimestamp(b.createdAt) || 0;
            return dateB - dateA;
        });
    }, [rawOrders]);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                if (firebaseConfig && Object.keys(firebaseConfig).length > 0 && !useLocalStorage) {
                    await loadFirebaseModules();
                    if (initializeApp && getFirestore && getAuth) {
                        const app = initializeApp(firebaseConfig);
                        const firestoreDb = getFirestore(app);
                        const firebaseAuth = getAuth(app);
                        setDb(firestoreDb); 
                        setAuth(firebaseAuth);
                    } else {
                        throw new Error('Firebase modules not loaded');
                    }
                } else {
                    console.log("Using localStorage fallback mode.");
                    // Setează mock objects pentru compatibilitate
                    setDb({ isLocalStorage: true });
                    setAuth({ isLocalStorage: true });
                }
            } catch (e) { 
                console.error("Firebase initialization error:", e);
                console.log("Falling back to localStorage.");
                setDb({ isLocalStorage: true });
                setAuth({ isLocalStorage: true });
            }
        };
        
        initializeApp();
    }, []);

    useEffect(() => {
        if (!auth) return;
        
        if (auth.isLocalStorage) {
            // Pentru localStorage, setează un user ID generat
            const userId = localStorage.getItem('orderflow_user_id') || generateId();
            localStorage.setItem('orderflow_user_id', userId);
            setUserId(userId);
            setIsAuthReady(true);
        } else {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) { 
                    setUserId(user.uid); 
                } else {
                    try {
                        if (typeof window !== 'undefined' && window.__initial_auth_token) {
                            await signInWithCustomToken(auth, window.__initial_auth_token);
                        } else { await signInAnonymously(auth); }
                    } catch (error) { console.error("Auth sign-in error:", error); }
                }
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        }
    }, [auth]);

    useEffect(() => {
        if (!db || !isAuthReady) return;
        
        setIsLoading(true);
        
        if (db.isLocalStorage) {
            // Încarcă datele din localStorage
            setCustomers(getLocalStorageData('orderflow_customers', []));
            setProducts(getLocalStorageData('orderflow_products', []));
            setRawOrders(getLocalStorageData('orderflow_orders', []));
            setPayments(getLocalStorageData('orderflow_payments', []));
            setDayClosings(getLocalStorageData('orderflow_dayClosings', []));
            setIsLoading(false);
        } else {
            // Logica Firebase originală
            const collections = {
                customers: setCustomers,
                products: setProducts,
                orders: setRawOrders,
                payments: setPayments,
                dayClosings: setDayClosings
            };

            const unsubscribers = Object.entries(collections).map(([name, setter]) => {
                const q = query(collection(db, `users/${userId}/${name}`));
                return onSnapshot(q, 
                    (snapshot) => {
                        setter(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
                        if (name === 'dayClosings') setIsLoading(false);
                    },
                    (error) => {
                        console.error(`Error fetching ${name}:`, error);
                        showToast(`Eroare la încărcarea datelor: ${name}`, 'error');
                        setIsLoading(false);
                    }
                );
            });

            return () => { unsubscribers.forEach(unsub => unsub()); };
        }
    }, [db, isAuthReady, showToast]);


    const handleNewOrderClick = () => { setActiveModule('orders'); setOpenNewOrder(true); };

    const renderModule = () => {
        if (!isAuthReady || isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }
        
        switch (activeModule) {
            case 'dashboard': return <Dashboard orders={orders} payments={payments} dayClosings={dayClosings} setActiveModule={setActiveModule} onNewOrderClick={handleNewOrderClick} db={db} showToast={showToast} setRawOrders={setRawOrders} setDayClosings={setDayClosings} />;
            case 'products': return <Products db={db} products={products} isLoading={isLoading} showToast={showToast} setProducts={setProducts} />;
            case 'customers': return <Customers db={db} customers={customers} isLoading={isLoading} showToast={showToast} setCustomers={setCustomers} />;
            case 'orders': return <Orders db={db} openNewOrder={openNewOrder} setOpenNewOrder={setOpenNewOrder} customers={customers} products={products} orders={orders} isLoading={isLoading} showToast={showToast} setCustomers={setCustomers} setRawOrders={setRawOrders} rawOrders={rawOrders} />;
            case 'payments': return <Payments db={db} customers={customers} orders={orders} showToast={showToast} setRawOrders={setRawOrders} setPayments={setPayments} rawOrders={rawOrders} payments={payments} />;
            case 'remaining_debts': return <RemainingDebts orders={orders} isLoading={isLoading} />;
            case 'reports': return <Reports orders={orders} isLoading={isLoading} />;
            default: return <Dashboard orders={orders} payments={payments} dayClosings={dayClosings} setActiveModule={setActiveModule} onNewOrderClick={handleNewOrderClick} db={db} showToast={showToast} setRawOrders={setRawOrders} setDayClosings={setDayClosings} />;
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
                <div className="p-6 text-2xl font-bold text-blue-600 border-b">OrderFlow</div>
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
                    <p>User ID:</p>
                    <p className="font-mono break-all">{userId || 'N/A'}</p>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                 <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-bold text-blue-600">OrderFlow</span>
                </header>
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {renderModule()}
                </main>
            </div>
            {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
        </div>
    );
}
