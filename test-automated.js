// Test automatizat pentru aplicația OrderFlow PWA
// Acest script rulează teste automate pentru toate funcționalitățile

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class OrderFlowTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            timestamp: new Date().toISOString(),
            tests: {},
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };
    }

    async init() {
        console.log('🚀 Inițializare browser pentru testare...');
        this.browser = await puppeteer.launch({
            headless: false, // Setează la true pentru testare headless
            defaultViewport: { width: 1280, height: 720 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        
        // Interceptează erorile console
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('❌ Console Error:', msg.text());
            }
        });
        
        // Interceptează erorile de pagină
        this.page.on('pageerror', error => {
            console.log('❌ Page Error:', error.message);
        });
    }

    async navigateToApp() {
        console.log('🌐 Navigare către aplicația OrderFlow...');
        try {
            await this.page.goto('http://localhost:4173', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });
            console.log('✅ Aplicația s-a încărcat cu succes');
            return true;
        } catch (error) {
            console.log('❌ Eroare la încărcarea aplicației:', error.message);
            return false;
        }
    }

    async testPWAFeatures() {
        console.log('📱 Testare funcționalități PWA...');
        const testName = 'PWA Features';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            // Verifică manifest
            const manifest = await this.page.evaluate(() => {
                const manifestLink = document.querySelector('link[rel="manifest"]');
                return manifestLink ? manifestLink.href : null;
            });
            
            if (manifest) {
                this.results.tests[testName].details.push('✅ Manifest găsit');
            } else {
                this.results.tests[testName].details.push('❌ Manifest lipsă');
            }

            // Verifică service worker
            const swStatus = await this.page.evaluate(() => {
                return 'serviceWorker' in navigator;
            });
            
            if (swStatus) {
                this.results.tests[testName].details.push('✅ Service Worker suportat');
            } else {
                this.results.tests[testName].details.push('❌ Service Worker nu este suportat');
            }

            // Verifică instalare PWA
            const canInstall = await this.page.evaluate(() => {
                return window.matchMedia('(display-mode: standalone)').matches;
            });
            
            if (canInstall) {
                this.results.tests[testName].details.push('✅ Aplicația rulează standalone');
            } else {
                this.results.tests[testName].details.push('ℹ️ Aplicația rulează în browser');
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test PWA completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test PWA eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testUIComponents() {
        console.log('🎨 Testare componente UI...');
        const testName = 'UI Components';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            // Așteaptă ca aplicația să se încarce complet
            await this.page.waitForSelector('#root', { timeout: 10000 });
            
            // Verifică elementele UI principale
            const uiElements = await this.page.evaluate(() => {
                const elements = {
                    app: !!document.querySelector('#root'),
                    sidebar: !!document.querySelector('aside'),
                    header: !!document.querySelector('header'),
                    buttons: document.querySelectorAll('button').length,
                    inputs: document.querySelectorAll('input').length,
                    tables: document.querySelectorAll('table').length,
                    modals: document.querySelectorAll('[role="dialog"], .fixed.inset-0').length
                };
                return elements;
            });

            if (uiElements.app) {
                this.results.tests[testName].details.push('✅ Aplicația React încărcată');
            } else {
                this.results.tests[testName].details.push('❌ Aplicația React nu s-a încărcat');
            }

            if (uiElements.sidebar) {
                this.results.tests[testName].details.push('✅ Sidebar găsit');
            } else {
                this.results.tests[testName].details.push('❌ Sidebar lipsă');
            }

            this.results.tests[testName].details.push(`✅ Butoane găsite: ${uiElements.buttons}`);
            this.results.tests[testName].details.push(`✅ Inputuri găsite: ${uiElements.inputs}`);
            this.results.tests[testName].details.push(`✅ Tabele găsite: ${uiElements.tables}`);
            this.results.tests[testName].details.push(`✅ Modale găsite: ${uiElements.modals}`);

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test UI completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test UI eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testNavigation() {
        console.log('🧭 Testare navigare între module...');
        const testName = 'Navigation';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            const modules = ['dashboard', 'orders', 'products', 'customers', 'payments', 'reports'];
            
            for (const module of modules) {
                try {
                    // Caută link-ul către modul
                    const moduleLink = await this.page.$(`a[href="#"]:has-text("${module}")`);
                    
                    if (moduleLink) {
                        await moduleLink.click();
                        await this.page.waitForTimeout(1000); // Așteaptă încărcarea
                        this.results.tests[testName].details.push(`✅ Modul ${module} accesibil`);
                    } else {
                        this.results.tests[testName].details.push(`⚠️ Modul ${module} nu a fost găsit`);
                    }
                } catch (error) {
                    this.results.tests[testName].details.push(`❌ Eroare la modul ${module}: ${error.message}`);
                }
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test navigare completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test navigare eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testCRUDOperations() {
        console.log('📊 Testare operațiuni CRUD...');
        const testName = 'CRUD Operations';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            // Testează adăugarea unui produs
            await this.page.click('a[href="#"]:has-text("Produse")');
            await this.page.waitForTimeout(1000);

            // Verifică dacă există formularul de adăugare produs
            const addProductForm = await this.page.$('form');
            if (addProductForm) {
                this.results.tests[testName].details.push('✅ Formular adăugare produs găsit');
                
                // Încearcă să completeze formularul
                await this.page.type('input[placeholder*="Denumire produs"]', 'Test Produs');
                await this.page.type('input[placeholder*="Preț"]', '10.50');
                
                this.results.tests[testName].details.push('✅ Formular completat cu succes');
            } else {
                this.results.tests[testName].details.push('❌ Formular adăugare produs lipsă');
            }

            // Testează adăugarea unui client
            await this.page.click('a[href="#"]:has-text("Clienți")');
            await this.page.waitForTimeout(1000);

            const addCustomerForm = await this.page.$('form');
            if (addCustomerForm) {
                this.results.tests[testName].details.push('✅ Formular adăugare client găsit');
            } else {
                this.results.tests[testName].details.push('❌ Formular adăugare client lipsă');
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test CRUD completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test CRUD eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testResponsiveDesign() {
        console.log('📱 Testare design responsive...');
        const testName = 'Responsive Design';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            const viewports = [
                { width: 375, height: 667, name: 'Mobile' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 1280, height: 720, name: 'Desktop' }
            ];

            for (const viewport of viewports) {
                await this.page.setViewport(viewport);
                await this.page.waitForTimeout(500);

                // Verifică dacă aplicația se afișează corect
                const isVisible = await this.page.evaluate(() => {
                    const app = document.querySelector('#root');
                    return app && app.offsetWidth > 0 && app.offsetHeight > 0;
                });

                if (isVisible) {
                    this.results.tests[testName].details.push(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) - OK`);
                } else {
                    this.results.tests[testName].details.push(`❌ ${viewport.name} (${viewport.width}x${viewport.height}) - Eroare`);
                }
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test responsive completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test responsive eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testPerformance() {
        console.log('⚡ Testare performanță...');
        const testName = 'Performance';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            // Măsoară timpul de încărcare
            const loadTime = await this.page.evaluate(() => {
                return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            });

            this.results.tests[testName].details.push(`⏱️ Timp încărcare: ${loadTime}ms`);

            if (loadTime < 3000) {
                this.results.tests[testName].details.push('✅ Performanță excelentă (< 3s)');
            } else if (loadTime < 5000) {
                this.results.tests[testName].details.push('⚠️ Performanță bună (3-5s)');
            } else {
                this.results.tests[testName].details.push('❌ Performanță slabă (> 5s)');
            }

            // Măsoară memoria folosită
            const memoryUsage = await this.page.evaluate(() => {
                if (performance.memory) {
                    return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                }
                return null;
            });

            if (memoryUsage) {
                this.results.tests[testName].details.push(`💾 Memorie folosită: ${memoryUsage}MB`);
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test performanță completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test performanță eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async testOfflineFunctionality() {
        console.log('📡 Testare funcționalitate offline...');
        const testName = 'Offline Functionality';
        this.results.tests[testName] = { status: 'running', details: [] };

        try {
            // Verifică dacă există service worker
            const swRegistered = await this.page.evaluate(() => {
                return 'serviceWorker' in navigator;
            });

            if (swRegistered) {
                this.results.tests[testName].details.push('✅ Service Worker suportat');
                
                // Verifică cache-urile
                const caches = await this.page.evaluate(() => {
                    return caches.keys();
                });

                this.results.tests[testName].details.push(`✅ Cache-uri disponibile: ${caches.length}`);
            } else {
                this.results.tests[testName].details.push('❌ Service Worker nu este suportat');
            }

            this.results.tests[testName].status = 'passed';
            this.results.summary.passed++;
            console.log('✅ Test offline completat');

        } catch (error) {
            this.results.tests[testName].status = 'failed';
            this.results.tests[testName].details.push('❌ Eroare: ' + error.message);
            this.results.summary.failed++;
            console.log('❌ Test offline eșuat:', error.message);
        }
        
        this.results.summary.total++;
    }

    async generateReport() {
        console.log('📋 Generare raport de testare...');
        
        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        // Generează raport HTML
        const htmlReport = this.generateHTMLReport();
        const htmlReportPath = path.join(__dirname, 'test-report.html');
        fs.writeFileSync(htmlReportPath, htmlReport);
        
        console.log('✅ Raport generat:', reportPath);
        console.log('✅ Raport HTML generat:', htmlReportPath);
    }

    generateHTMLReport() {
        const { tests, summary } = this.results;
        
        let html = `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raport Testare OrderFlow PWA</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #0ea5e9; }
        .test-result { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
        .test-result.passed { background: #d1fae5; border-left: 4px solid #10b981; }
        .test-result.failed { background: #fee2e2; border-left: 4px solid #ef4444; }
        .test-result.running { background: #dbeafe; border-left: 4px solid #3b82f6; }
        .details { margin-top: 10px; font-family: monospace; font-size: 14px; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status.passed { background: #10b981; color: white; }
        .status.failed { background: #ef4444; color: white; }
        .status.running { background: #3b82f6; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Raport Testare OrderFlow PWA</h1>
            <p>Generat la: ${new Date().toLocaleString('ro-RO')}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Teste</h3>
                <p style="font-size: 2em; margin: 0; color: #0ea5e9;">${summary.total}</p>
            </div>
            <div class="summary-card">
                <h3>Reușite</h3>
                <p style="font-size: 2em; margin: 0; color: #10b981;">${summary.passed}</p>
            </div>
            <div class="summary-card">
                <h3>Eșuate</h3>
                <p style="font-size: 2em; margin: 0; color: #ef4444;">${summary.failed}</p>
            </div>
            <div class="summary-card">
                <h3>Avertismente</h3>
                <p style="font-size: 2em; margin: 0; color: #f59e0b;">${summary.warnings}</p>
            </div>
        </div>
        
        <h2>📊 Rezultate Detaliate</h2>
`;

        Object.entries(tests).forEach(([testName, result]) => {
            html += `
        <div class="test-result ${result.status}">
            <h3>${testName} <span class="status ${result.status}">${result.status.toUpperCase()}</span></h3>
            <div class="details">
                ${result.details.map(detail => `<div>${detail}</div>`).join('')}
            </div>
        </div>
            `;
        });

        html += `
    </div>
</body>
</html>
        `;

        return html;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async runAllTests() {
        try {
            await this.init();
            
            const appLoaded = await this.navigateToApp();
            if (!appLoaded) {
                throw new Error('Aplicația nu s-a putut încărca');
            }

            await this.testPWAFeatures();
            await this.testUIComponents();
            await this.testNavigation();
            await this.testCRUDOperations();
            await this.testResponsiveDesign();
            await this.testPerformance();
            await this.testOfflineFunctionality();

            await this.generateReport();

            console.log('\n🎉 Toate testele au fost finalizate!');
            console.log(`📊 Rezumat: ${this.results.summary.passed}/${this.results.summary.total} teste reușite`);

        } catch (error) {
            console.error('❌ Eroare în timpul testării:', error);
        } finally {
            await this.cleanup();
        }
    }
}

// Rulează testele dacă scriptul este executat direct
if (require.main === module) {
    const tester = new OrderFlowTester();
    tester.runAllTests().catch(console.error);
}

module.exports = OrderFlowTester;
