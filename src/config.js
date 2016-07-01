"use strict";
/**
 * Available locales for translation (defaults to en).
 * @type {string[]}
 */
exports.AVAILABLE_LOCALES = [
    'en',
    'de'
];
/**
 * Base URL of the consumer API.
 * @type {string}
 */
exports.CONSUMER_API_BASE_URL = 'http://62.220.24.49/M1Consumer/api/';
/**
 * Authentication API url.
 * @type {string}
 */
exports.AUTHORIZATION_API_URL = 'http://62.220.24.49/M1Authentication/token';
/**
 * API request timeout.
 * @type {number}
 */
exports.API_TIMEOUT = 3000;
/**
 * API request retries.
 * @type {number}
 */
exports.API_RETRIES = 5;
/**
 * API request retry delay.
 * @type {number}
 */
exports.API_RETRY_DELAY = 1000;
