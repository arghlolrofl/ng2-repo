import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ENVIRONMENT, API_BASE_URL, API_SUFFIX, API_TIMEOUT} from '../config';
import LoginService from "./login.service";
import {logInfo} from "typings/dist/support/cli";

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
    constructor(private http:Http, private loginService:LoginService) {
    }

    /**
     * HTTP GET request to the API.
     * @param {string} path the path of the API to be requested
     * @param {RequestOptions} options additional options to pass to the server
     * @returns {Observable<any>}
     */
    public get(path:string, options?:RequestOptions):Observable<any> {
        try {
            let opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .get(API_BASE_URL + path + API_SUFFIX, opt)
                .timeout(API_TIMEOUT, new Error('API timeout'))
                .map(APIClient.extractJson)
                .catch(this.handleError);
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
    public post(path:string, data:any, options?:RequestOptions):Observable<any> {
        if (ENVIRONMENT === 'dev') {
            return this.get(path, options);
        }
        try {
            let opt = this.prepareHeaders();
            if (options) {
                opt = opt.merge(options);
            }
            return this.http
                .post(API_BASE_URL + path + API_SUFFIX, JSON.stringify(data), opt)
                .timeout(API_TIMEOUT, new Error('API timeout'))
                .map(APIClient.extractJson)
                .catch(this.handleError);
        } catch (e) {
            return Observable.throw(e);
        }
    }

    /**
     * Prepares the authentication header.
     * @returns {RequestOptions} all options (can be modified)
     */
    private prepareHeaders():RequestOptions {
        if (!this.loginService.isLoggedIn()) {
            throw new Error('User is not logged in');
        }

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.loginService.getToken()
        });
        return new RequestOptions({headers: headers});
    }

    /**
     * Converts the response object to its JSON representation.
     * @param {Response} res Response to be converted / extracted
     * @returns {Object} response as JS object
     */
    private static extractJson(res:Response) {
        return res.json();
    }

    /**
     * Handles an error and passes it to the observable.
     * @param error The error to get catch
     * @returns {ErrorObservable}
     */
    private handleError(error:any) {
        if (error.status === 405) {
            this.loginService.loggedOut();
        }
        return Observable.throw(error);
    }
}