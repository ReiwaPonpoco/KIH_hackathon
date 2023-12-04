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
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // フォームのデフォルトの送信を防止

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // 入力値のバリデーション（例：E-mailの形式、Passwordの長さなど）
        if (!username.includes('@')) {
            errorMessage.textContent = '有効なE-mailアドレスを入力してください。';
            return;
        }
        if (password.length < 6) {
            errorMessage.textContent = 'パスワードは6文字以上で入力してください。';
            return;
        }

        try {
            // ユーザ作成時に Firebase Auth へ登録
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(username, password);

            // 送信成功時の処理
            window.location.href = "signup-success.html"; // リダイレクト先のファイルを指定
        } catch (error) {
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
    });
});
