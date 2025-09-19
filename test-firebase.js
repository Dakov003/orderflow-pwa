// Test Firebase connection and basic functionality
import { auth, db, analytics } from './src/firebase-config.js';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

console.log('🔥 Testing Firebase connection...');

// Test 1: Check if Firebase services are initialized
console.log('✅ Auth service:', auth ? 'Initialized' : 'Failed');
console.log('✅ Firestore service:', db ? 'Initialized' : 'Failed');
console.log('✅ Analytics service:', analytics ? 'Initialized' : 'Failed');

// Test 2: Test anonymous authentication
async function testAuth() {
    try {
        console.log('🔐 Testing anonymous authentication...');
        const userCredential = await signInAnonymously(auth);
        console.log('✅ Anonymous auth successful:', userCredential.user.uid);
        return userCredential.user.uid;
    } catch (error) {
        console.error('❌ Auth error:', error);
        return null;
    }
}

// Test 3: Test Firestore connection
async function testFirestore(userId) {
    try {
        console.log('📊 Testing Firestore connection...');
        const testCollection = collection(db, `test-${userId}`);
        
        // Add a test document
        const docRef = await addDoc(testCollection, {
            message: 'Firebase test successful!',
            timestamp: new Date(),
            userId: userId
        });
        console.log('✅ Test document added with ID:', docRef.id);
        
        // Read the test document
        const querySnapshot = await getDocs(testCollection);
        console.log('✅ Test documents found:', querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
            console.log('📄 Document data:', doc.data());
        });
        
        return true;
    } catch (error) {
        console.error('❌ Firestore error:', error);
        return false;
    }
}

// Test 4: Test auth state listener
function testAuthState() {
    console.log('👤 Testing auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✅ User is signed in:', user.uid);
        } else {
            console.log('ℹ️ User is signed out');
        }
    });
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
}

// Run all tests
async function runTests() {
    console.log('\n🚀 Starting Firebase tests...\n');
    
    // Test auth state listener
    const unsubscribe = testAuthState();
    
    // Test authentication
    const userId = await testAuth();
    
    if (userId) {
        // Test Firestore
        const firestoreSuccess = await testFirestore(userId);
        
        if (firestoreSuccess) {
            console.log('\n🎉 All Firebase tests passed!');
        } else {
            console.log('\n⚠️ Some Firebase tests failed');
        }
    } else {
        console.log('\n❌ Authentication failed, skipping Firestore tests');
    }
    
    // Cleanup
    unsubscribe();
    console.log('\n✅ Firebase test completed');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { runTests };

