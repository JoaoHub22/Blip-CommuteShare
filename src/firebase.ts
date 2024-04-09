// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    NextOrObserver,
    User,
    createUserWithEmailAndPassword
} from 'firebase/auth';
//import firebase from 'firebase/compat/app';
// Required for side-effects
import 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDsAJ_qc_XlS-l7i1q8S8jzjutZe7i-uOo',
    authDomain: 'blip---commuteshare.firebaseapp.com',
    projectId: 'blip---commuteshare',
    storageBucket: 'blip---commuteshare.appspot.com',
    messagingSenderId: '574154641230',
    appId: '1:574154641230:web:d5e06af91c72a92fce581f'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;

export const CreateAccount = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email: string, password: string) => {
    if (!email && !password) return;

    return signInWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (callback: NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => signOut(auth);
