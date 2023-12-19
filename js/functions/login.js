import { auth, signInWithEmailAndPassword } from '../firebaseConfig.js';
import submitValidation from './Validation/authValidation.js';
import AuthErrorHandler from './errorHandler/authErrorHandler.js';

document.cookie = 'cookieName=value; SameSite=None; Secure';
document.addEventListener('DOMContentLoaded', () => {
	login();
});

function login() {
	const loginForm = getLoginForm();
	const loginErrorMessage = getLoginErrorMessage();
	const errorHandler = new AuthErrorHandler();

	loginForm.addEventListener('submit', async (event) => {
		event.preventDefault(); // フォームのデフォルトの送信を防止
		const username = getUsername();
		const password = getPassword();

		if (!submitValidation(username, password)) {
			return;
		}

		try {
			// ユーザーログイン
			const userCredential = await signInWithEmailAndPassword(auth, username, password);
			// 送信成功時のリダイレクト先
			window.location.href = "login-success.html"; // リダイレクト先のファイルを指定します

		} catch (error) {
			errorHandling(error);
		}
	});

	function getLoginForm() {
		return document.getElementById('loginForm');
	}

	function getLoginErrorMessage() {
		document.getElementById('loginErrorMessage');
	}

	function getUsername() {
		return document.getElementById('username').value;
	}

	function getPassword() {
		document.getElementById('password').value;
	}
}