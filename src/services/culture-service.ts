import {Injectable} from '@angular/core';
import {TranslateService} from "ng2-translate";

/**
 * Available language culture names for translation (defaults to the first entry).
 * @type {string[]}
 */
export const AVAILABLE_CULTURES = [
    'en-CA',
    'fr-CA'
];

/**
 * Available culture display names for the available language culture names (see AVAILABLE_CULTURES).
 * @type {string[]}
 */
export const AVAILABLE_CULTURE_DISPLAY_NAMES = [
    'English - Canada',
    'French - Canada'
];

/**
 * Culture API.
 */
@Injectable()
export default class CultureService {

    constructor(private translate: TranslateService) {

    }

    /**
     * Answer the default culture to use while the user is not logged in or has no preferred culture.
     * @returns {string}
     */
    public defaultCulture(): string {
        let candidate = this.translate.getBrowserLang();
        let culture: string;
        console.log('getBrowserLang= ' + candidate);
        culture = AVAILABLE_CULTURES[0];
        if (candidate) {
            for (let c of AVAILABLE_CULTURES) {
                if (c.startsWith(candidate)) {
                    culture = c;
                    break;
                }
            }
        }

        console.log('defaultCulture(): ' + culture);
        return culture;
    }
}
