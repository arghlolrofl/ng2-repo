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
 * Base URL of the consumer API.
 * @type {string}
 */
export const CONSUMER_API_BASE_URL = 'http://62.220.24.49/M1Consumer/api/';

/**
 * Authentication API url.
 * @type {string}
 */
export const AUTHORIZATION_API_URL = 'http://62.220.24.49/M1Authentication/token';

// TODO should be removed on live testing
/**
 * Suffix of API files.
 * @type {string}
 */
export const API_SUFFIX = ENVIRONMENT === 'dev' ? '.json' : '';

/**
 * API request timeout.
 * @type {number}
 */
export const API_TIMEOUT = 3000;