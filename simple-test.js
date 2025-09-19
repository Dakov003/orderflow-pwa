// Test simplu pentru a identifica problema
console.log('🚀 Testând aplicația OrderFlow...');

try {
    // Test 1: Verifică dacă modulele se încarcă
    console.log('📦 Testând importurile...');
    
    // Test Firebase config
    const { firebaseConfig } = await import('./src/firebase-config.js');
    console.log('✅ Firebase config:', firebaseConfig.projectId);
    
    // Test App component
    const AppModule = await import('./src/App.jsx');
    console.log('✅ App component încărcat');
    
    console.log('🎉 Toate testele au trecut!');
    
} catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
}
