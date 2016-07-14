/**
 * Debug mode.
 */
export const DEBUG_MODE = true;

/**
 * Available locales for translation (defaults to en).
 * @type {string[]}
 */
export const AVAILABLE_LOCALES = [
    'en',
    'de'
];

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

/**
 * API request timeout.
 * @type {number}
 */
export const API_TIMEOUT = 3000;

/**
 * API request retries.
 * @type {number}
 */
export const API_RETRIES = 5;

/**
 * API request retry delay.
 * @type {number}
 */
export const API_RETRY_DELAY = 1000;

/**
 * Max. autocomplete result.
 * @type {number}
 */
export const MAX_AC_RESULTS = 5;

/**
 * HTTP Status Codes that should fail early. 
 * If the error code is not in this list N retries will be executed.
 */
export const EARLY_FAIL_HTTP_STATUS_CODES = [400];