import { auth, signInWithEmailAndPassword } from '../firebaseConfig.js';

class LoginClass {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.loginErrorMessage = document.getElementById('loginErrorMessage');
        this.loginAuthentication();
    }

    loginAuthentication() {
        this.loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            var loginEmail = document.getElementById('loginEmail').value;
            var loginPassword = document.getElementById('loginPassword').value;
            this.loginUser(loginEmail, loginPassword);
        });
    }

    async loginUser(loginEmail, loginPassword) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            window.location.href = "login-success.html";
        } catch (error) {
            this.errorHandling(error);
        }
    }

    errorHandling(error) {
        console.error("エラー:", error);
        switch (error.code) {
            case 'auth/invalid-email':
                this.loginErrorMessage.textContent = '無効なE-mailアドレスが入力されました。';
                break;
            case 'auth/user-disabled':
                this.loginErrorMessage.textContent = 'このアカウントは無効化されています。';
                break;
            case 'auth/user-not-found':
                this.loginErrorMessage.textContent = 'アカウントが存在しません。';
                break;
            case 'auth/wrong-password':
                this.loginErrorMessage.textContent = 'パスワードが間違っています。';
                break;
            default:
                this.loginErrorMessage.textContent = error.message;
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginClass();
});
