import { get, writable } from 'svelte/store';

export const theme = writable<'light' | 'dark'>('light');

export function toggleDarkMode() {
	const newTheme = get(theme) === 'light' ? 'dark' : 'light';
	theme.set(newTheme);
	localStorage.setItem('theme', newTheme);
	// toggle classlist
	const html = document.querySelector('html');
	if (html) html.classList.toggle('dark');
}
