import firebase from "firebase/app";
import "firebase/database";
const config = {
    apiKey: "AIzaSyDEdJIf-wp6XObs7opXXQxPNjAOuwadnUI",
    authDomain: "lifter-be138.firebaseapp.com",
    projectId: "lifter-be138",
    storageBucket: "lifter-be138.appspot.com",
    messagingSenderId: "671198474745",
    appId: "1:671198474745:web:08427305386eb4c43b4d28"
}
firebase.initializeApp(config);
export default firebase.database();