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
    public loginChange: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Events for login errors.
     * @type {EventEmitter}
     */
    public loginError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Bearer token to be send in requests.
     * @type {string}
     */
    private token: string = null;

    /**
     * @constructor
     * @param {Http} http the http client from angular
     * @param {CookieService} cookieService Cookie service to store token information long time
     */
    constructor(private http: Http,
        private cookieService: CookieService) {
        this.token = this.cookieService.get('token');

        this.loginChange.subscribe((event) => {
            if (event.loggedIn) {
                this.token = event.token;
                this.cookieService.put('token', event.token);
            } else {
                this.token = null;
                this.cookieService.remove('token');
            }
        });
    }

    /**
     * Returns true if user is logged in and API requests can be done.
     * @returns {boolean}
     */
    public isLoggedIn(): boolean {
        return !!this.token;
    }

    /**
     * The API said the user have been logged out.
     */
    public logout() {
        this.loginChange.emit({ loggedIn: false });
    }

    /**
     * Get the bearer token back.
     * @returns {string}
     */
    public getToken(): string {
        return this.token;
    }

    /**
     * Login by username and password.
     * @param {string} username the username
     * @param {string} password the password
     */
    public login(username: string, password: string) {
        username = encodeURIComponent(username);
        password = encodeURIComponent(password);

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-ww-form-urlencoded');
        let body = `grant_type=password&username=${username}&password=${password}`;

        return this.http
            .post(AUTHORIZATION_API_URL, body, { headers: headers })
            .timeout(API_TIMEOUT, new Error('API timeout'))
            .map((res) => res.json())
            .subscribe(
            (response: any) => {
                if (response.hasOwnProperty('access_token')) {
                    this.loginChange.emit({
                        loggedIn: true,
                        token: response.access_token
                    });
                } else {
                    this.loginChange.emit({ loggedIn: false });
                }
            },
            (error: Error) => this.loginError.emit(error));
    }
}