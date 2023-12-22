document.addEventListener('DOMContentLoaded', function () {
	setLanguage();

	// 現在のページのIDを取得
	const currentPage = document.body.id;
	
	// 現在のページの翻訳関数を実行
	if (pageTranslators[currentPage]) {
		pageTranslators[currentPage]();
	}
});

function setLanguage() {
	const languageSelector = document.getElementById('languageSelector');
	const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';

	// ローカルストレージの言語設定をドロップダウンに反映
	languageSelector.value = storedLanguage;

	if (languageSelector) {
		languageSelector.addEventListener('change', async function () {
			const selectedLanguage = this.value;
			const previousLanguage = localStorage.getItem('selectedLanguage');

			cacheClear();
			function cacheClear() {
				// 言語が変更された場合、キャッシュをクリア
				if (selectedLanguage !== previousLanguage) {
					localStorage.clear();
				}
			}

			localStorage.setItem('selectedLanguage', selectedLanguage);
		});
	}
}
