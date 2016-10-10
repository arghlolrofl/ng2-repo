/**
 * Window object.
 */
const w:any = window;

/**
 * Debug mode.
 */
export const DEBUG_MODE = w.debug;

/**
 * Base URL of the consumer API.
 * @type {string}
 */
export const CONSUMER_API_BASE_URL = 'http://62.220.24.49/M1Consumer/api/';
//export const CONSUMER_API_BASE_URL = 'http://localhost:3494/api/';

/**
 * Authentication Token url.
 * @type {string}
 */
export const AUTHENTICATION_TOKEN_URL = 'http://62.220.24.49/M1Authentication/token';
//export const AUTHORIZATION_API_URL = 'http://localhost:33181/token';

/**
 * Authentication API url.
 * @type {string}
 */
export const AUTHENTICATION_API_URL = 'http://62.220.24.49/M1Authentication/api/';

/**
 * Base URL of the Authentication API.
 * @type {string}
 */
export const AUTHORIZATION_API_BASE_URL = 'http://62.220.24.49/M1Authentication/api/';
//export const AUTHORIZATION_API_BASE_URL = 'http://localhost:33181/api/';

/**
 * API request timeout.
 * @type {number}
 */
export const API_TIMEOUT = 15000;

/**
 * API request retries.
 * @type {number}
 */
export const API_RETRIES = 0;

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

/**
 * Minimum password length.
 * @type {number}
 */
export const MIN_PASSWORD_LENGTH = 6;
