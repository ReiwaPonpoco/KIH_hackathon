// ページごとの翻訳ロジック
const pageTranslators = {
	entrypoint: async function () {
		await translatePageElements(['.App .buttons a .b1', '.App .buttons a .b2'], ["Sign up", "Log in"]);
	},
	signup: async function () {
		await translatePageElements(
			['.App .back', '.App h2', 'label[for="username"]', 'label[for="password"]', '#signupForm button']
		);
	},
	login: async function () {
		await translatePageElements(
			['.App .back', '.App h2', 'label[for="username"]', 'label[for="password"]', '#loginForm button']
		);
	},
	signup_success: async function () {
		await translatePageElements(['.App h2', 'a button']);
	},
	login_success: async function () {
		await translatePageElements(['.App h2', 'a button']);
	},
	home: async function () {
		await translatePageElements(['.App .buttons a .b1', '.App .buttons a .b2']);
	},
};

async function translatePageElements(selectors, originalTexts = []) {
	const elements = selectors.map(selector => document.querySelector(selector));
	await translateElements(elements, originalTexts);
}

async function translateElements(elements, originalTexts = []) {
	const targetLanguage = localStorage.getItem('selectedLanguage');
	if (!targetLanguage || targetLanguage === 'en') return;

	elements.forEach(async (element, index) => {
		if (!element) {
			console.error("Element not found.");
			return;
		}
		const originalText = originalTexts[index] || element.textContent;
		try {
			const translatedText = await getTranslatedText(originalText, targetLanguage);
			element.innerHTML = translatedText;
		} catch (error) {
			console.error("Error translating text:", error);
		}
	});
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
