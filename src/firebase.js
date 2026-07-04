import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCrF_INEtL9bZKAoDPYCuTaVMRWGAdbcew",
    authDomain: "splendids-academy-v2.firebaseapp.com",
    projectId: "splendids-academy-v2",
    storageBucket: "splendids-academy-v2.firebasestorage.app",
    messagingSenderId: "573697150601",
    appId: "1:573697150601:web:74c556c85b6be053018058",
    measurementId: "G-VVDT1PMHNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
