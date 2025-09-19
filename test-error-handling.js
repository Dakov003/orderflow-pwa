// Test pentru gestionarea erorilor OrderFlow PWA

console.log('=== TEST GESTIONAREA ERORILOR ORDERFLOW PWA ===');

// Mock pentru localStorage cu erori
const mockLocalStorageWithErrors = {
    data: {},
    shouldThrowError: false,
    getItem: function(key) {
        if (this.shouldThrowError) {
            throw new Error('Simulated localStorage error');
        }
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        if (this.shouldThrowError) {
            throw new Error('Simulated localStorage error');
        }
        this.data[key] = value;
    },
    clear: function() {
        this.data = {};
    }
};

// Funcții de test pentru gestionarea erorilor
function testLocalStorageErrorHandling() {
    console.log('\n--- Test Gestionare Erori localStorage ---');
    
    const originalLocalStorage = global.localStorage;
    global.localStorage = mockLocalStorageWithErrors;
    
    let tests = [];
    
    // Test 1: Eroare la citire localStorage
    mockLocalStorageWithErrors.shouldThrowError = true;
    
    function safeGetLocalStorage(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.log(`Eroare la citire ${key}: ${error.message}`);
            return defaultValue;
        }
    }
    
    const result = safeGetLocalStorage('test_key', []);
    tests.push({
        name: 'Eroare la citire localStorage - returnează default',
        passed: Array.isArray(result) && result.length === 0
    });
    
    // Test 2: Eroare la scriere localStorage
    function safeSetLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.log(`Eroare la scriere ${key}: ${error.message}`);
            return false;
        }
    }
    
    const writeResult = safeSetLocalStorage('test_key', { test: 'data' });
    tests.push({
        name: 'Eroare la scriere localStorage - returnează false',
        passed: writeResult === false
    });
    
    // Test 3: JSON parse error
    mockLocalStorageWithErrors.shouldThrowError = false;
    mockLocalStorageWithErrors.setItem('invalid_json', 'invalid json string');
    
    function safeJSONParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.log(`Eroare JSON parse: ${error.message}`);
            return defaultValue;
        }
    }
    
    const jsonResult = safeJSONParse(localStorage.getItem('invalid_json'), []);
    tests.push({
        name: 'Eroare JSON parse - returnează default',
        passed: Array.isArray(jsonResult) && jsonResult.length === 0
    });
    
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.passed ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.passed);
}

function testNetworkErrorHandling() {
    console.log('\n--- Test Gestionare Erori Rețea ---');
    
    let tests = [];
    
    // Test 1: Fetch cu timeout
    function fetchWithTimeout(url, timeout = 5000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    }
    
    // Test cu URL inexistent
    fetchWithTimeout('/nonexistent-url', 1000)
        .then(() => {
            tests.push({
                name: 'Fetch cu URL inexistent - ar trebui să eșueze',
                passed: false
            });
        })
        .catch(error => {
            tests.push({
                name: 'Fetch cu URL inexistent - gestionează eroarea',
                passed: error.message === 'Timeout' || error.message.includes('404')
            });
        });
    
    // Test 2: Retry logic
    function fetchWithRetry(url, maxRetries = 3) {
        return new Promise((resolve, reject) => {
            let retries = 0;
            
            function attempt() {
                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            resolve(response);
                        } else {
                            throw new Error(`HTTP ${response.status}`);
                        }
                    })
                    .catch(error => {
                        retries++;
                        if (retries < maxRetries) {
                            console.log(`Retry ${retries}/${maxRetries} pentru ${url}`);
                            setTimeout(attempt, 1000 * retries);
                        } else {
                            reject(error);
                        }
                    });
            }
            
            attempt();
        });
    }
    
    fetchWithRetry('/nonexistent-url', 2)
        .then(() => {
            tests.push({
                name: 'Retry logic - ar trebui să eșueze',
                passed: false
            });
        })
        .catch(error => {
            tests.push({
                name: 'Retry logic - gestionează eroarea finală',
                passed: error.message.includes('HTTP') || error.message.includes('Failed to fetch')
            });
        });
    
    // Test 3: Offline detection
    function handleOfflineError(error) {
        if (!navigator.onLine) {
            console.log('Aplicația este offline');
            return { offline: true, message: 'Aplicația este offline' };
        }
        return { offline: false, message: error.message };
    }
    
    const offlineResult = handleOfflineError(new Error('Network error'));
    tests.push({
        name: 'Detectare offline',
        passed: typeof offlineResult.offline === 'boolean'
    });
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.passed ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.passed);
}

function testDataValidation() {
    console.log('\n--- Test Validare Date ---');
    
    let tests = [];
    
    // Test 1: Validare email
    function validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email este obligatoriu' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Format email invalid' };
        }
        return { valid: true };
    }
    
    const emailTests = [
        { input: 'test@example.com', expected: true },
        { input: 'invalid-email', expected: false },
        { input: '', expected: false },
        { input: null, expected: false },
        { input: undefined, expected: false }
    ];
    
    emailTests.forEach((test, index) => {
        const result = validateEmail(test.input);
        tests.push({
            name: `Validare email ${index + 1}`,
            passed: result.valid === test.expected
        });
    });
    
    // Test 2: Validare preț
    function validatePrice(price) {
        if (price === null || price === undefined || price === '') {
            return { valid: false, error: 'Prețul este obligatoriu' };
        }
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) {
            return { valid: false, error: 'Prețul trebuie să fie un număr' };
        }
        if (numPrice < 0) {
            return { valid: false, error: 'Prețul nu poate fi negativ' };
        }
        if (numPrice > 999999) {
            return { valid: false, error: 'Prețul este prea mare' };
        }
        return { valid: true, value: numPrice };
    }
    
    const priceTests = [
        { input: '10.50', expected: true },
        { input: '-5', expected: false },
        { input: 'abc', expected: false },
        { input: '', expected: false },
        { input: '1000000', expected: false }
    ];
    
    priceTests.forEach((test, index) => {
        const result = validatePrice(test.input);
        tests.push({
            name: `Validare preț ${index + 1}`,
            passed: result.valid === test.expected
        });
    });
    
    // Test 3: Validare ID
    function validateId(id) {
        if (!id || typeof id !== 'string') {
            return { valid: false, error: 'ID este obligatoriu' };
        }
        if (id.length < 3) {
            return { valid: false, error: 'ID prea scurt' };
        }
        if (id.length > 50) {
            return { valid: false, error: 'ID prea lung' };
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
            return { valid: false, error: 'ID conține caractere invalide' };
        }
        return { valid: true };
    }
    
    const idTests = [
        { input: 'valid-id-123', expected: true },
        { input: 'ab', expected: false },
        { input: 'id with spaces', expected: false },
        { input: '', expected: false },
        { input: 'a'.repeat(51), expected: false }
    ];
    
    idTests.forEach((test, index) => {
        const result = validateId(test.input);
        tests.push({
            name: `Validare ID ${index + 1}`,
            passed: result.valid === test.expected
        });
    });
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.passed ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.passed);
}

function testAsyncErrorHandling() {
    console.log('\n--- Test Gestionare Erori Async ---');
    
    let tests = [];
    
    // Test 1: Promise rejection handling
    function handleAsyncOperation() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Async operation failed'));
            }, 100);
        });
    }
    
    handleAsyncOperation()
        .then(() => {
            tests.push({
                name: 'Promise rejection - ar trebui să eșueze',
                passed: false
            });
        })
        .catch(error => {
            tests.push({
                name: 'Promise rejection - gestionează eroarea',
                passed: error.message === 'Async operation failed'
            });
        });
    
    // Test 2: Async/await error handling
    async function asyncFunctionWithError() {
        try {
            await new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Async error')), 50);
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    asyncFunctionWithError().then(result => {
        tests.push({
            name: 'Async/await error handling',
            passed: result.success === false && result.error === 'Async error'
        });
    });
    
    // Test 3: Multiple async operations
    async function multipleAsyncOperations() {
        const operations = [
            Promise.resolve('success1'),
            Promise.reject(new Error('error1')),
            Promise.resolve('success2')
        ];
        
        const results = await Promise.allSettled(operations);
        return results.map(r => r.status);
    }
    
    multipleAsyncOperations().then(statuses => {
        tests.push({
            name: 'Multiple async operations - allSettled',
            passed: statuses.includes('fulfilled') && statuses.includes('rejected')
        });
    });
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.passed ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.passed);
}

function testUserInputErrorHandling() {
    console.log('\n--- Test Gestionare Erori Input Utilizator ---');
    
    let tests = [];
    
    // Test 1: XSS prevention
    function sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    const xssTests = [
        { input: '<script>alert("xss")</script>', expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;' },
        { input: 'Normal text', expected: 'Normal text' },
        { input: '', expected: '' },
        { input: null, expected: '' }
    ];
    
    xssTests.forEach((test, index) => {
        const result = sanitizeInput(test.input);
        tests.push({
            name: `XSS prevention ${index + 1}`,
            passed: result === test.expected
        });
    });
    
    // Test 2: SQL injection prevention (pentru localStorage)
    function safeQuery(key) {
        if (!key || typeof key !== 'string') {
            return null;
        }
        // Simulăm verificarea pentru caractere periculoase
        const dangerousChars = [';', '--', '/*', '*/', 'xp_', 'sp_'];
        const hasDangerousChars = dangerousChars.some(char => key.includes(char));
        
        if (hasDangerousChars) {
            throw new Error('Input conține caractere periculoase');
        }
        
        return key;
    }
    
    const sqlTests = [
        { input: 'normal_key', expected: 'normal_key' },
        { input: 'key; DROP TABLE', expected: 'Error' },
        { input: 'key--comment', expected: 'Error' },
        { input: '', expected: null }
    ];
    
    sqlTests.forEach((test, index) => {
        try {
            const result = safeQuery(test.input);
            tests.push({
                name: `SQL injection prevention ${index + 1}`,
                passed: result === test.expected
            });
        } catch (error) {
            tests.push({
                name: `SQL injection prevention ${index + 1}`,
                passed: test.expected === 'Error'
            });
        }
    });
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.passed ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.passed);
}

// Rulează toate testele de gestionare a erorilor
async function runErrorHandlingTests() {
    console.log('Încep testarea gestionării erorilor...');
    
    const results = {
        localStorage: testLocalStorageErrorHandling(),
        network: await testNetworkErrorHandling(),
        validation: testDataValidation(),
        async: await testAsyncErrorHandling(),
        userInput: testUserInputErrorHandling()
    };
    
    console.log('\n=== REZULTATE GESTIONARE ERORI ===');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const totalPassed = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\nTotal: ${totalPassed}/${totalTests} teste au trecut`);
    console.log(`Procentaj succes: ${Math.round((totalPassed / totalTests) * 100)}%`);
    
    return results;
}

// Rulează testele
if (typeof window !== 'undefined') {
    window.addEventListener('load', runErrorHandlingTests);
} else {
    // Pentru Node.js
    runErrorHandlingTests().catch(console.error);
}
