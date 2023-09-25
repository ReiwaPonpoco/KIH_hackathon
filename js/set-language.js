document.addEventListener('DOMContentLoaded', function () {
	const languageSelector = document.getElementById('languageSelector');

	if (languageSelector) {
		languageSelector.addEventListener('change', async function () {
			const selectedLanguage = this.value;
			localStorage.setItem('selectedLanguage', selectedLanguage);

			// 選択された言語が英語またはデフォルトの場合、翻訳をスキップ
			if (selectedLanguage === 'en' || selectedLanguage === '') {
				buttons.forEach((button, index) => {
					button.textContent = originalTexts[index];
				});
				return;
			}
			// 現在のページのIDを取得
			const currentPage = document.body.id;

			// 現在のページの翻訳関数を実行
			if (pageTranslators[currentPage]) {
				pageTranslators[currentPage]();
			}
		});
	}
});
