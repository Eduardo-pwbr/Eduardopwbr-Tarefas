import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBo3yFRW4ckeYstYf51yKT5jgl_JfZWqwg",
  authDomain: "curso-f6efc.firebaseapp.com",
  projectId: "curso-f6efc",
  storageBucket: "curso-f6efc.firebasestorage.app",
  messagingSenderId: "515690181646",
  appId: "1:515690181646:web:fe18b119549a2f98f0785f"
};



// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//initialize authentication
const auth = getAuth(firebaseApp);

//initialize firestore 
const db = getFirestore(firebaseApp);

export {db, auth};