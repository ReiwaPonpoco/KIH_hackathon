export default function errorHandling(error) {
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

class BaseErrorHandler {
	handle(error) {
		console.error("エラー", error);
		this.displayErrorMessage(error);
	}

	displayErrorMessage(error) {
		// サブクラスでオーバーライド
	}
}

class AuthErrorHandler extends BaseErrorHandler {
	displayErrorMessage(error) {
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
}

export { AuthErrorHandler };