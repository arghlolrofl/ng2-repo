import {Injectable} from '@angular/core';

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
 * Answer the default culture to use while the user is not logged in or has no preferred culture.
 * @returns {string}
 */
function defaultCulture(): string {
    const cultures = AVAILABLE_CULTURES.join('|');

    // w.waitz (05.10.2016)
    // workaround
    // navigator.userLanguage throws an typescript transpile error.
    // why? i don't know
    // access the property per indexer solves this problem
    let userLang = (navigator.language || navigator['userLanguage'] || AVAILABLE_CULTURES[0]);
    userLang = (new RegExp(`(${cultures})`, 'gi')).test(userLang) ? userLang : AVAILABLE_CULTURES[0];

    //console.log(navigator.language);
    //console.log(navigator['userLanguage']);
    //console.log(userLang);

    return userLang;
}

export {defaultCulture};

/**
 * Culture API.
 */
@Injectable()
export default class CultureService {

}
