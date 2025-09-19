// Test pentru logica funcționalității OrderFlow PWA
// Acest fișier testează funcțiile de bază ale aplicației

// Mock pentru localStorage
const mockLocalStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
    },
    clear: function() {
        this.data = {};
    }
};

// Mock pentru window.localStorage
global.localStorage = mockLocalStorage;

// Definim funcțiile de test direct aici (extrase din App.jsx)
const formatCurrency = (amount) => {
    const numberAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    if (isNaN(numberAmount)) {
        return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(0);
    }
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(numberAmount);
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createTimestamp = () => {
    return { toDate: () => new Date() };
};

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

// Teste pentru formatCurrency
console.log('=== TESTE PENTRU formatCurrency ===');
const testFormatCurrency = () => {
    const testCases = [
        { input: 123.45, expected: '123,45 RON' },
        { input: 0, expected: '0,00 RON' },
        { input: 'invalid', expected: '0,00 RON' },
        { input: null, expected: '0,00 RON' },
        { input: undefined, expected: '0,00 RON' }
    ];

    testCases.forEach((testCase, index) => {
        const result = formatCurrency(testCase.input);
        const passed = result === testCase.expected;
        console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
        console.log(`  Input: ${testCase.input}`);
        console.log(`  Expected: ${testCase.expected}`);
        console.log(`  Got: ${result}`);
        console.log('');
    });
};

// Teste pentru generateId
console.log('=== TESTE PENTRU generateId ===');
const testGenerateId = () => {
    const id1 = generateId();
    const id2 = generateId();
    
    console.log(`ID 1: ${id1}`);
    console.log(`ID 2: ${id2}`);
    console.log(`IDs sunt diferite: ${id1 !== id2 ? 'PASS' : 'FAIL'}`);
    console.log(`ID 1 este string: ${typeof id1 === 'string' ? 'PASS' : 'FAIL'}`);
    console.log(`ID 2 este string: ${typeof id2 === 'string' ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Teste pentru localStorage helpers
console.log('=== TESTE PENTRU localStorage HELPERS ===');
const testLocalStorageHelpers = () => {
    // Test getLocalStorageData cu valoare default
    const emptyResult = getLocalStorageData('non_existent_key', []);
    console.log(`getLocalStorageData cu default []: ${Array.isArray(emptyResult) ? 'PASS' : 'FAIL'}`);
    
    // Test setLocalStorageData și getLocalStorageData
    const testData = [{ id: '1', name: 'Test' }];
    setLocalStorageData('test_key', testData);
    const retrievedData = getLocalStorageData('test_key', []);
    console.log(`setLocalStorageData/getLocalStorageData: ${JSON.stringify(retrievedData) === JSON.stringify(testData) ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Teste pentru createTimestamp
console.log('=== TESTE PENTRU createTimestamp ===');
const testCreateTimestamp = () => {
    const timestamp = createTimestamp();
    const date = timestamp.toDate();
    
    console.log(`createTimestamp returnează obiect cu toDate: ${typeof timestamp.toDate === 'function' ? 'PASS' : 'FAIL'}`);
    console.log(`toDate() returnează Date: ${date instanceof Date ? 'PASS' : 'FAIL'}`);
    console.log(`Data este validă: ${!isNaN(date.getTime()) ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Teste pentru logica de calcul a datoriilor
console.log('=== TESTE PENTRU LOGICA DATORII ===');
const testDebtCalculation = () => {
    const orders = [
        { id: '1', customerId: 'c1', customerName: 'Client 1', totalAmount: 100, paidAmount: 50, status: 'Plătită Parțial' },
        { id: '2', customerId: 'c1', customerName: 'Client 1', totalAmount: 200, paidAmount: 0, status: 'Deschisă' },
        { id: '3', customerId: 'c2', customerName: 'Client 2', totalAmount: 150, paidAmount: 150, status: 'Plătită Integral' },
        { id: '4', customerId: 'c1', customerName: 'Client 1', totalAmount: 75, paidAmount: 0, status: 'Stornată' }
    ];

    // Calculul datoriilor pentru Client 1
    const client1Orders = orders.filter(o => o.customerId === 'c1' && o.status !== 'Stornată');
    const totalDebt = client1Orders.reduce((sum, o) => sum + (o.totalAmount - (o.paidAmount || 0)), 0);
    
    console.log(`Datorie Client 1: ${totalDebt} (așteptat: 250)`);
    console.log(`Calculul datoriilor: ${totalDebt === 250 ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Teste pentru logica de procesare a plăților
console.log('=== TESTE PENTRU LOGICA PLĂȚI ===');
const testPaymentLogic = () => {
    const orders = [
        { id: '1', totalAmount: 100, paidAmount: 0, status: 'Deschisă' },
        { id: '2', totalAmount: 200, paidAmount: 0, status: 'Deschisă' }
    ];
    
    const paymentAmount = 150;
    let remainingAmount = paymentAmount;
    const settlementDetails = [];
    
    // Simulăm procesarea plății
    for (const order of orders) {
        if (remainingAmount <= 0) break;
        
        const dueOnOrder = order.totalAmount - (order.paidAmount || 0);
        const amountToApply = Math.min(remainingAmount, dueOnOrder);
        
        if (amountToApply > 0) {
            settlementDetails.push({
                orderId: order.id,
                amountSettled: amountToApply
            });
            remainingAmount -= amountToApply;
        }
    }
    
    const totalSettled = settlementDetails.reduce((sum, detail) => sum + detail.amountSettled, 0);
    const changeReturned = Math.max(0, paymentAmount - totalSettled);
    
    console.log(`Suma plătită: ${paymentAmount}`);
    console.log(`Total decontat: ${totalSettled}`);
    console.log(`Rest de returnat: ${changeReturned}`);
    console.log(`Logica plăților: ${totalSettled === 150 && changeReturned === 0 ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Teste pentru logica de filtrare a comenzilor
console.log('=== TESTE PENTRU FILTRAREA COMENZILOR ===');
const testOrderFiltering = () => {
    const orders = [
        { id: '1', customerId: 'c1', status: 'Deschisă', createdAt: { toDate: () => new Date('2024-01-01') } },
        { id: '2', customerId: 'c1', status: 'Plătită Integral', createdAt: { toDate: () => new Date('2024-01-02') } },
        { id: '3', customerId: 'c2', status: 'Deschisă', createdAt: { toDate: () => new Date('2024-01-03') } },
        { id: '4', customerId: 'c1', status: 'Stornată', createdAt: { toDate: () => new Date('2024-01-04') } }
    ];
    
    // Filtrare după client
    const client1Orders = orders.filter(o => o.customerId === 'c1');
    console.log(`Comenzi Client 1: ${client1Orders.length} (așteptat: 3)`);
    console.log(`Filtrare după client: ${client1Orders.length === 3 ? 'PASS' : 'FAIL'}`);
    
    // Filtrare după status
    const openOrders = orders.filter(o => o.status === 'Deschisă');
    console.log(`Comenzi deschise: ${openOrders.length} (așteptat: 2)`);
    console.log(`Filtrare după status: ${openOrders.length === 2 ? 'PASS' : 'FAIL'}`);
    console.log('');
};

// Rulează toate testele
console.log('ÎNCEP TESTAREA LOGICII APLICAȚIEI ORDERFLOW PWA');
console.log('================================================');
console.log('');

testFormatCurrency();
testGenerateId();
testLocalStorageHelpers();
testCreateTimestamp();
testDebtCalculation();
testPaymentLogic();
testOrderFiltering();

console.log('================================================');
console.log('TESTAREA S-A TERMINAT');
