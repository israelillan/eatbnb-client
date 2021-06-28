import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCLw4W54659gRETKYzE8erVJ_DJrgn7Hbw",
    authDomain: "eatbnb-c2e67.firebaseapp.com",
    projectId: "eatbnb-c2e67",
    storageBucket: "eatbnb-c2e67.appspot.com",
    messagingSenderId: "294216752440",
    appId: "1:294216752440:web:3d4574661c3456c091b5cd",
    measurementId: "G-YLX1KT9BD9"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();