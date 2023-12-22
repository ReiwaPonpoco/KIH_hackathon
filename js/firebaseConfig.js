import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';

const firebaseConfig = {
	apiKey: "AIzaSyAt1O_d0v7s8i7mcXcK2F0a2N8hqsOx684",
	authDomain: "foreignar.firebaseapp.com",
	projectId: "foreignar",
	storageBucket: "foreignar.appspot.com",
	messagingSenderId: "133387199847",
	appId: "1:133387199847:web:2a19f1247b3308be767bc2",
	measurementId: "G-GZJ2PP03NB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
