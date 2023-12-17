import { auth, createUserWithEmailAndPassword } from '../firebaseConfig.js';
document.cookie = 'cookieName=value; SameSite=None; Secure';

document.addEventListener('DOMContentLoaded', () => {
	const signupForm = document.getElementById('signupForm');
	const errorMessage = document.getElementById('errorMessage');

	signupForm.addEventListener('submit', async (event) => {
		event.preventDefault(); // フォームのデフォルトの送信を防止

		const credentials = {
			username: document.getElementById('username').value,
			password: document.getElementById('password').value
		};

		if (!submitValidation(credentials)) {
			return;
		}

		try {
			// ユーザ作成時にFirebase Authへ登録
			const userCredential = await createUserWithEmailAndPassword(auth, credentials.username, credentials.password);
			// 送信成功時の処理
			window.location.href = "signup-success.html"; // リダイレクト先のファイルを指定します
		} catch (error) {
			errorHandling(error);
		}
	});
});

function submitValidation(credentials) {
	// 入力値のバリデーション（例：E-mailの形式、Passwordの長さなど）
	if (!credentials.username.includes('@')) {
		errorMessage.textContent = '有効なE-mailアドレスを入力してください。';
		return false;
	}
	if (credentials.password.length < 6) {
		errorMessage.textContent = 'パスワードは6文字以上で入力してください。';
		return false;
	}
	return true;
}

function errorHandling(error) {
	console.error("エラー:", error);
	switch (error.code) {
		case 'auth/email-already-in-use':
			errorMessage.textContent = 'このE-mailアドレスはすでに使用されています。';
			break;
		case 'auth/invalid-email':
			errorMessage.textContent = '無効なE-mailアドレスが入力されました。';
			break;
		case 'auth/operation-not-allowed':
			errorMessage.textContent = 'この認証方法は現在利用できません。';
			break;
		case 'auth/weak-password':
			errorMessage.textContent = 'パスワードが弱すぎます。もう一度確認してください。';
			break;
		case 'auth/user-disabled':
			errorMessage.textContent = 'このアカウントは無効化されています。';
			break;
		case 'auth/user-not-found':
			errorMessage.textContent = 'アカウントが存在しません。';
			break;
		case 'auth/wrong-password':
			errorMessage.textContent = 'パスワードが間違っています。';
			break;
		default:
			errorMessage.textContent = error.message; // その他のエラーメッセージを表示
			break;
	}
}
