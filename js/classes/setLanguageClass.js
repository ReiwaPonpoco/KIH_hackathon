class LanguageSettings {
	constructor() {
		this.languageSelector = document.getElementById('languageSelector');
		this.storedLanguage = localStorage.getItem('selectedLanguage') || 'en';
		this.init();
	}

	init() {
		// ローカルストレージの言語設定をドロップダウンに反映
		this.languageSelector.value = this.storedLanguage;

		this.languageSelector.addEventListener('change', async () => {
			this.handleLanguageChange();
		});
	}

	handleLanguageChange() {
		const selectedLanguage = this.languageSelector.value;
		const previousLanguage = localStorage.getItem('selectedLanguage');

		// 言語が変更された場合、キャッシュをクリア
		if (selectedLanguage !== previousLanguage) {
			localStorage.clear();
		}

		localStorage.setItem('selectedLanguage', selectedLanguage);

		// 現在のページのIDを取得
		const currentPage = document.body.id;

		// 現在のページの翻訳関数を実行
		if (pageTranslators[currentPage]) {
			pageTranslators[currentPage]();
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	new LanguageSettings();
});
