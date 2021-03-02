module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parser: 'babel-eslint',
	extends: [
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'nextjs'
	],
	plugins: ['react', 'better-styled-components', 'react-hooks'],
	rules: {
		'no-underscore-dangle': 1,
		'import/prefer-default-export': 1,
		'react/react-in-jsx-scope': 1,
		'react/jsx-filename-extension': 1,
		'react/prefer-stateless-function': 1,
		'react/jsx-pascal-case': 1,
		'jsx-a11y/anchor-is-valid': 1,
		'react/state-in-constructor': 1,
		'react/prop-types': 1,
		'better-styled-components/sort-declarations-alphabetically': 2,
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'quotes': [
			2,
			'double',
			{
				avoidEscape: true
			}
		]
	}
};
