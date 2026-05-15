import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Habilitar persistencia de datos offline
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Múltiples pestañas abiertas, la persistencia solo puede habilitarse en una.
            console.warn('Persistence failed-precondition: multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // El navegador no soporta persistencia.
            console.warn('Persistence unimplemented: browser not supported');
        }
    });
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
