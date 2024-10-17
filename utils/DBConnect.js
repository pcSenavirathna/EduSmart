import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP5lptFTo-RM1RPXuO6m6dnylz32C21xk",
  authDomain: "edusmart-4c3f2.firebaseapp.com",
  projectId: "edusmart-4c3f2",
  storageBucket: "edusmart-4c3f2.appspot.com",
  messagingSenderId: "63846572923",
  appId: "1:63846572923:web:2033e02e06590b932613de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const DB = getFirestore(app);