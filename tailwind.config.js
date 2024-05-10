// import theme from './src/theme';
// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: ['./src/**/*.{html,js,svelte,ts}'],
// 	theme,
// 	plugins: [],
// 	darkMode: 'class'
// };
import theme from './src/theme';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme
};

module.exports = config;

// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: ['./src/**/*.{html,js,svelte,ts}'],
// 	theme,
// 	plugins: [],
// 	darkMode: 'class'
// };
