module.exports = {
	transform: {
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/"
	],
	testEnvironment: 'jest-environment-jsdom',
};
