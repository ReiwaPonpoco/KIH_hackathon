export default function submitValidation(username, password) {
	if (!username.includes('@')) {
		errorMessage.textContent = '有効なE-mailアドレスを入力してください。';
		return false;
	}
	if (password.length < 6) {
		errorMessage.textContent = 'パスワードは6文字以上で入力してください。';
		return false;
	}
	return true;
}

class BaseValidation {
	validate() {
		throw new Error("validate method must be implemented");
	}
}

class AuthValidation extends BaseValidation {
	constructor(username, password, errorMessage) {
		super();
		this.username = username;
		this.password = password;
		this.errorMessage = errorMessage;
	}

	validate() {
		if (!this.username.includes('@')) {
			this.errorMessageElement.textContent = '有効なE-mailアドレスを入力してください。';
			return false;
		}
		if (this.password.length < 6) {
			this.errorMessageElement.textContent = 'パスワードは6文字以上で入力してください。';
			return false;
		}
		return true;
	}
}

export { AuthValidation }