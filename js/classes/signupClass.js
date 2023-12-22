import { auth, createUserWithEmailAndPassword } from '../firebaseConfig.js';

class Signup {
	constructor() {
		this.signupForm = this.getSignupForm();
		this.errorMessage = this.getErrorMessage();
	}

	signupAuthentication() {
		this.signupForm.addEventListener('submit', async (event) => {
			event.preventDefault(); // フォームのデフォルトの送信を防止
			const username = this.getUsername();
			const password = this.getPassword();

			if (!this.submitValidation(username, password)) {
				return;
			}

			try {
				// ユーザ作成時にFirebase Authへ登録
				const userCredential = await createUserWithEmailAndPassword(auth, username, password);
				// 送信成功時のリダイレクト先
				window.location.href = "signup-success.html";
			} catch (error) {
				this.errorHandling(error);
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

	get getSignupForm() {
		return document.getElementById('signupForm');
	}

	get getErrorMessage() {
		return document.getElementById('errorMessage');
	}

	get getUsername() {
		return document.getElementById('username').value;
	}

	get getPassword() {
		document.getElementById('password').value;
	}
}

/**
 * HTMLがロードされてからSignupインスタンスを作成
 */
document.cookie = 'cookieName=value; SameSite=None; Secure';
document.addEventListener('DOMContentLoaded', () => {
	const signup = new Signup();
	signup.signupAuthentication();
});