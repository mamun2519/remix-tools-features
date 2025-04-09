// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnLPKYgVPrTc1qgMvhszfTMkQICd6T0NQ",
  authDomain: "test-marketplace-ed91e.firebaseapp.com",
  projectId: "test-marketplace-ed91e",
  storageBucket: "test-marketplace-ed91e.appspot.com",
  messagingSenderId: "782040801444",
  appId: "1:782040801444:web:01b9cb5378aa85bb804631",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
