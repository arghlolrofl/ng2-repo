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
var core_2 = require('angular2-cookie/core');
var http_1 = require("@angular/http");
var config_1 = require("../config");
/**
 * Login service.
 */
var LoginService = (function () {
    /**
     * @constructor
     * @param {Http} http the http client from angular
     * @param {CookieService} cookieService Cookie service to store token information long time
     */
    function LoginService(http, cookieService) {
        var _this = this;
        this.http = http;
        this.cookieService = cookieService;
        /**
         * Events for login status change.
         * @type {EventEmitter}
         */
        this.loginChange = new core_1.EventEmitter();
        /**
         * Events for login errors.
         * @type {EventEmitter}
         */
        this.loginError = new core_1.EventEmitter();
        /**
         * Bearer token to be send in requests.
         * @type {string}
         */
        this.token = null;
        this.token = this.cookieService.get('token');
        this.loginChange.subscribe(function (event) {
            if (event.loggedIn) {
                _this.token = event.token;
                _this.cookieService.put('token', event.token);
            }
            else {
                _this.token = null;
                _this.cookieService.remove('token');
            }
        });
    }
    /**
     * Returns true if user is logged in and API requests can be done.
     * @returns {boolean}
     */
    LoginService.prototype.isLoggedIn = function () {
        return !!this.token;
    };
    /**
     * The API said the user have been logged out.
     */
    LoginService.prototype.logout = function () {
        this.loginChange.emit({ loggedIn: false });
    };
    /**
     * Get the bearer token back.
     * @returns {string}
     */
    LoginService.prototype.getToken = function () {
        return this.token;
    };
    /**
     * Login by username and password.
     * @param {string} username the username
     * @param {string} password the password
     */
    LoginService.prototype.login = function (username, password) {
        var _this = this;
        username = encodeURIComponent(username);
        password = encodeURIComponent(password);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-ww-form-urlencoded');
        var body = "grant_type=password&username=" + username + "&password=" + password;
        return this.http
            .post(config_1.AUTHORIZATION_API_URL, body, { headers: headers })
            .timeout(config_1.API_TIMEOUT, new Error('API timeout'))
            .map(function (res) { return res.json(); })
            .subscribe(function (response) {
            if (response.hasOwnProperty('access_token')) {
                _this.loginChange.emit({
                    loggedIn: true,
                    token: response.access_token
                });
            }
            else {
                _this.loginChange.emit({ loggedIn: false });
            }
        }, function (error) { return _this.loginError.emit(error); });
    };
    LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, core_2.CookieService])
    ], LoginService);
    return LoginService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginService;
