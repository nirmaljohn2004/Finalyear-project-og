// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxy-D_lahElKkWkdJ9c8xrMKqgFAeNmmM",
    authDomain: "evocode-og.firebaseapp.com",
    projectId: "evocode-og",
    storageBucket: "evocode-og.firebasestorage.app",
    messagingSenderId: "627085114942",
    appId: "1:627085114942:web:d7181e79dfe0b1de481b6f",
    measurementId: "G-LNZEK2LXFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);