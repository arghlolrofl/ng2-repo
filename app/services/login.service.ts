import {Injectable, EventEmitter} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

/**
 * Login service.
 */
@Injectable()
export default class LoginService {

    /**
     * Events for login status change.
     * @type {EventEmitter}
     */
    public loginChanged: EventEmitter<any> = new EventEmitter();

    /**
     * Bearer token to be send in requests.
     * @type {string}
     */
    private token: string = null;

    /**
     * @constructor
     * @param cookieService Cookie service to store token information long time
     */
    constructor(private cookieService: CookieService) {
        this.token = this.cookieService.get('token');

        // TODO remove sample code
        setTimeout(() => {
            this.token = '4711';
            this.cookieService.put('token', this.token);
            this.loginChanged.emit({
                loggedIn: true,
                token: this.token
            });
        }, 10000);
    }

    /**
     * Returns true if user is logged in and API requests can be done.
     * @returns {boolean}
     */
    public isLoggedIn():boolean {
        return !!this.token;
    }

    /**
     * Get the bearer token back.
     * @returns {string}
     */
    public getToken():string {
        return this.token;
    }
}