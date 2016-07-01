"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var config_1 = require('../config');
var login_service_1 = require("./login.service");
var rx_utils_1 = require("../utils/rx-utils");
/**
 * API Client Wrapper.
 */
var APIClient = (function () {
    /**
     * @constructor
     * @param {Http} http the HTTP client
     * @param {LoginService} loginService the login service
     */
    function APIClient(http, loginService) {
        this.http = http;
        this.loginService = loginService;
    }
    /**
     * HTTP GET request to the API.
     * @param {string} path the path of the API to be requested
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<any>}
     */
    APIClient.prototype.get = function (path, options) {
        try {
            var opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .get(config_1.CONSUMER_API_BASE_URL + path, opt)
                .timeout(config_1.API_TIMEOUT, new Error('API timeout'))
                .retryWhen(rx_utils_1.default.errorDelay(config_1.API_RETRIES, config_1.API_RETRY_DELAY))
                .map(APIClient.extractJson)
                .catch(this.handleError);
        }
        catch (e) {
            return Observable_1.Observable.throw(e);
        }
    };
    /**
     * HTTP POST request to the API.
     * @param {string} path the path of the API to be requested
     * @param {any} data the request data
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<any>}
     */
    APIClient.prototype.post = function (path, data, options) {
        try {
            var opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .post(config_1.CONSUMER_API_BASE_URL + path, JSON.stringify(data), opt)
                .timeout(config_1.API_TIMEOUT, new Error('API timeout'))
                .retryWhen(rx_utils_1.default.errorDelay(config_1.API_RETRIES, config_1.API_RETRY_DELAY))
                .map(APIClient.extractJson)
                .catch(this.handleError);
        }
        catch (e) {
            return Observable_1.Observable.throw(e);
        }
    };
    /**
     * HTTP POST request to the API with no response
     * @param {string} path the path of the API to be requested
     * @param {any} data the request data
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<void>}
     */
    APIClient.prototype.postNoRes = function (path, data, options) {
        try {
            var opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .post(config_1.CONSUMER_API_BASE_URL + path, JSON.stringify(data), opt)
                .timeout(config_1.API_TIMEOUT, new Error('API timeout'))
                .retryWhen(rx_utils_1.default.errorDelay(config_1.API_RETRIES, config_1.API_RETRY_DELAY))
                .catch(this.handleError);
        }
        catch (e) {
            return Observable_1.Observable.throw(e);
        }
    };
    /**
     * Prepares the authentication header.
     * @returns {RequestOptions} all options (can be modified)
     */
    APIClient.prototype.prepareHeaders = function () {
        if (!this.loginService.isLoggedIn()) {
            throw new Error('User is not logged in');
        }
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.loginService.getToken()
        });
        return new http_1.RequestOptions({ headers: headers });
    };
    /**
     * Converts the response object to its JSON representation.
     * @param {Response} res Response to be converted / extracted
     * @returns {Object} response as JS object
     */
    APIClient.extractJson = function (res) {
        return res.json();
    };
    /**
     * Handles an error and passes it to the observable.
     * @param error The error to get catch
     * @returns {ErrorObservable}
     */
    APIClient.prototype.handleError = function (error) {
        if (error.status === 405) {
            this.loginService.logout();
        }
        return Observable_1.Observable.throw(error);
    };
    APIClient = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, login_service_1.default])
    ], APIClient);
    return APIClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIClient;
