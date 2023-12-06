// Firebase認証メソッドをemail/password authenticationに変更
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';

class SignupHandler {
	constructor() {
		this.auth = this.firebaseSetup();
		this.signupForm = document.getElementById('signupForm');
		this.errorMessage = document.getElementById('errorMessage');
		this.addSubmitEventListener();
	}

	firebaseSetup() {
		// Your web app's Firebase configuration
		const firebaseConfig = {
			apiKey: "AIzaSyAt1O_d0v7s8i7mcXcK2F0a2N8hqsOx684",
			authDomain: "foreignar.firebaseapp.com",
			projectId: "foreignar",
			storageBucket: "foreignar.appspot.com",
			messagingSenderId: "133387199847",
			appId: "1:133387199847:web:2a19f1247b3308be767bc2",
			measurementId: "G-GZJ2PP03NB"
		};

		// Firebaseの初期化
		const app = initializeApp(firebaseConfig);
		return getAuth(app);
	}

	addSubmitEventListenerToSignupForm() {
		this.signupForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			let username = document.getElementById('username').value;
			let password = document.getElementById('password').value;

			if (this.submitValidation(username, password)) {
				this.createUser(username, password);
			}
		});
	}

	submitValidation(username, password) {
		if (!username.includes('@')) {
			this.errorMessage.textContent = '有効なE-mailアドレスを入力してください。';
			return false;
		}
		if (password.length < 6) {
			this.errorMessage.textContent = 'パスワードは6文字以上で入力してください。';
			return false;
		}
		return true;
	}

	async createUser(username, password) {
		try {
			const userCredential = await createUserWithEmailAndPassword(this.auth, username, password);
			window.location.href = "signup-success.html";
		} catch (error) {
			this.errorHandling(error);
		}
	}

	errorHandling(error) {
		console.error("エラー:", error);
		switch (error.code) {
			case 'auth/email-already-in-use':
				this.errorMessage.textContent = 'このE-mailアドレスはすでに使用されています。';
				break;
			case 'auth/invalid-email':
				this.errorMessage.textContent = '無効なE-mailアドレスが入力されました。';
				break;
			case 'auth/operation-not-allowed':
				this.errorMessage.textContent = 'この認証方法は現在利用できません。';
				break;
			case 'auth/weak-password':
				this.errorMessage.textContent = 'パスワードが弱すぎます。もう一度確認してください。';
				break;
			case 'auth/user-disabled':
				this.errorMessage.textContent = 'このアカウントは無効化されています。';
				break;
			case 'auth/user-not-found':
				this.errorMessage.textContent = 'アカウントが存在しません。';
				break;
			case 'auth/wrong-password':
				this.errorMessage.textContent = 'パスワードが間違っています。';
				break;
			default:
				this.errorMessage.textContent = error.message; // その他のエラーメッセージを表示
				break;
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new SignupHandler();
});
