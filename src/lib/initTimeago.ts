import { register } from 'timeago.js';
import spanishLocale from 'timeago.js/lib/lang/es';

export function initialize() {
	register('es', spanishLocale);
}
