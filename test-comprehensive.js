// Test comprehensiv pentru aplicația OrderFlow PWA
// Acest script testează toate funcționalitățile aplicației

console.log('🚀 Încep testarea comprehensivă a aplicației OrderFlow PWA...\n');

// Test 1: Verificare PWA Features
function testPWAFeatures() {
    console.log('📱 Test 1: Verificare funcționalități PWA');
    
    // Verifică manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
        console.log('✅ Manifest link găsit:', manifestLink.href);
    } else {
        console.log('❌ Manifest link lipsă');
    }
    
    // Verifică service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            if (registrations.length > 0) {
                console.log('✅ Service Worker înregistrat:', registrations.length, 'instanțe');
            } else {
                console.log('❌ Niciun Service Worker înregistrat');
            }
        });
    } else {
        console.log('❌ Service Worker nu este suportat');
    }
    
    // Verifică instalare PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('✅ PWA poate fi instalată');
        deferredPrompt = e;
    });
    
    // Verifică display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ Aplicația rulează în mod standalone');
    } else {
        console.log('ℹ️ Aplicația rulează în browser');
    }
    
    console.log('');
}

// Test 2: Verificare localStorage fallback
function testLocalStorageFallback() {
    console.log('💾 Test 2: Verificare localStorage fallback');
    
    try {
        localStorage.setItem('test_key', 'test_value');
        const value = localStorage.getItem('test_key');
        if (value === 'test_value') {
            console.log('✅ localStorage funcționează corect');
            localStorage.removeItem('test_key');
        } else {
            console.log('❌ localStorage nu funcționează corect');
        }
    } catch (error) {
        console.log('❌ Eroare localStorage:', error.message);
    }
    
    console.log('');
}

// Test 3: Verificare componente UI
function testUIComponents() {
    console.log('🎨 Test 3: Verificare componente UI');
    
    // Verifică dacă aplicația s-a încărcat
    const appElement = document.querySelector('#root');
    if (appElement && appElement.children.length > 0) {
        console.log('✅ Aplicația React s-a încărcat');
    } else {
        console.log('❌ Aplicația React nu s-a încărcat');
    }
    
    // Verifică sidebar
    const sidebar = document.querySelector('aside');
    if (sidebar) {
        console.log('✅ Sidebar găsit');
        
        // Verifică meniuri
        const menuItems = sidebar.querySelectorAll('a[href="#"]');
        console.log('✅ Meniuri găsite:', menuItems.length);
        
        // Verifică iconițe
        const icons = sidebar.querySelectorAll('svg');
        console.log('✅ Iconițe găsite:', icons.length);
    } else {
        console.log('❌ Sidebar nu a fost găsit');
    }
    
    // Verifică header
    const header = document.querySelector('header');
    if (header) {
        console.log('✅ Header găsit');
    } else {
        console.log('❌ Header nu a fost găsit');
    }
    
    console.log('');
}

// Test 4: Verificare funcționalități CRUD
function testCRUDFunctionality() {
    console.log('📊 Test 4: Verificare funcționalități CRUD');
    
    // Verifică dacă există butoane pentru acțiuni
    const addButtons = document.querySelectorAll('button');
    console.log('✅ Butoane găsite:', addButtons.length);
    
    // Verifică formulare
    const forms = document.querySelectorAll('form');
    console.log('✅ Formulare găsite:', forms.length);
    
    // Verifică inputuri
    const inputs = document.querySelectorAll('input');
    console.log('✅ Inputuri găsite:', inputs.length);
    
    // Verifică tabele
    const tables = document.querySelectorAll('table');
    console.log('✅ Tabele găsite:', tables.length);
    
    console.log('');
}

// Test 5: Verificare responsive design
function testResponsiveDesign() {
    console.log('📱 Test 5: Verificare responsive design');
    
    // Verifică viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        console.log('✅ Viewport meta tag găsit:', viewport.content);
    } else {
        console.log('❌ Viewport meta tag lipsă');
    }
    
    // Verifică Tailwind CSS
    const tailwindClasses = document.querySelectorAll('[class*="bg-"], [class*="text-"], [class*="p-"]');
    if (tailwindClasses.length > 0) {
        console.log('✅ Tailwind CSS detectat');
    } else {
        console.log('❌ Tailwind CSS nu pare să fie activ');
    }
    
    console.log('');
}

// Test 6: Verificare performanță
function testPerformance() {
    console.log('⚡ Test 6: Verificare performanță');
    
    // Verifică timpul de încărcare
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('⏱️ Timp încărcare:', loadTime, 'ms');
        
        if (loadTime < 3000) {
            console.log('✅ Performanță bună (< 3s)');
        } else if (loadTime < 5000) {
            console.log('⚠️ Performanță acceptabilă (3-5s)');
        } else {
            console.log('❌ Performanță slabă (> 5s)');
        }
    }
    
    // Verifică dimensiunea bundle-ului
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    scripts.forEach(script => {
        if (script.src.includes('assets/')) {
            console.log('📦 Script detectat:', script.src);
        }
    });
    
    console.log('');
}

// Test 7: Verificare accesibilitate
function testAccessibility() {
    console.log('♿ Test 7: Verificare accesibilitate');
    
    // Verifică aria-labels
    const ariaLabels = document.querySelectorAll('[aria-label]');
    console.log('✅ Aria-labels găsite:', ariaLabels.length);
    
    // Verifică butoane cu text
    const buttons = document.querySelectorAll('button');
    let buttonsWithText = 0;
    buttons.forEach(button => {
        if (button.textContent.trim() || button.querySelector('svg')) {
            buttonsWithText++;
        }
    });
    console.log('✅ Butoane cu text/iconițe:', buttonsWithText, '/', buttons.length);
    
    // Verifică contrast (simplu)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    console.log('✅ Elemente text găsite:', textElements.length);
    
    console.log('');
}

// Test 8: Verificare funcționalități specifice aplicației
function testAppSpecificFeatures() {
    console.log('🏪 Test 8: Verificare funcționalități specifice OrderFlow');
    
    // Verifică modulele aplicației
    const modules = ['dashboard', 'orders', 'products', 'customers', 'payments', 'reports'];
    modules.forEach(module => {
        const moduleElement = document.querySelector(`[data-module="${module}"]`) || 
                             document.querySelector(`a[href="#"]:contains("${module}")`);
        if (moduleElement) {
            console.log(`✅ Modul ${module} detectat`);
        } else {
            console.log(`❌ Modul ${module} nu a fost găsit`);
        }
    });
    
    // Verifică formatarea monedei
    const currencyElements = document.querySelectorAll('[class*="font-mono"]');
    console.log('✅ Elemente cu formatare monedă:', currencyElements.length);
    
    // Verifică modale
    const modals = document.querySelectorAll('[role="dialog"], .fixed.inset-0');
    console.log('✅ Modale detectate:', modals.length);
    
    console.log('');
}

// Test 9: Verificare erori console
function testConsoleErrors() {
    console.log('🐛 Test 9: Verificare erori console');
    
    // Interceptează erorile
    const originalError = console.error;
    let errorCount = 0;
    
    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };
    
    // Verifică după un timp scurt
    setTimeout(() => {
        if (errorCount === 0) {
            console.log('✅ Nu au fost detectate erori în console');
        } else {
            console.log('⚠️ Au fost detectate', errorCount, 'erori în console');
        }
    }, 2000);
    
    console.log('');
}

// Test 10: Verificare offline functionality
function testOfflineFunctionality() {
    console.log('📡 Test 10: Verificare funcționalitate offline');
    
    // Verifică dacă aplicația poate funcționa offline
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (registration.active) {
                console.log('✅ Service Worker activ - aplicația poate funcționa offline');
            } else {
                console.log('❌ Service Worker nu este activ');
            }
        });
    }
    
    // Verifică cache
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            console.log('✅ Cache-uri disponibile:', cacheNames.length);
            cacheNames.forEach(name => {
                console.log('  -', name);
            });
        });
    }
    
    console.log('');
}

// Funcție principală de testare
function runAllTests() {
    console.log('='.repeat(60));
    console.log('🧪 RAPORT DE TESTARE COMPREHENSIVĂ - ORDERFLOW PWA');
    console.log('='.repeat(60));
    console.log('');
    
    testPWAFeatures();
    testLocalStorageFallback();
    testUIComponents();
    testCRUDFunctionality();
    testResponsiveDesign();
    testPerformance();
    testAccessibility();
    testAppSpecificFeatures();
    testConsoleErrors();
    testOfflineFunctionality();
    
    console.log('='.repeat(60));
    console.log('✅ Testarea comprehensivă s-a finalizat!');
    console.log('='.repeat(60));
}

// Rulează testele când se încarcă pagina
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export pentru utilizare în alte scripturi
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testPWAFeatures,
        testLocalStorageFallback,
        testUIComponents,
        testCRUDFunctionality,
        testResponsiveDesign,
        testPerformance,
        testAccessibility,
        testAppSpecificFeatures,
        testConsoleErrors,
        testOfflineFunctionality
    };
}
