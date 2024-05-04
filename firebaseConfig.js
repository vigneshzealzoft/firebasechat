// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistance, getAuth} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMWuZpaMk8NUWJH2uwrucFy5mF3ILinMg",
  authDomain: "fire-chat-e1c38.firebaseapp.com",
  projectId: "fire-chat-e1c38",
  storageBucket: "fire-chat-e1c38.appspot.com",
  messagingSenderId: "1046790364621",
  appId: "1:1046790364621:web:386e347e995bd61a54f884"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db= getFirestore(app)

export const userRef =collection(db, "users");
export const roomRef=collection(db, 'rooms');
export const messagesRef = (roomId) => collection(db, 'rooms', roomId, 'messages');
export {db}