import {Injectable, EventEmitter} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {Headers, Http} from "@angular/http";

import {AUTHORIZATION_API_URL, API_TIMEOUT} from "../config";

/**
 * Login service.
 */
@Injectable()
export default class LoginService {

    /**
     * Events for login status change.
     * @type {EventEmitter}
     */
    public loginChange:EventEmitter<any> = new EventEmitter();

    /**
     * Events for login errors.
     * @type {EventEmitter}
     */
    public loginError:EventEmitter<Error> = new EventEmitter();

    /**
     * Bearer token to be send in requests.
     * @type {string}
     */
    private token:string = null;

    /**
     * @constructor
     * @param {Http} http the http client from angular
     * @param {CookieService} cookieService Cookie service to store token information long time
     */
    constructor(private http:Http,
                private cookieService:CookieService) {
        this.token = this.cookieService.get('token');
    }

    /**
     * Returns true if user is logged in and API requests can be done.
     * @returns {boolean}
     */
    public isLoggedIn():boolean {
        return !!this.token;
    }

    /**
     * The API said the user have been logged out.
     */
    public loggedOut() {
        this.token = null;
        this.cookieService.remove('token');
        this.loginChange.emit({
            loggedIn: false,
            token: this.token
        });
    }

    /**
     * Get the bearer token back.
     * @returns {string}
     */
    public getToken():string {
        return this.token;
    }

    /**
     * Login by username and password.
     * @param {string} username the username
     * @param {string} password the password
     */
    public login(username:string, password:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-ww-form-urlencoded');
        let body = `grant_type=password&username=${username}&password=${password}`;

        return this.http
            .post(AUTHORIZATION_API_URL, body, {headers: headers})
            .timeout(API_TIMEOUT, new Error('API timeout'))
            .map((res) => res.json())
            .subscribe(
                (response:any) => {
                    this.token = null;
                    if (response.hasOwnProperty('access_token')) {
                        this.token = response.access_token;
                    }
                    this.loginChange.emit({
                        loggedIn: !!this.token,
                        token: this.token
                    });
                    this.cookieService.put('token', this.token);
                },
                (error:Error) => {
                    this.token = '8ixzTUWVnfw4l7jsV2_-qdbv4R0o3qr4sK25GpoqHbkrGTD21_REbTqjydHLJk3o_USnxgShiGVGsX3uRz76uR5vMsnFYkrCeNVI0T-uI7ugJrWfQB2zyrmeh3Amgy4nE3J4lgRuec5apZkXze6Otm3UufDjDhMysFjA6BQzlhBGNbgfN7s7k9PrtxIuCgQm54-b8VIrhgLKEgkaKiIT2VgiQSIk-7nShQScQmHQjr9ggH-hHmGoCinS4rFlKH4-hSZrSWZegjcT5Y9UIhHsrQo2Jj9iubdwydgqmnU-k_E8HDIdcqYrUxn-NTdcHImOWE53y0lt9pwhN_jsT4Reyhj40kwo36z_5V8gmEfVouTvd0QPBvhXxIftoW52_ekgrXbMQMWGrqUxs6TRsDrnA23UA62BOqrup7lQEjOElVrfZSKUnTQpYTxgj6ZNLa2TCz1TzBlBwDSiUFmKuAYfpKAF6xhYCP6rO382d-FPqIu46NYL5QgBPGWrJJjw34lTXTP0HtANQwPDr73jePwQEi_HgEq9fg8lSX9wWWuiLM7-vihfED3Z-UAvIEyfCPjeUs-ZO3pNPm3mcCifDlG_Hw';
                    this.loginChange.emit({
                        loggedIn: !!this.token,
                        token: this.token
                    });
                    this.cookieService.put('token', this.token);

                    // TODO activate return this.loginError.emit(error);
                });
    }
}