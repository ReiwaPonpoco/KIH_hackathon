// ページごとの翻訳ロジック
const pageTranslators = {
	entrypoint: async function () {
		const signUpButton = document.querySelector('.App .buttons a .b1');
		const logInButton = document.querySelector('.App .buttons a .b2');

		// ハードコードされたオリジナルの英語テキストを設定
		signUpButton.textContent = "Sign up";
		logInButton.textContent = "Log in";

		const elementsToTranslate = [signUpButton, logInButton];
		await translateElements(elementsToTranslate);
	},
	signup: async function () {
		const elementsToTranslate = [
			document.querySelector('.App .back'),
			document.querySelector('.App h2'),
			document.querySelector('label[for="username"]'),
			document.querySelector('label[for="password"]'),
			document.querySelector('#signupForm button')
		];
		await translateElements(elementsToTranslate);
	},
	login: async function () {
		const elementsToTranslate = [
			document.querySelector('.App .back'),
			document.querySelector('.App h2'),
			document.querySelector('label[for="username"]'),
			document.querySelector('label[for="password"]'),
			document.querySelector('#loginForm button')
		];
		await translateElements(elementsToTranslate);
	},
	signup_succes: async function () {
		const elementsToTranslate = [
			document.querySelector('.App h2'),
			document.querySelector('a button'),
		];
		await translateElements(elementsToTranslate);
	},
	login_succes: async function () {
		const elementsToTranslate = [
			document.querySelector('.App h2'),
			document.querySelector('a button'),
		];
		await translateElements(elementsToTranslate);
	},
	home: async function () {
		const elementsToTranslate = [
			document.querySelector('.App .buttons a .b1'),
			document.querySelector('.App .buttons a .b2'),
		];
		await translateElements(elementsToTranslate);
	},
};

async function translateElements(elements) {
	const targetLanguage = localStorage.getItem('selectedLanguage');
	if (!targetLanguage || targetLanguage === 'en') {
		return; // 英語が選択されている場合、または言語設定が存在しない場合は翻訳しない
	}

	for (const element of elements) {
		if (!element) {
			console.error("Element not found.");
			continue;
		}
		const originalText = element.textContent;
		try {
			const translatedText = await getTranslatedText(originalText, targetLanguage);
			element.innerHTML = translatedText;
		} catch (error) {
			console.error("Error translating text:", error);
		}
	}
}

async function getTranslatedText(originalText, targetLanguage) {
	// キャッシュキーを作成
	const cacheKey = `${originalText}-${targetLanguage}`;

	// キャッシュから翻訳を取得
	const cachedTranslation = localStorage.getItem(cacheKey);
	if (cachedTranslation) {
		return cachedTranslation;
	}

	const functionUrl = `https://us-central1-foreignar.cloudfunctions.net/translateContent`;
	const response = await fetch(functionUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text: originalText,
			target: targetLanguage
		})
	});

	if (!response.ok) {
		const errorResponse = await response.text(); // エラーレスポンスの内容を取得
		console.error("Server response:", errorResponse); // エラーレスポンスをコンソールに出力
		throw new Error(`Failed to translate text. Server response: ${errorResponse}`);
	}

	const data = await response.json();

	// 翻訳をキャッシュに保存
	localStorage.setItem(cacheKey, data.translatedText);

	return data.translatedText;
}

// DOMが完全に読み込まれた後に実行する関数
function onPageLoaded() {
	// 現在のページのIDを取得
	const currentPage = document.body.id;
	const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';

	// ローカルストレージの言語設定に基づいて翻訳を実行
	if (pageTranslators[currentPage] && storedLanguage !== 'en') {
		pageTranslators[currentPage]();
	}
}


// DOMContentLoadedイベントを待機して、ページが完全に読み込まれたらonPageLoaded関数を実行
document.addEventListener('DOMContentLoaded', onPageLoaded);