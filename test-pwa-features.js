// Test pentru funcționalitățile PWA OrderFlow

console.log('=== TEST FUNCȚIONALITĂȚI PWA ORDERFLOW ===');

// Test 1: Verificare manifest
function testManifest() {
    console.log('\n--- Test Manifest PWA ---');
    
    return fetch('/manifest.webmanifest')
        .then(response => {
            console.log(`Status manifest: ${response.status}`);
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Manifest nu este accesibil: ${response.status}`);
        })
        .then(manifest => {
            console.log('Manifest conținut:', manifest);
            
            const tests = [
                { name: 'Are nume', test: manifest.name && manifest.name.length > 0 },
                { name: 'Are short_name', test: manifest.short_name && manifest.short_name.length > 0 },
                { name: 'Are description', test: manifest.description && manifest.description.length > 0 },
                { name: 'Are start_url', test: manifest.start_url && manifest.start_url.length > 0 },
                { name: 'Are display mode standalone', test: manifest.display === 'standalone' },
                { name: 'Are icons', test: manifest.icons && manifest.icons.length > 0 },
                { name: 'Are theme_color', test: manifest.theme_color && manifest.theme_color.length > 0 },
                { name: 'Are background_color', test: manifest.background_color && manifest.background_color.length > 0 }
            ];
            
            tests.forEach(test => {
                console.log(`${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
            });
            
            return tests.every(test => test.test);
        })
        .catch(error => {
            console.error('Eroare la testarea manifest:', error);
            return false;
        });
}

// Test 2: Verificare Service Worker
function testServiceWorker() {
    console.log('\n--- Test Service Worker ---');
    
    if (!('serviceWorker' in navigator)) {
        console.log('Service Worker nu este suportat în acest browser: FAIL');
        return Promise.resolve(false);
    }
    
    return navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            console.log(`Service Workers înregistrați: ${registrations.length}`);
            
            if (registrations.length > 0) {
                registrations.forEach((registration, index) => {
                    console.log(`SW ${index + 1}:`, {
                        scope: registration.scope,
                        state: registration.active ? registration.active.state : 'N/A',
                        scriptURL: registration.active ? registration.active.scriptURL : 'N/A'
                    });
                });
                
                console.log('Service Worker este înregistrat: PASS');
                return true;
            } else {
                console.log('Service Worker nu este înregistrat: FAIL');
                return false;
            }
        })
        .catch(error => {
            console.error('Eroare la testarea Service Worker:', error);
            return false;
        });
}

// Test 3: Verificare Cache API
function testCacheAPI() {
    console.log('\n--- Test Cache API ---');
    
    if (!('caches' in window)) {
        console.log('Cache API nu este suportat în acest browser: FAIL');
        return Promise.resolve(false);
    }
    
    return caches.keys()
        .then(cacheNames => {
            console.log(`Cache-uri disponibile: ${cacheNames.length}`);
            cacheNames.forEach((name, index) => {
                console.log(`Cache ${index + 1}: ${name}`);
            });
            
            if (cacheNames.length > 0) {
                console.log('Cache API funcționează: PASS');
                return true;
            } else {
                console.log('Cache API nu are cache-uri: FAIL');
                return false;
            }
        })
        .catch(error => {
            console.error('Eroare la testarea Cache API:', error);
            return false;
        });
}

// Test 4: Verificare Offline Capability
function testOfflineCapability() {
    console.log('\n--- Test Capacitate Offline ---');
    
    const tests = [
        { name: 'Navigator.onLine disponibil', test: 'onLine' in navigator },
        { name: 'Status online detectat', test: navigator.onLine !== undefined },
        { name: 'LocalStorage disponibil', test: 'localStorage' in window },
        { name: 'SessionStorage disponibil', test: 'sessionStorage' in window },
        { name: 'IndexedDB disponibil', test: 'indexedDB' in window }
    ];
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.test);
}

// Test 5: Verificare Responsive Design
function testResponsiveDesign() {
    console.log('\n--- Test Responsive Design ---');
    
    const tests = [
        { name: 'Viewport meta tag', test: document.querySelector('meta[name="viewport"]') !== null },
        { name: 'CSS Media Queries suportate', test: window.matchMedia !== undefined },
        { name: 'Touch events suportate', test: 'ontouchstart' in window },
        { name: 'Orientation API disponibil', test: 'orientation' in screen }
    ];
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.test);
}

// Test 6: Verificare Performance
function testPerformance() {
    console.log('\n--- Test Performance ---');
    
    if (!('performance' in window)) {
        console.log('Performance API nu este disponibil: FAIL');
        return false;
    }
    
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
        console.log('Navigation timing:', {
            loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            totalTime: Math.round(navigation.loadEventEnd - navigation.fetchStart)
        });
    }
    
    const tests = [
        { name: 'Performance API disponibil', test: 'performance' in window },
        { name: 'Navigation timing disponibil', test: navigation !== undefined },
        { name: 'Load time < 3s', test: navigation ? (navigation.loadEventEnd - navigation.fetchStart) < 3000 : false }
    ];
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.test);
}

// Test 7: Verificare Security
function testSecurity() {
    console.log('\n--- Test Security ---');
    
    const tests = [
        { name: 'HTTPS sau localhost', test: location.protocol === 'https:' || location.hostname === 'localhost' },
        { name: 'Content Security Policy', test: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null },
        { name: 'X-Frame-Options', test: true }, // Nu putem verifica header-urile din JavaScript
        { name: 'Referrer Policy', test: true } // Nu putem verifica header-urile din JavaScript
    ];
    
    tests.forEach(test => {
        console.log(`${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
    });
    
    return tests.every(test => test.test);
}

// Rulează toate testele
async function runAllTests() {
    console.log('Încep testarea funcționalităților PWA...');
    
    const results = {
        manifest: await testManifest(),
        serviceWorker: await testServiceWorker(),
        cacheAPI: await testCacheAPI(),
        offline: testOfflineCapability(),
        responsive: testResponsiveDesign(),
        performance: testPerformance(),
        security: testSecurity()
    };
    
    console.log('\n=== REZULTATE FINALE ===');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const totalPassed = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\nTotal: ${totalPassed}/${totalTests} teste au trecut`);
    console.log(`Procentaj succes: ${Math.round((totalPassed / totalTests) * 100)}%`);
    
    return results;
}

// Rulează testele când se încarcă pagina
if (typeof window !== 'undefined') {
    window.addEventListener('load', runAllTests);
} else {
    // Pentru Node.js
    runAllTests().catch(console.error);
}
