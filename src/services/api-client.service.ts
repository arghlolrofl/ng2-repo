import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {CONSUMER_API_BASE_URL, API_TIMEOUT, AUTHORIZATION_API_URL, API_RETRIES, API_RETRY_DELAY} from '../config';
import LoginService from "./login.service";
import RxUtils from "../utils/rx-utils";

/**
 * API Client Wrapper.
 */
@Injectable()
export default class APIClient {

    /**
     * @constructor
     * @param {Http} http the HTTP client
     * @param {LoginService} loginService the login service
     */
    constructor(private http: Http, private loginService: LoginService) {
    }

    /**
     * HTTP GET request to the API.
     * @param {string} path the path of the API to be requested
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<any>}
     */
    public get(path: string, options?: RequestOptions): Observable<any> {
        try {
            let opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            // workaround, because there is a bug in rc5 of angulars http client.
            // Angular RC5 does not allow sending empty bodies.
            // The bug will soon be fixed as it is already in the master branch of angular
            // https://github.com/angular/angular/pull/10668
            opt.body = '';
            return this.http
                .get(CONSUMER_API_BASE_URL + path, opt)
                .timeout(API_TIMEOUT, new Error('API timeout'))
                .retryWhen(RxUtils.errorDelay(API_RETRIES, API_RETRY_DELAY))
                .map(APIClient.extractJson)
                .catch((error) => {
                    return this.handleError(error);
                });
        } catch (e) {
            return Observable.throw(e);
        }
    }

    /**
     * HTTP POST request to the API.
     * @param {string} path the path of the API to be requested
     * @param {any} data the request data
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<any>}
     */
    public post(path: string, data: any, options?: RequestOptions): Observable<any> {
        try {
            let opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .post(CONSUMER_API_BASE_URL + path, JSON.stringify(data), opt)
                .timeout(API_TIMEOUT, new Error('API timeout'))
                .retryWhen(RxUtils.errorDelay(API_RETRIES, API_RETRY_DELAY))
                .map(APIClient.extractJson)
                .catch((error) => {
                    return this.handleError(error);
                });
        } catch (e) {
            return Observable.throw(e);
        }
    }

    /**
     * HTTP POST request to the API with no response
     * @param {string} path the path of the API to be requested
     * @param {any} data the request data
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<void>}
     */
    public postNoRes(path: string, data: any, options?: RequestOptions): Observable<void> {
        try {
            let opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .post(CONSUMER_API_BASE_URL + path, JSON.stringify(data), opt)
                .timeout(API_TIMEOUT, new Error('API timeout'))
                .retryWhen(RxUtils.errorDelay(API_RETRIES, API_RETRY_DELAY))
                .catch((error) => {
                    return this.handleError(error);
                });
        } catch (e) {
            return Observable.throw(e);
        }
    }

    /**
     * Prepares the authentication header.
     * @returns {RequestOptions} all options (can be modified)
     */
    private prepareHeaders(): RequestOptions {
        if (!this.loginService.isLoggedIn()) {
            throw new Error('User is not logged in');
        }

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.loginService.getToken()
        });
        return new RequestOptions({ headers: headers });
    }

    /**
     * Converts the response object to its JSON representation.
     * @param {Response} res Response to be converted / extracted
     * @returns {Object} response as JS object
     */
    private static extractJson(res: Response) {
        return res.json();
    }

    /**
     * Handles an error and passes it to the observable.
     * @param error The error to get catch
     * @returns {ErrorObservable}
     */
    private handleError(error: any) {
        if (error.status === 405 || error.status === 401) {
            this.loginService.logout();
        }
        return Observable.throw(error);
    }
}