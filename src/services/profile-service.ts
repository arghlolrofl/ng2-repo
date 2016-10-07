import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {AUTHORIZATION_API_BASE_URL} from '../config';
import APIClient from './api-client.service';
import UserClaim from '../models/profile/user-claim';
import SetPassword from '../models/profile/set-password';
import {Response} from "@angular/http";


@Injectable()
export default class ProfileService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient: APIClient) {
    }

    /**
     * Get all user claims.
     * @returns {Observable<Array<UserClaim>>}
     */
    public getUserClaims(): Observable<Array<UserClaim>> {
        return this.apiClient.get('Account/UserClaims', AUTHORIZATION_API_BASE_URL);
    }

    /**
     * Post the new pw to the backend.
     * @param pw
     */
    public setPassword(pw: SetPassword): Observable<Response> {
        return this.apiClient.post('Account/SetPassword', pw, AUTHORIZATION_API_BASE_URL);
    }

    /**
     * Post the new preferred culture to the backend.
     * @param culture
     */
    public setPreferredCulture(culture: string): Observable<Response> {
        console.log('setPreferredCulture: ' + culture);
        return this.apiClient.post('Account/SetPreferredCulture', culture, AUTHORIZATION_API_BASE_URL);
    }
}