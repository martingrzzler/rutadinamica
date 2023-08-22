import { derived, writable } from 'svelte/store';
import translations from './translations';

type Locale = keyof typeof translations;
type Key = keyof typeof translations.en;

export const locale = writable('en' as const);
export const locale2Emoji = {
	en: '🇬🇧',
	es: '🇪🇸'
};
export const locales = Object.keys(translations);

function translate(locale: Locale, key: Key, vars: Record<string, string> = {}) {
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const t = derived(
	locale,
	($locale) =>
		(key: Key, vars: Record<string, string> = {}) =>
			translate($locale, key, vars)
);
