import { auth, createUserWithEmailAndPassword } from '../firebaseConfig.js';
import { AuthValidation } from './Validation/authValidation.js';
import { AuthErrorHandler } from './errorHandler/authErrorHandler.js';

document.cookie = 'cookieName=value; SameSite=None; Secure';
document.addEventListener('DOMContentLoaded', signup);

function signup() {
	const signupForm = getSignupForm();
	const errorMessage = getSignupErrorMessage();
	const errorHandler = new AuthErrorHandler();

	signupForm.addEventListener('submit', async (event) => {
		event.preventDefault(); // フォームのデフォルトの送信を防止
		const username = getUsername();
		const password = getPassword();

		const validator = new AuthValidation(username, password, errorMessage);
		if (!validator.validate()) {
			return;
		}

		try {
			// ユーザ作成時にFirebase Authへ登録
			const userCredential = await createUserWithEmailAndPassword(auth, username, password);
			// 送信成功時のリダイレクト先
			window.location.href = "signup-success.html";
		} catch (error) {
			errorHandler.handle(error);
		}
	});

	function getSignupForm() {
		return document.getElementById('signupForm');
	}

	function getSignupErrorMessage() {
		return document.getElementById('errorMessage');
	}

	function getUsername() {
		return document.getElementById('username').value;
	}

	function getPassword() {
		return document.getElementById('password').value;
	}
}