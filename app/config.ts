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
export const ENVIRONMENT = 'stg';

/**
 * Base URL of the API.
 * @type {string}
 */
export const API_BASE_URL = 'http://62.220.24.49/M1Consumer/api/';

// TODO should be removed on live testing
/**
 * Suffix of API files.
 * @type {string}
 */
export const API_SUFFIX = ENVIRONMENT === 'dev' ? '.json' : '';