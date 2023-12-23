document.addEventListener('DOMContentLoaded', setLanguage);

function setLanguage() {
	const languageSelector = getLanguageSelector();
	const storedLanguage = getStoredLanguage() || 'en';
	initializeLanguageSetting(languageSelector, storedLanguage);
	// 言語変更イベントリスナーの設定
	setupLanguageChangeListener(languageSelector);
	// 現在のページのIDを取得し、翻訳する
	const currentPageID = getCurrentPageID();
	translate(currentPageID);
}

function initializeLanguageSetting(languageSelector, storedLanguage) {
	// ローカルストレージの言語設定をドロップダウンに反映
	languageSelector.value = storedLanguage;
	return;
}

function setupLanguageChangeListener(languageSelector) {
	if (languageSelector) {
		languageSelector.addEventListener('change', async function () {
			const selectedLanguage = this.value;
			const previousLanguage = getStoredLanguage();

			if (selectedLanguage !== previousLanguage) {
				clearCache();
				localStorage.setItem('selectedLanguage', selectedLanguage);

				// 現在のページのIDを取得
				const currentPageID = getCurrentPageID();

				// 現在のページの翻訳関数を実行
				translate(currentPageID);
			}
		});
	}
	return;
}

function translate(currentPageID) {
	// 現在のページの翻訳関数を実行
	if (pageTranslators[currentPageID]) {
		pageTranslators[currentPageID]();
	}
	return;
}


function clearCache() {
	localStorage.clear();
	return;
}

function getLanguageSelector() {
	return document.getElementById('languageSelector');
}
function getStoredLanguage() {
	return localStorage.getItem('selectedLanguage');
}

function getCurrentPageID() {
	return document.body.id;
}

