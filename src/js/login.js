document.cookie = 'cookieName=value; SameSite=None; Secure';
// Firebase モジュールを npm 経由でインポート
const firebase = require('firebase/app');
require('firebase/auth');

// Firebase の設定
const firebaseConfig = {
	apiKey: "AIzaSyAt1O_d0v7s8i7mcXcK2F0a2N8hqsOx684",
	authDomain: "foreignar.firebaseapp.com",
	projectId: "foreignar",
	storageBucket: "foreignar.appspot.com",
	messagingSenderId: "133387199847",
	appId: "1:133387199847:web:2a19f1247b3308be767bc2",
	measurementId: "G-GZJ2PP03NB"
};

// Firebase の初期化
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('loginForm');
	const loginErrorMessage = document.getElementById('loginErrorMessage');

	loginForm.addEventListener('submit', async (event) => {
		event.preventDefault(); // フォームのデフォルトの送信を防止

		var loginEmail = document.getElementById('loginEmail').value;
		var loginPassword = document.getElementById('loginPassword').value;

		try {
			// ユーザーログイン
			const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

			// ログイン成功時の処理
			window.location.href = "login-success.html"; // リダイレクト先のファイルを指定します

		} catch (error) {
			console.error("エラー:", error);
			switch (error.code) {
				case 'auth/invalid-email':
					loginErrorMessage.textContent = '無効なE-mailアドレスが入力されました。';
					break;
				case 'auth/user-disabled':
					loginErrorMessage.textContent = 'このアカウントは無効化されています。';
					break;
				case 'auth/user-not-found':
					loginErrorMessage.textContent = 'アカウントが存在しません。';
					break;
				case 'auth/wrong-password':
					loginErrorMessage.textContent = 'パスワードが間違っています。';
					break;
				default:
					loginErrorMessage.textContent = error.message; // その他のエラーメッセージを表示
					break;
			}
		}
	});
});
