/**
 * Available locales for translation (defaults to en).
 * @type {string[]}
 */
export const AVAILABLE_LOCALES = [
    'en',
    'de'
];

/**
 * Environment setting.
 * @type {string}
 */
export const ENVIRONMENT = 'dev';

/**
 * Base URL of the API.
 * @type {string}
 */
export const API_BASE_URL = '/api/';

// TODO should be removed on live testing
/**
 * Suffix of API files.
 * @type {string}
 */
export const API_SUFFIX = ENVIRONMENT === 'dev' ? '.json' : '';