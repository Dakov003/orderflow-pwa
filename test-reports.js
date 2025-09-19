// Test pentru funcționalitățile de raportare OrderFlow PWA

// Mock data pentru teste
const mockOrders = [
    {
        id: '1',
        customerName: 'Client A',
        totalAmount: 100,
        paidAmount: 50,
        status: 'Plătită Parțial',
        createdAt: { toDate: () => new Date('2024-01-01') },
        items: [
            { productId: 'p1', name: 'Cafea', price: 10, quantity: 5 },
            { productId: 'p2', name: 'Sandwich', price: 25, quantity: 2 }
        ]
    },
    {
        id: '2',
        customerName: 'Client B',
        totalAmount: 200,
        paidAmount: 200,
        status: 'Plătită Integral',
        createdAt: { toDate: () => new Date('2024-01-02') },
        items: [
            { productId: 'p1', name: 'Cafea', price: 10, quantity: 10 },
            { productId: 'p3', name: 'Pizza', price: 50, quantity: 2 }
        ]
    },
    {
        id: '3',
        customerName: 'Client A',
        totalAmount: 150,
        paidAmount: 0,
        status: 'Deschisă',
        createdAt: { toDate: () => new Date('2024-01-03') },
        items: [
            { productId: 'p2', name: 'Sandwich', price: 25, quantity: 6 }
        ]
    },
    {
        id: '4',
        customerName: 'Client C',
        totalAmount: 75,
        paidAmount: 0,
        status: 'Stornată',
        createdAt: { toDate: () => new Date('2024-01-04') },
        items: [
            { productId: 'p1', name: 'Cafea', price: 10, quantity: 7.5 }
        ]
    }
];

// Funcții de test pentru rapoarte
function testDebtRegister() {
    console.log('=== TEST REGISTRU DATORII ===');
    
    const debts = {};
    mockOrders.forEach(order => {
        if (order.status !== 'Plătită Integral' && order.status !== 'Stornată') {
            const due = order.totalAmount - (order.paidAmount || 0);
            if (due > 0.001) {
                if (!debts[order.customerName]) {
                    debts[order.customerName] = { 
                        Client: order.customerName, 
                        Datorie: 0, 
                        "Data Primei Datorii": order.createdAt.toDate() 
                    };
                }
                debts[order.customerName].Datorie += due;
                if (order.createdAt.toDate() < debts[order.customerName]["Data Primei Datorii"]) {
                    debts[order.customerName]["Data Primei Datorii"] = order.createdAt.toDate();
                }
            }
        }
    });
    
    const debtData = Object.values(debts);
    
    console.log('Datorii calculate:');
    debtData.forEach(debt => {
        console.log(`- ${debt.Client}: ${debt.Datorie} RON (prima dată: ${debt["Data Primei Datorii"].toLocaleDateString('ro-RO')})`);
    });
    
    // Teste
    const clientADebt = debtData.find(d => d.Client === 'Client A');
    const clientBDebt = debtData.find(d => d.Client === 'Client B');
    
    console.log(`\nTeste:`);
    console.log(`- Client A are datorie: ${clientADebt ? clientADebt.Datorie === 200 : false ? 'PASS' : 'FAIL'}`);
    console.log(`- Client B nu are datorie: ${!clientBDebt ? 'PASS' : 'FAIL'}`);
    console.log(`- Total clienți cu datorii: ${debtData.length} (așteptat: 1)`);
    
    return debtData;
}

function testSalesJournal() {
    console.log('\n=== TEST JURNAL VÂNZĂRI ===');
    
    const filteredOrders = mockOrders.filter(order => {
        const orderDate = order.createdAt?.toDate();
        if (!orderDate) return false;
        return true; // Toate comenzile pentru test
    });
    
    console.log('Comenzi în jurnal:');
    filteredOrders.forEach(order => {
        console.log(`- ${order.createdAt.toDate().toLocaleString('ro-RO')} | ${order.customerName} | ${order.status} | ${order.totalAmount} RON`);
    });
    
    // Teste
    const totalOrders = filteredOrders.length;
    const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidOrders = filteredOrders.filter(order => order.status === 'Plătită Integral').length;
    
    console.log(`\nTeste:`);
    console.log(`- Total comenzi: ${totalOrders} (așteptat: 4)`);
    console.log(`- Valoare totală: ${totalValue} RON (așteptat: 525)`);
    console.log(`- Comenzi plătite integral: ${paidOrders} (așteptat: 1)`);
    
    return filteredOrders;
}

function testTopProducts() {
    console.log('\n=== TEST TOP PRODUSE ===');
    
    const stats = {};
    mockOrders.forEach(order => {
        if(order.status !== 'Stornată') {
            order.items.forEach(item => {
                if(!stats[item.productId]) {
                    stats[item.productId] = { 
                        Produs: item.name, 
                        Cantitate: 0, 
                        "Valoare Totala": 0 
                    };
                }
                stats[item.productId].Cantitate += item.quantity;
                stats[item.productId]["Valoare Totala"] += item.quantity * item.price;
            });
        }
    });
    
    const productData = Object.values(stats)
        .sort((a, b) => b.Cantitate - a.Cantitate);
    
    console.log('Top produse:');
    productData.forEach((product, index) => {
        console.log(`${index + 1}. ${product.Produs} - ${product.Cantitate} bucăți - ${product["Valoare Totala"]} RON`);
    });
    
    // Teste
    const topProduct = productData[0];
    console.log(`\nTeste:`);
    console.log(`- Primul produs: ${topProduct.Produs} (așteptat: Cafea)`);
    console.log(`- Cantitatea totală: ${topProduct.Cantitate} (așteptat: 22.5)`);
    console.log(`- Valoarea totală: ${topProduct["Valoare Totala"]} RON (așteptat: 225)`);
    
    return productData;
}

function testTopCustomers() {
    console.log('\n=== TEST TOP CLIENTI ===');
    
    const stats = {};
    mockOrders.forEach(order => {
        if(order.status !== 'Stornată') {
            if(!stats[order.customerName]) {
                stats[order.customerName] = { 
                    Client: order.customerName, 
                    "Total Cheltuit": 0 
                };
            }
            stats[order.customerName]["Total Cheltuit"] += order.totalAmount;
        }
    });
    
    const customerData = Object.values(stats)
        .sort((a, b) => b["Total Cheltuit"] - a["Total Cheltuit"]);
    
    console.log('Top clienți:');
    customerData.forEach((customer, index) => {
        console.log(`${index + 1}. ${customer.Client} - ${customer["Total Cheltuit"]} RON`);
    });
    
    // Teste
    const topCustomer = customerData[0];
    console.log(`\nTeste:`);
    console.log(`- Primul client: ${topCustomer.Client} (așteptat: Client A)`);
    console.log(`- Total cheltuit: ${topCustomer["Total Cheltuit"]} RON (așteptat: 250)`);
    console.log(`- Numărul de clienți: ${customerData.length} (așteptat: 3)`);
    
    return customerData;
}

function testCSVExport() {
    console.log('\n=== TEST EXPORT CSV ===');
    
    const testData = [
        { Client: 'Client A', Datorie: 200.50, 'Data Primei Datorii': '01.01.2024' },
        { Client: 'Client B', Datorie: 0, 'Data Primei Datorii': '02.01.2024' }
    ];
    
    // Simulăm funcția de export CSV
    function exportToCSV(data, filename = 'export.csv') {
        if (data.length === 0) {
            return 'Nu există date de exportat.';
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
        
        return csvRows.join('\r\n');
    }
    
    const csvContent = exportToCSV(testData);
    console.log('Conținut CSV generat:');
    console.log(csvContent);
    
    // Teste
    const lines = csvContent.split('\r\n');
    console.log(`\nTeste:`);
    console.log(`- CSV are header: ${lines[0].includes('Client') ? 'PASS' : 'FAIL'}`);
    console.log(`- CSV are date: ${lines.length > 1 ? 'PASS' : 'FAIL'}`);
    console.log(`- CSV conține Client A: ${csvContent.includes('Client A') ? 'PASS' : 'FAIL'}`);
    
    return csvContent;
}

// Rulează toate testele de raportare
console.log('ÎNCEP TESTAREA FUNCȚIONALITĂȚILOR DE RAPORTARE');
console.log('===============================================');

const debtData = testDebtRegister();
const salesData = testSalesJournal();
const productData = testTopProducts();
const customerData = testTopCustomers();
const csvData = testCSVExport();

console.log('\n===============================================');
console.log('TESTAREA RAPOARTELOR S-A TERMINAT');
console.log('\nRezumat:');
console.log(`- Datorii identificate: ${debtData.length}`);
console.log(`- Comenzi în jurnal: ${salesData.length}`);
console.log(`- Produse unice: ${productData.length}`);
console.log(`- Clienți unici: ${customerData.length}`);
console.log(`- CSV generat: ${csvData.length > 0 ? 'DA' : 'NU'}`);
