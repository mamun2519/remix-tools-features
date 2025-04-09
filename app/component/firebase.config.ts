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

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBhT-_yBOTZVvL_Jxty6gU5EFWHlQw1Q24",
//   authDomain: "access-2df8b.firebaseapp.com",
//   projectId: "access-2df8b",
//   storageBucket: "access-2df8b.firebasestorage.app",
//   messagingSenderId: "242935886051",
//   appId: "1:242935886051:web:efba16dab5310e18c055d6",
//   measurementId: "G-HV2N470W5G"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
